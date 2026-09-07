/**
 * Resolucao do registro, compartilhada pelos scripts.
 *
 * O `registry.json` da raiz so tem `include`. Os itens moram nos registry.json
 * de cada pasta de tipo, e os caminhos em `files[].path` sao relativos ao
 * arquivo que os declara — nao a raiz. Quem precisa dos itens precisa dessa
 * regra junto, por isso ela mora aqui e nao duplicada em cada script.
 */

import { readFileSync, existsSync } from "node:fs"
import { join, relative, dirname, posix, sep } from "node:path"
import { fileURLToPath } from "node:url"

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..")

/** Pasta na raiz -> tipo de item que ela aceita. */
export const PASTA_POR_TIPO = {
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

/** Rotulo legivel de cada pasta, para a vitrine. */
export const ROTULO_DA_PASTA = {
  ui: "Primitivos",
  components: "Componentes compostos",
  blocks: "Seções de página",
  pages: "Páginas completas",
  themes: "Temas",
  styles: "Base de estilo",
  hooks: "Hooks",
  lib: "Utilitários",
  files: "Arquivos de projeto",
  bundles: "Conjuntos",
}

/** Endereco pelo qual a CLI do shadcn instala um item deste repositorio. */
export const ENDERECO_BASE = "DaniloAmaralUX/supernova-layouts"

/** Caminho relativo a raiz, sempre com barra normal. */
export function relativo(caminho) {
  return relative(RAIZ, caminho).split(sep).join(posix.sep)
}

/**
 * Percorre o registry.json da raiz e tudo que ele inclui.
 *
 * Devolve `{ itens, erros }`. Cada item vem com `declaradoEm` (caminho absoluto
 * do registry.json que o declarou) e `pastaRaiz` (a pasta de tipo).
 */
export function resolverRegistro() {
  const itens = []
  const erros = []
  const visitados = new Set()

  function visitar(caminhoRegistro) {
    if (visitados.has(caminhoRegistro)) {
      erros.push(`Inclusão circular ou repetida: ${relativo(caminhoRegistro)}`)
      return
    }
    visitados.add(caminhoRegistro)

    if (!existsSync(caminhoRegistro)) {
      erros.push(`registry.json incluído mas inexistente: ${relativo(caminhoRegistro)}`)
      return
    }

    let registro
    try {
      registro = JSON.parse(readFileSync(caminhoRegistro, "utf8"))
    } catch (causa) {
      erros.push(`Não consegui ler ${relativo(caminhoRegistro)}: ${causa.message}`)
      return
    }

    for (const item of registro.items ?? []) {
      itens.push({
        item,
        declaradoEm: caminhoRegistro,
        pastaRaiz: relativo(caminhoRegistro).split(posix.sep)[0],
      })
    }

    for (const incluido of registro.include ?? []) {
      visitar(join(dirname(caminhoRegistro), incluido))
    }
  }

  visitar(join(RAIZ, "registry.json"))
  return { itens, erros }
}

/** Caminho, relativo a raiz, de um arquivo declarado por um item. */
export function caminhoDoArquivo(entrada, arquivo) {
  return relativo(join(dirname(entrada.declaradoEm), arquivo.path))
}
