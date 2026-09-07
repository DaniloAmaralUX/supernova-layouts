#!/usr/bin/env node
/**
 * Prova que o comando que mostramos funciona na máquina de quem o copia.
 *
 * Todo o resto deste repositório pode estar verde e a instalação ainda falhar
 * para quem instala: schema válido não é arquivo entregue, e arquivo entregue
 * não é import reescrito para o alias de quem recebe. Este script fecha essa
 * distância rodando a CLI **real** do shadcn contra um projeto descartável.
 *
 * Dois modos, porque provam coisas diferentes:
 *
 *   local (padrão)  Serve o `.registry-build/` num servidor efêmero e instala
 *                   de lá. Prova o código desta árvore — inclusive alterações
 *                   que ainda não foram para o `main`. É o modo do PR.
 *
 *   --github        Instala pelo endereço documentado ao usuário,
 *                   `DaniloAmaralUX/supernova-layouts/<item>`. Prova o
 *                   repositório publicado, não a árvore local. É o modo da
 *                   execução agendada e do pós-merge.
 *
 * O que se afirma em qualquer modo: os arquivos chegaram, os imports apontam
 * para os aliases do consumidor (que são de propósito diferentes dos nossos) e
 * a diretiva de cliente sobreviveu.
 *
 * O que NÃO se afirma: que o projeto compila. Este repositório não tem React
 * nem as dependências de runtime das telas — instalá-las aqui só para o teste
 * seria carregar um app inteiro num registro. Compilação é responsabilidade do
 * gate do produto, que tem o ambiente para isso.
 *
 * Uso:
 *   node scripts/verify-instalacao.mjs
 *   node scripts/verify-instalacao.mjs --github
 *   node scripts/verify-instalacao.mjs --item auth-login --item micro-rotulo
 */

import { execFile } from "node:child_process"
import { promisify } from "node:util"

/**
 * `execFile` assíncrono, e não `execFileSync`.
 *
 * A versão síncrona bloqueia o laço de eventos deste processo — e o servidor
 * que entrega o registro para a CLI mora aqui dentro. Bloqueado o laço, o
 * servidor não responde, a CLI fica esperando a resposta que nunca vem, e o
 * teste trava sem imprimir uma linha. O sintoma não aponta para a causa em
 * nenhum momento: parece lentidão de rede.
 */
const executar = promisify(execFile)
import { createServer } from "node:http"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { RAIZ, ENDERECO_BASE, resolverRegistro } from "./registry-lib.mjs"

const SAIDA_DO_BUILD = join(RAIZ, ".registry-build")

/**
 * O fixture mora FORA do repositório, no temporário do sistema.
 *
 * Dentro de `.tmp/` ele parecia mais arrumado, e não funcionava: a CLI do
 * shadcn sobe a árvore de diretórios procurando a configuração do projeto, e
 * daqui de dentro ela encontrava o `components.json` e o `node_modules` da
 * raiz deste repositório em vez dos do fixture. O teste ficava pendurado sem
 * dizer por quê. Um projeto descartável precisa estar mesmo descolado.
 */
const TMP = tmpdir()

/**
 * A amostra representativa. Um de cada forma que o registro entrega:
 * uma página (que puxa primitivo do shadcn, componente nosso e tokens),
 * um componente nosso e um hook. Se as três chegam, o mecanismo funciona.
 */
const AMOSTRA = ["auth-login", "micro-rotulo", "use-media-query"]

const argumentos = process.argv.slice(2)
const modoGithub = argumentos.includes("--github")
const pedidos = argumentos.flatMap((a, i) =>
  a === "--item" && argumentos[i + 1] ? [argumentos[i + 1]] : [],
)
const alvos = pedidos.length > 0 ? pedidos : AMOSTRA

/** Serve uma pasta, reescrevendo as dependências internas para este servidor. */
function servir(diretorio) {
  const servidor = createServer((req, res) => {
    const nome = decodeURIComponent((req.url ?? "/").split("?")[0]).replace(/^\//, "")
    const caminho = join(diretorio, nome)

    if (!caminho.startsWith(diretorio) || !existsSync(caminho)) {
      res.writeHead(404).end("não encontrado")
      return
    }

    const porta = servidor.address().port
    // Um item deste registro depende dos outros pelo endereço do GitHub, que é
    // o certo para quem instala. Aqui isso mandaria a CLI buscar o `main`
    // publicado em vez desta árvore — e o teste passaria a provar o repositório
    // de ontem. A troca acontece só no que este servidor entrega.
    const conteudo = readFileSync(caminho, "utf8").replaceAll(
      new RegExp(`${ENDERECO_BASE}/([a-z0-9-]+)`, "g"),
      `http://127.0.0.1:${porta}/$1.json`,
    )

    res.writeHead(200, {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    })
    res.end(conteudo)
  })

  return new Promise((resolve) => {
    // Porta 0: o sistema escolhe uma livre. Porta fixa faz o teste brigar com
    // qualquer outra coisa rodando na máquina.
    servidor.listen(0, "127.0.0.1", () =>
      resolve({
        origem: `http://127.0.0.1:${servidor.address().port}`,
        fechar: () => new Promise((r) => servidor.close(() => r())),
      }),
    )
  })
}

/**
 * Um projeto novo em folha, com os aliases PADRÃO do shadcn.
 *
 * Eles são de propósito diferentes dos nossos (`@/components/supernova/...`):
 * se a reescrita de imports estiver errada, o arquivo instalado aponta para um
 * caminho que só existe aqui, e a pessoa recebe um import quebrado.
 */
function criarFixture(base) {
  const fixture = join(base, "fixture")
  mkdirSync(join(fixture, "src", "app"), { recursive: true })
  mkdirSync(join(fixture, "src", "lib"), { recursive: true })

  writeFileSync(
    join(fixture, "components.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "new-york",
        rsc: true,
        tsx: true,
        tailwind: { config: "", css: "src/app/globals.css", baseColor: "neutral", cssVariables: true },
        iconLibrary: "lucide",
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
      },
      null,
      2,
    ),
  )

  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify(
      {
        name: "fixture-consumidor",
        version: "0.0.0",
        private: true,
        dependencies: { next: "16.3.0", react: "19.2.4", "react-dom": "19.2.4" },
      },
      null,
      2,
    ),
  )

  /*
   * O fixture precisa PARECER um projeto Next, e não só declarar o pacote.
   *
   * A CLI do shadcn só escreve arquivo do tipo `registry:page` quando detecta
   * o framework, e a detecção passa pelo arquivo de configuração — a
   * dependência no package.json sozinha não basta. Sem isto, a CLI termina com
   * êxito, escreve as dependências do item e **pula a página em silêncio**: o
   * teste dá verde e o artefato principal nunca chegou.
   *
   * Foi assim que a primeira versão deste script aprovou 18 telas que não
   * instalavam. Este arquivo de três bytes é o que separa as duas coisas.
   */
  writeFileSync(join(fixture, "next.config.ts"), "export default {};\n")
  writeFileSync(
    join(fixture, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }, null, 2),
  )
  writeFileSync(join(fixture, "src", "app", "globals.css"), '@import "tailwindcss";\n')
  writeFileSync(
    join(fixture, "src", "lib", "utils.ts"),
    'export function cn(...c: unknown[]) {\n  return c.filter(Boolean).join(" ");\n}\n',
  )

  return fixture
}

/** Todo arquivo .tsx/.ts sob o fixture, relativo a ele. */
function arquivosInstalados(fixture) {
  const encontrados = []
  const andar = (pasta, prefixo) => {
    for (const entrada of readdirSync(pasta, { withFileTypes: true })) {
      if (entrada.name === "node_modules") continue
      const rel = prefixo ? `${prefixo}/${entrada.name}` : entrada.name
      if (entrada.isDirectory()) andar(join(pasta, entrada.name), rel)
      else if (/\.tsx?$/.test(entrada.name)) encontrados.push(rel)
    }
  }
  andar(fixture, "")
  return encontrados
}

/**
 * Onde os arquivos declarados por um item devem aparecer no projeto de destino.
 *
 * `target` é o caminho que o próprio item declara. Quando ele não existe — o
 * schema só o exige para página e arquivo —, a CLI decide pelo tipo, e aí a
 * conferência fica com a pasta que a CLI usa para cada um.
 */
const PASTA_POR_TIPO_DE_ARQUIVO = {
  "registry:ui": "components/ui",
  "registry:component": "components",
  "registry:hook": "hooks",
  "registry:lib": "lib",
}

function alvosDoItem(nome) {
  const entrada = resolverRegistro().itens.find((e) => e.item.name === nome)
  if (!entrada) return []

  return (entrada.item.files ?? []).flatMap((arquivo) => {
    if (arquivo.target) return [arquivo.target]
    const pasta = PASTA_POR_TIPO_DE_ARQUIVO[arquivo.type]
    if (!pasta) return []
    return [`${pasta}/${arquivo.path.split("/").at(-1)}`]
  })
}

const problemas = []
const relatos = []

async function main() {
  if (!modoGithub && !existsSync(SAIDA_DO_BUILD)) {
    console.error("Falta .registry-build/. Rode `npm run build` antes.")
    process.exit(1)
  }

  // Os nomes pedidos existem mesmo? Errar o nome não deve virar "instalação
  // falhou", que manda procurar o defeito no lugar errado.
  const { itens } = resolverRegistro()
  const conhecidos = new Set(itens.map((e) => e.item.name))
  const desconhecidos = alvos.filter((nome) => !conhecidos.has(nome))
  if (desconhecidos.length > 0) {
    console.error(`Item inexistente no registro: ${desconhecidos.join(", ")}`)
    process.exit(1)
  }

  mkdirSync(TMP, { recursive: true })
  const base = mkdtempSync(join(TMP, "instalacao-"))
  const servidor = modoGithub ? null : await servir(SAIDA_DO_BUILD)

  try {
    for (const nome of alvos) {
      const fixture = criarFixture(join(base, nome))
      const endereco = modoGithub
        ? `${ENDERECO_BASE}/${nome}`
        : `${servidor.origem}/${nome}.json`

      console.log(`\n▸ ${nome}`)
      console.log(`  npx shadcn@latest add ${endereco}`)

      try {
        await executar(
          process.execPath,
          [join(RAIZ, "node_modules", "shadcn", "dist", "index.js"), "add", endereco, "--yes", "--overwrite"],
          {
            cwd: fixture,
            // Entrada padrão fechada: a CLI e o npm que ela chama não têm o que
            // ler daqui, e uma entrada aberta que nunca recebe nada é convite a
            // esperar por ela.
            stdio: ["ignore", "pipe", "pipe"],
            // O npm fala muito. Um megabyte, o padrão, estoura no meio da
            // instalação de um item com muitas dependências.
            maxBuffer: 32 * 1024 * 1024,
            timeout: 300_000,
          },
        )
      } catch (causa) {
        // A saída da CLI é o que diz o que houve. Quando ela vem vazia — e vem,
        // em erro de spawn ou estouro de tempo — o motivo está na exceção, e
        // engoli-lo transforma uma falha explicável em "a CLI falhou".
        const saida = [
          causa.stdout?.toString().trim(),
          causa.stderr?.toString().trim(),
          causa.status != null ? `código de saída: ${causa.status}` : null,
          causa.signal ? `sinal: ${causa.signal}` : null,
          causa.message,
        ]
          .filter(Boolean)
          .join("\n")
        problemas.push(
          `${nome}: a CLI falhou.\n${saida.split("\n").map((l) => `      ${l}`).join("\n")}`,
        )
        continue
      }

      const instalados = arquivosInstalados(fixture)
      const nossos = instalados.filter((c) => !c.startsWith("src/lib/utils") && c !== "next.config.ts")

      if (nossos.length === 0) {
        problemas.push(`${nome}: a CLI terminou sem erro mas não escreveu arquivo nenhum.`)
        continue
      }

      // "Chegou algum arquivo" não é a pergunta. A pergunta é se chegou o
      // arquivo DESTE item — as dependências chegam de qualquer jeito, e um
      // teste que se contenta com elas dá verde quando o item principal não foi
      // escrito. Foi exatamente o que aconteceu na primeira versão deste script.
      const esperados = alvosDoItem(nome)
      const faltando = esperados.filter(
        (alvo) => !existsSync(join(fixture, alvo)) && !existsSync(join(fixture, "src", alvo)),
      )
      if (faltando.length > 0) {
        problemas.push(
          `${nome}: a CLI terminou sem erro, mas o arquivo do próprio item não chegou:\n` +
            faltando.map((a) => `      ${a}`).join("\n") +
            `\n      chegaram: ${nossos.join(", ")}`,
        )
        continue
      }

      // Nenhum arquivo entregue pode carregar um alias que só existe aqui.
      for (const caminho of nossos) {
        const conteudo = readFileSync(join(fixture, caminho), "utf8")
        if (conteudo.includes("@/design/")) {
          problemas.push(`${nome}: ${caminho} ainda importa de @/design/ — alias do experimento, não do consumidor.`)
        }
        if (/^\s*["']use client["']/.test(conteudo) === false && conteudo.includes('"use client"')) {
          problemas.push(`${nome}: ${caminho} tem "use client" fora da primeira linha — vira componente de servidor.`)
        }
      }

      relatos.push(`${nome}: ${nossos.length} arquivo(s)`)
      for (const caminho of nossos.sort()) console.log(`    ${caminho}`)
    }
  } finally {
    await servidor?.fechar()
    rmSync(base, { recursive: true, force: true })
  }

  console.log("")
  if (problemas.length > 0) {
    console.error(`${problemas.length} problema(s) na instalação:\n`)
    for (const problema of problemas) console.error(`  - ${problema}`)
    console.error("")
    process.exit(1)
  }

  console.log(`instalação conferida pela CLI real (${modoGithub ? "GitHub" : "árvore local"}):`)
  for (const relato of relatos) console.log(`  ✓ ${relato}`)
}

main()
