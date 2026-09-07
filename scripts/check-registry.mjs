#!/usr/bin/env node
/**
 * Confere as regras deste repositorio antes que o `shadcn build` rode.
 *
 * O build da CLI reclama de schema invalido, mas nao sabe das nossas regras:
 * uma pasta por tipo, nome unico no repositorio inteiro, nenhum arquivo orfao,
 * nenhum nome que colida com primitivo do shadcn. E isso que este script cobre.
 *
 * Uso: node scripts/check-registry.mjs
 */

import { readdirSync, existsSync, statSync } from "node:fs"
import { join } from "node:path"
import {
  RAIZ,
  PASTA_POR_TIPO,
  ENDERECO_BASE,
  relativo,
  resolverRegistro,
  caminhoDoArquivo,
} from "./registry-lib.mjs"
import { conferirMetadados } from "./taxonomia.mjs"

/** Tipos de arquivo que o schema do shadcn exige acompanhar de `target`. */
const EXIGEM_TARGET = new Set(["registry:page", "registry:file"])

/** Extensoes que contam como fonte de item, para achar arquivo orfao. */
const EXTENSOES_FONTE = [".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md"]

/** Arquivos que moram numa pasta de tipo sem pertencer a item nenhum. */
const ISENTOS = new Set(["registry.json", "README.md"])

/**
 * Nomes tomados pelo registro oficial do shadcn. Um item nosso com um desses
 * nomes deixa `registryDependencies: ["button"]` ambiguo para a CLI.
 */
const NOMES_DO_SHADCN = new Set([
  "accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge",
  "breadcrumb", "button", "calendar", "card", "carousel", "chart", "checkbox",
  "collapsible", "combobox", "command", "context-menu", "dialog", "drawer",
  "dropdown-menu", "field", "form", "hover-card", "input", "input-group",
  "input-otp", "label", "menubar", "navigation-menu", "pagination", "popover",
  "progress", "radio-group", "resizable", "scroll-area", "select", "separator",
  "sheet", "sidebar", "skeleton", "slider", "sonner", "spinner", "switch",
  "table", "tabs", "textarea", "toggle", "toggle-group", "tooltip", "utils",
])

const erros = []
const avisos = []

const { itens: coletados, erros: errosDeResolucao } = resolverRegistro()
erros.push(...errosDeResolucao)

if (coletados.length === 0) {
  avisos.push("Nenhum item no registro. Isso é esperado só num repositório recém-criado.")
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
for (const { item, pastaRaiz } of coletados) {
  const tipoEsperado = PASTA_POR_TIPO[pastaRaiz]
  if (!tipoEsperado) continue
  if (item.type !== tipoEsperado) {
    erros.push(
      `Item "${item.name}" é do tipo "${item.type}" mas foi declarado em ${pastaRaiz}/, ` +
        `que só aceita "${tipoEsperado}". Mova o item para a pasta certa.`,
    )
  }
}

// Regra 3 — nome legivel, sem colisao e sem numero de variante.
for (const { item } of coletados) {
  if (!item.name) continue

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.name)) {
    erros.push(`Nome "${item.name}" não está em kebab-case.`)
  }

  if (NOMES_DO_SHADCN.has(item.name)) {
    erros.push(
      `Nome "${item.name}" é o mesmo de um item do registro oficial do shadcn. ` +
        `Isso torna "registryDependencies": ["${item.name}"] ambíguo. Escolha outro nome.`,
    )
  }

  if (/-\d+$/.test(item.name)) {
    erros.push(
      `Nome "${item.name}" termina em número. Número não diz o que a variante tem de ` +
        `diferente: use "split", "centered", "stacked", "with-form" e assim por diante.`,
    )
  }

  if (!item.title) {
    erros.push(`Item "${item.name}" não tem "title". Ele é o nome legível no catálogo.`)
  }
  if (!item.description) {
    erros.push(`Item "${item.name}" não tem "description". Ela é a única explicação no catálogo.`)
  }
}

// Regra 4 — dependencia entre itens deste repositorio usa o endereco completo.
// Um apelido tipo "@supernova-layouts/x" exigiria que quem instala tivesse um
// registro por URL configurado, e este registro e lido direto do GitHub.
// Com apelido a instalacao falha pedindo "registries" no components.json.
for (const { item } of coletados) {
  for (const dependencia of item.registryDependencies ?? []) {
    if (dependencia.startsWith("@supernova-layouts/")) {
      const alvo = dependencia.slice("@supernova-layouts/".length)
      erros.push(
        `Item "${item.name}" depende de "${dependencia}". Esse apelido não existe ` +
          `para um registro lido do GitHub. Use "${ENDERECO_BASE}/${alvo}".`,
      )
    }
  }
}

// Regra 5 — todo arquivo declarado existe, e `target` esta presente onde o
// schema exige. Guarda os caminhos para a regra 6.
const declarados = new Set()
for (const entrada of coletados) {
  const { item } = entrada

  for (const arquivo of item.files ?? []) {
    if (!arquivo.path) {
      erros.push(`Item "${item.name}" tem um arquivo sem "path"`)
      continue
    }

    const caminho = caminhoDoArquivo(entrada, arquivo)
    if (!existsSync(join(RAIZ, caminho))) {
      erros.push(
        `Item "${item.name}" declara ${arquivo.path}, que não existe (procurei em ${caminho})`,
      )
    } else {
      declarados.add(caminho)
    }

    if (EXIGEM_TARGET.has(arquivo.type) && !arquivo.target) {
      erros.push(
        `Item "${item.name}": o arquivo ${arquivo.path} é do tipo "${arquivo.type}", ` +
          `que exige "target". Sem ele a CLI não sabe onde escrever.`,
      )
    }
  }

  const semArquivo = (item.files ?? []).length === 0
  const semDependencia = (item.registryDependencies ?? []).length === 0
  const semEstilo = !item.cssVars && !item.css
  if (semArquivo && semDependencia && semEstilo) {
    erros.push(
      `Item "${item.name}" não entrega nada: sem arquivo, sem registryDependencies ` +
        `e sem cssVars. Instalar esse item não faria efeito nenhum.`,
    )
  }
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

// Regra 6 — nenhum arquivo de fonte fica solto numa pasta de tipo sem que
// algum item o declare. Arquivo orfao nunca chega em quem instala.
for (const pasta of Object.keys(PASTA_POR_TIPO)) {
  for (const arquivo of listarArquivos(join(RAIZ, pasta))) {
    const rel = relativo(arquivo)
    const nome = rel.split("/").at(-1)
    if (ISENTOS.has(nome)) continue
    if (!declarados.has(rel)) {
      erros.push(
        `Arquivo órfão: ${rel} existe mas nenhum item o declara. ` +
          `Declare no registry.json da pasta ou remova o arquivo.`,
      )
    }
  }
}

// Regra 7 — toda pasta de tipo tem README e registry.json proprios, e toda
// subpasta de dominio tem README. Pasta sem README vira pasta sem dono.
for (const pasta of Object.keys(PASTA_POR_TIPO)) {
  for (const obrigatorio of ["README.md", "registry.json"]) {
    if (!existsSync(join(RAIZ, pasta, obrigatorio))) {
      erros.push(`Falta ${pasta}/${obrigatorio}. Toda pasta de tipo precisa dos dois.`)
    }
  }
}

for (const pasta of ["blocks", "pages"]) {
  const base = join(RAIZ, pasta)
  if (!existsSync(base)) continue
  for (const dominio of readdirSync(base)) {
    const caminho = join(base, dominio)
    if (!statSync(caminho).isDirectory()) continue
    if (!existsSync(join(caminho, "README.md"))) {
      erros.push(
        `Falta ${pasta}/${dominio}/README.md. Toda pasta de domínio diz o que aceita.`,
      )
    }
  }
}

// Regra 8 — todo item declara `meta.supernova`: prateleira, categoria,
// etiquetas, maturidade e proveniencia. Sem isso o produto nao sabe onde
// mostrar o item, a busca nao o encontra, e a atribuicao de licenca fica
// dependendo de alguem lembrar de escrever num arquivo separado.
for (const { item, pastaRaiz } of coletados) {
  erros.push(...conferirMetadados(item, pastaRaiz))
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
