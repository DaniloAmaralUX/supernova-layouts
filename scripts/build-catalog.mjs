#!/usr/bin/env node
/**
 * Gera o CATALOG.md a partir do registro resolvido.
 *
 * O motivo de existir: sem isto, saber o que ha neste repositorio exige abrir
 * dez registry.json ou rodar comando. O catalogo poe tudo numa pagina que o
 * GitHub renderiza sozinho, com o titulo em portugues, o link para a pasta e o
 * comando de instalacao ja montado.
 *
 * Uso:
 *   node scripts/build-catalog.mjs           escreve o CATALOG.md
 *   node scripts/build-catalog.mjs --check   so confere se esta atualizado
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import {
  RAIZ,
  PASTA_POR_TIPO,
  ROTULO_DA_PASTA,
  ENDERECO_BASE,
  resolverRegistro,
  caminhoDoArquivo,
} from "./registry-lib.mjs"

const somenteConferir = process.argv.includes("--check")
const DESTINO = join(RAIZ, "CATALOG.md")

const { itens, erros } = resolverRegistro()

if (erros.length > 0) {
  console.error("Não consegui resolver o registro:")
  for (const erro of erros) console.error(`  - ${erro}`)
  process.exit(1)
}

/** Agrupa por pasta de tipo, na ordem em que as pastas foram declaradas. */
const porPasta = new Map(Object.keys(PASTA_POR_TIPO).map((p) => [p, []]))
for (const entrada of itens) {
  if (!porPasta.has(entrada.pastaRaiz)) porPasta.set(entrada.pastaRaiz, [])
  porPasta.get(entrada.pastaRaiz).push(entrada)
}

const linhas = []
linhas.push("# Catálogo")
linhas.push("")
linhas.push(
  "Tudo que este registro publica hoje. **Arquivo gerado** por " +
    "`npm run catalog` — não edite à mão; edite o `registry.json` da pasta " +
    "e rode o comando.",
)
linhas.push("")
linhas.push(`Total: **${itens.length}** ${itens.length === 1 ? "item" : "itens"}.`)
linhas.push("")

for (const [pasta, entradas] of porPasta) {
  const rotulo = ROTULO_DA_PASTA[pasta] ?? pasta
  linhas.push(`## ${rotulo} — \`${pasta}/\``)
  linhas.push("")

  if (entradas.length === 0) {
    linhas.push(
      `Nada aqui ainda. O que entra e o que não entra está em [\`${pasta}/README.md\`](${pasta}/README.md).`,
    )
    linhas.push("")
    continue
  }

  linhas.push("| Item | O que é | Onde mora | Instalar |")
  linhas.push("| --- | --- | --- | --- |")

  for (const entrada of entradas.sort((a, b) => a.item.name.localeCompare(b.item.name, "pt-BR"))) {
    const { item } = entrada
    const titulo = item.title ?? item.name
    const descricao = (item.description ?? "—").replace(/\|/g, "\\|")

    // A pasta do item e a pasta do primeiro arquivo. Conjuntos nao tem
    // arquivo, entao caem na pasta de tipo.
    const primeiro = item.files?.[0]
    const onde = primeiro
      ? caminhoDoArquivo(entrada, primeiro).split("/").slice(0, -1).join("/")
      : `${entrada.pastaRaiz}`

    linhas.push(
      `| **${titulo}**<br><code>${item.name}</code> | ${descricao} | [\`${onde}\`](${onde}) | \`npx shadcn@latest add ${ENDERECO_BASE}/${item.name}\` |`,
    )
  }
  linhas.push("")
}

linhas.push("---")
linhas.push("")
linhas.push(
  "As tabelas acima descrevem cada item por escrito. Uma vitrine com imagem " +
    "de cada layout ainda não existe — está registrada como próximo passo em " +
    "[CHANGELOG.md](CHANGELOG.md). Até lá, o jeito de ver um layout é instalar " +
    "num projeto, ou abrir o arquivo pelo link da coluna “Onde mora”.",
)
linhas.push("")

const conteudo = linhas.join("\n")

if (somenteConferir) {
  const atual = existsSync(DESTINO) ? readFileSync(DESTINO, "utf8") : ""
  if (atual !== conteudo) {
    console.error(
      "CATALOG.md está desatualizado em relação ao registro.\n" +
        "Rode `npm run catalog` e inclua o resultado no commit.",
    )
    process.exit(1)
  }
  console.log("CATALOG.md está atualizado.")
} else {
  writeFileSync(DESTINO, conteudo)
  console.log(`CATALOG.md gerado com ${itens.length} item(ns).`)
}
