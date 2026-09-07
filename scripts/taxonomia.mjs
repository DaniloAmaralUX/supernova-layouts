/**
 * O vocabulario que o produto entende.
 *
 * Este arquivo existe porque ha duas taxonomias diferentes no ecossistema e
 * confundi-las custa caro:
 *
 *   1. A taxonomia FISICA do registro — `registry:ui`, `registry:block`,
 *      `registry:page` — que decide em que pasta o item mora e como a CLI do
 *      shadcn o trata. Ela vive em `PASTA_POR_TIPO`, em registry-lib.mjs.
 *
 *   2. A taxonomia que a PESSOA ve no Supernova — Components, Blocks, App UI.
 *      Ela vive aqui. Quem procura uma tela de login nao deveria precisar
 *      saber que o item e um `registry:page`.
 *
 * O `supernova-ui` classifica por (2) e nao le nada de (1). Os valores abaixo
 * sao os mesmos de `src/lib/catalog/catalog-contract.ts` e
 * `src/lib/blocks/categories.ts` no produto: `assertCategory` la reprova
 * categoria desconhecida, entao um valor novo aqui sem o par de la quebra a
 * build do site. Mudar uma lista exige mudar a outra, de proposito.
 */

/** Prateleiras que ESTE registro pode alimentar. */
export const COLECOES = ["components", "blocks", "app-ui"]

/**
 * Categorias por colecao.
 *
 * `blocks` e `app-ui` usam os oito rotulos que o produto ja tem em
 * CATEGORY_ORDER. `components` estreia com familias de componente, que sao
 * outra coisa: uma prateleira de unidades reutilizaveis nao se organiza por
 * assunto de pagina, e sim pelo que a peca faz.
 */
export const CATEGORIAS_POR_COLECAO = {
  components: [
    "Ações",
    "Entrada",
    "Exibição",
    "Navegação",
    "Feedback",
    "Sobreposição",
  ],
  blocks: [
    "Marketing",
    "Conteúdo",
    "Páginas",
    "Navegação",
    "Interface",
  ],
  "app-ui": [
    "Produto",
    "Autenticação",
    "Formulários",
  ],
}

/** Estados que um item pode declarar. Catalogar nao e prometer. */
export const MATURIDADES = ["stable", "beta"]

/**
 * Origens reconhecidas. `origin` diz de quem e o codigo, nao quem o publica:
 * um componente da Iconiq distribuido pelo Supernova continua sendo da Iconiq.
 */
export const ORIGENS = ["supernova", "iconiq", "shadcn"]

/** Licencas que este registro aceita distribuir. */
export const LICENCAS = ["MIT", "proprietario"]

/**
 * Grupos do experimento `supernova-catalogo`, preservados como etiqueta.
 *
 * O `src/data/catalogo.ts` do experimento mapeou 18 familias de tela. Isso e
 * informacao de produto e nao se perde na migracao — mas tambem nao vira
 * estrutura fisica de pasta. Vira `tags`, e o `check` confere que a etiqueta
 * usada e uma destas.
 */
export const FAMILIAS_DO_EXPERIMENTO = [
  "layouts", "forms", "auth", "dashboards", "tables", "filters",
  "empty-states", "settings", "cards", "modals", "charts", "timelines",
  "calendars", "profile", "toasts", "pricing", "tours", "threads",
]

/**
 * Pastas cujos itens aparecem numa prateleira do produto.
 *
 * Um hook, um utilitario e um conjunto tambem sao itens de registro, mas eles
 * chegam junto com o que a pessoa escolheu, nao por escolha propria. Exigir
 * `collection` deles seria inventar prateleira para quem nao aparece em
 * nenhuma. Proveniencia, porem, todo item declara: licenca vale para o codigo,
 * nao para a vitrine.
 */
const PASTAS_DE_VITRINE = new Set(["ui", "components", "blocks", "pages"])

/**
 * Confere o bloco `meta.supernova` de um item.
 *
 * `pastaRaiz` decide o rigor: item de vitrine declara prateleira e categoria;
 * item de apoio declara so a proveniencia.
 *
 * Devolve uma lista de mensagens. Vazia significa aprovado.
 */
export function conferirMetadados(item, pastaRaiz) {
  const problemas = []
  const meta = item.meta?.supernova
  const naVitrine = PASTAS_DE_VITRINE.has(pastaRaiz)

  if (!meta) {
    problemas.push(
      `Item "${item.name}" não tem "meta.supernova". Todo item deste registro ` +
        `declara ao menos de quem é o código e sob que licença.`,
    )
    return problemas
  }

  if (!naVitrine) {
    // Item de apoio: sem prateleira, mas a proveniencia continua obrigatoria.
    return [...problemas, ...conferirProveniencia(item, meta)]
  }

  if (!COLECOES.includes(meta.collection)) {
    problemas.push(
      `Item "${item.name}": collection "${meta.collection}" não existe. ` +
        `Use uma de: ${COLECOES.join(", ")}.`,
    )
  } else {
    const permitidas = CATEGORIAS_POR_COLECAO[meta.collection]
    if (!permitidas.includes(meta.category)) {
      problemas.push(
        `Item "${item.name}": category "${meta.category}" não vale para a ` +
          `coleção "${meta.collection}". Use uma de: ${permitidas.join(", ")}.`,
      )
    }
  }

  if (!MATURIDADES.includes(meta.maturity)) {
    problemas.push(
      `Item "${item.name}": maturity "${meta.maturity}" não existe. ` +
        `Use uma de: ${MATURIDADES.join(", ")}.`,
    )
  }

  if (!Array.isArray(meta.tags) || meta.tags.length === 0) {
    problemas.push(
      `Item "${item.name}" não tem "tags". Elas são o que a busca do produto ` +
        `encontra além do título.`,
    )
  }

  return [...problemas, ...conferirProveniencia(item, meta)]
}

/** A parte que vale para todo item, de vitrine ou de apoio. */
function conferirProveniencia(item, meta) {
  const problemas = []
  const proveniencia = meta.provenance

  if (!proveniencia) {
    problemas.push(
      `Item "${item.name}" não tem "meta.supernova.provenance". Todo item ` +
        `deste registro declara de quem é o código e sob que licença.`,
    )
    return problemas
  }

  if (!ORIGENS.includes(proveniencia.origin)) {
    problemas.push(
      `Item "${item.name}": origin "${proveniencia.origin}" não é reconhecida. ` +
        `Use uma de: ${ORIGENS.join(", ")}.`,
    )
  }

  if (!LICENCAS.includes(proveniencia.license)) {
    problemas.push(
      `Item "${item.name}": license "${proveniencia.license}" não é aceita ` +
        `neste registro. Use uma de: ${LICENCAS.join(", ")}.`,
    )
  }

  // Codigo de terceiro sem endereco do upstream e atribuicao pela metade.
  if (proveniencia.origin !== "supernova" && !proveniencia.upstream) {
    problemas.push(
      `Item "${item.name}" vem de "${proveniencia.origin}" mas não declara ` +
        `"upstream". Atribuição sem endereço não permite conferir a origem.`,
    )
  }

  if (typeof proveniencia.adapted !== "boolean") {
    problemas.push(
      `Item "${item.name}": "adapted" precisa ser true ou false — diz se o ` +
        `código foi modificado em relação ao original.`,
    )
  }

  return problemas
}
