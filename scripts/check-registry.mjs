#!/usr/bin/env node
/**
 * Confere as regras deste repositorio antes que o `shadcn build` rode.
 *
 * O build da CLI reclama de schema invalido, mas nao sabe das nossas regras:
 * uma pasta por tipo, nome unico no repositorio inteiro, nenhum arquivo orfao.
 * E isso que este script cobre.
 *
 * Uso: node scripts/check-registry.mjs
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import { join, relative, dirname, posix, sep } from "node:path"
import { fileURLToPath } from "node:url"

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..")

/** Pasta na raiz -> tipo de item que ela aceita. */
const PASTA_POR_TIPO = {
  ui: "registry:ui",
  components: "registry:component",
  blocks: "registry:block",
  pages: "registry:page",
  themes: "registry:theme",
  styles: "registry:style",
  hooks: "registry:hook",
  lib: "registry:lib",
  files: "registry:file",
  bundles: "registry:item",
}

/** Tipos de arquivo que o schema do shadcn exige acompanhar de `target`. */
const EXIGEM_TARGET = new Set(["registry:page", "registry:file"])

/** Extensoes que contam como fonte de item, para achar arquivo orfao. */
const EXTENSOES_FONTE = [".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md"]

/** Arquivos que moram numa pasta de tipo sem pertencer a item nenhum. */
const ISENTOS = new Set(["registry.json", "README.md"])

const erros = []
const avisos = []

function lerJson(caminho) {
  try {
    return JSON.parse(readFileSync(caminho, "utf8"))
  } catch (causa) {
    erros.push(`Nao consegui ler ${relativo(caminho)}: ${causa.message}`)
    return null
  }
}

function relativo(caminho) {
  return relative(RAIZ, caminho).split(sep).join(posix.sep)
}

/**
 * Percorre o registry.json da raiz e os arquivos que ele inclui.
 * Devolve cada item junto do arquivo que o declarou, porque os caminhos de
 * `files[].path` sao relativos a esse arquivo — nao a raiz.
 */
function coletarItens() {
  const coletados = []
  const visitados = new Set()

  function visitar(caminhoRegistro) {
    if (visitados.has(caminhoRegistro)) {
      erros.push(`Inclusao circular ou repetida: ${relativo(caminhoRegistro)}`)
      return
    }
    visitados.add(caminhoRegistro)

    if (!existsSync(caminhoRegistro)) {
      erros.push(`registry.json incluido mas inexistente: ${relativo(caminhoRegistro)}`)
      return
    }

    const registro = lerJson(caminhoRegistro)
    if (!registro) return

    for (const item of registro.items ?? []) {
      coletados.push({ item, declaradoEm: caminhoRegistro })
    }

    for (const incluido of registro.include ?? []) {
      visitar(join(dirname(caminhoRegistro), incluido))
    }
  }

  visitar(join(RAIZ, "registry.json"))
  return coletados
}

/** Lista recursiva de arquivos de uma pasta, ignorando o que nao e fonte. */
function listarArquivos(pasta) {
  if (!existsSync(pasta)) return []
  const encontrados = []

  for (const entrada of readdirSync(pasta)) {
    const caminho = join(pasta, entrada)
    if (statSync(caminho).isDirectory()) {
      encontrados.push(...listarArquivos(caminho))
    } else if (EXTENSOES_FONTE.some((ext) => entrada.endsWith(ext))) {
      encontrados.push(caminho)
    }
  }

  return encontrados
}

// ---------------------------------------------------------------------------

const coletados = coletarItens()

if (coletados.length === 0) {
  avisos.push("Nenhum item no registro. Isso e esperado so num repositorio recem-criado.")
}

// Regra 1 — o nome do item e unico no repositorio inteiro, nao so na pasta.
const vistos = new Map()
for (const { item, declaradoEm } of coletados) {
  if (!item.name) {
    erros.push(`Item sem "name" em ${relativo(declaradoEm)}`)
    continue
  }
  if (vistos.has(item.name)) {
    erros.push(
      `Nome duplicado "${item.name}": ${relativo(vistos.get(item.name))} e ${relativo(declaradoEm)}`,
    )
  } else {
    vistos.set(item.name, declaradoEm)
  }
}

// Regra 2 — o tipo do item combina com a pasta em que ele foi declarado.
for (const { item, declaradoEm } of coletados) {
  const pastaRaiz = relativo(declaradoEm).split(posix.sep)[0]
  const tipoEsperado = PASTA_POR_TIPO[pastaRaiz]
  if (!tipoEsperado) continue
  if (item.type !== tipoEsperado) {
    erros.push(
      `Item "${item.name}" e do tipo "${item.type}" mas foi declarado em ${pastaRaiz}/, ` +
        `que so aceita "${tipoEsperado}". Mova o item para a pasta certa.`,
    )
  }
}

// Regra 3 — todo arquivo declarado existe, e `target` esta presente onde o
// schema exige. Guarda os caminhos para a regra 4.
const declarados = new Set()
for (const { item, declaradoEm } of coletados) {
  for (const arquivo of item.files ?? []) {
    if (!arquivo.path) {
      erros.push(`Item "${item.name}" tem um arquivo sem "path"`)
      continue
    }

    const absoluto = join(dirname(declaradoEm), arquivo.path)
    if (!existsSync(absoluto)) {
      erros.push(
        `Item "${item.name}" declara ${arquivo.path}, que nao existe ` +
          `(procurei em ${relativo(absoluto)})`,
      )
    } else {
      declarados.add(relativo(absoluto))
    }

    if (EXIGEM_TARGET.has(arquivo.type) && !arquivo.target) {
      erros.push(
        `Item "${item.name}": o arquivo ${arquivo.path} e do tipo "${arquivo.type}", ` +
          `que exige "target". Sem ele a CLI nao sabe onde escrever.`,
      )
    }
  }

  const semArquivo = (item.files ?? []).length === 0
  const semDependencia = (item.registryDependencies ?? []).length === 0
  const semEstilo = !item.cssVars && !item.css
  if (semArquivo && semDependencia && semEstilo) {
    erros.push(
      `Item "${item.name}" nao entrega nada: sem arquivo, sem registryDependencies ` +
        `e sem cssVars. Instalar esse item nao faria efeito nenhum.`,
    )
  }
}

// Regra 4 — nenhum arquivo de fonte fica solto numa pasta de tipo sem que
// algum item o declare. Arquivo orfao nunca chega em quem instala.
for (const pasta of Object.keys(PASTA_POR_TIPO)) {
  for (const arquivo of listarArquivos(join(RAIZ, pasta))) {
    const rel = relativo(arquivo)
    const nome = rel.split(posix.sep).at(-1)
    if (ISENTOS.has(nome)) continue
    if (!declarados.has(rel)) {
      erros.push(
        `Arquivo orfao: ${rel} existe mas nenhum item o declara. ` +
          `Declare no registry.json da pasta ou remova o arquivo.`,
      )
    }
  }
}

// Regra 5 — toda pasta de tipo tem README e registry.json proprios.
for (const pasta of Object.keys(PASTA_POR_TIPO)) {
  for (const obrigatorio of ["README.md", "registry.json"]) {
    const caminho = join(RAIZ, pasta, obrigatorio)
    if (!existsSync(caminho)) {
      erros.push(`Falta ${pasta}/${obrigatorio}. Toda pasta de tipo precisa dos dois.`)
    }
  }
}

// ---------------------------------------------------------------------------

for (const aviso of avisos) console.warn(`aviso: ${aviso}`)

if (erros.length > 0) {
  console.error(`\n${erros.length} problema(s) no registro:\n`)
  for (const erro of erros) console.error(`  - ${erro}`)
  console.error("")
  process.exit(1)
}

console.log(`registro conferido: ${coletados.length} item(ns), nenhum problema.`)
