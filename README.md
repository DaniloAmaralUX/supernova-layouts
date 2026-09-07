# Supernova Layouts

Registro de layouts do design system **Supernova**. Cada item aqui é instalado
direto no projeto de quem usa, pela CLI do shadcn, com um comando.

Este repositório **é** o registro. Não existe servidor, não existe build
obrigatório e não existe pacote publicado no npm: a CLI lê o `registry.json`
da raiz direto do GitHub.

## Instalar um item

```bash
npx shadcn@latest add DaniloAmaralUX/supernova-layouts/hero-supernova
```

Os dois primeiros trechos do endereço são o dono e o repositório. O que vem
depois é o **nome do item**, não um caminho de arquivo.

Esse endereço completo é a única forma que funciona aqui. O apelido curto do
`components.json` — `"registries": { "@algo": "..." }` — só vale para registro
servido por URL, e a CLI recusa a configuração se você apontar um repositório
do GitHub nela. Vale para quem instala e vale também para um item daqui
depender de outro: ver `bundles/registry.json`.

> Se o repositório passar a ser privado, a instalação continua funcionando para
> quem tem acesso: basta um `gh auth login`, ou a variável `GH_TOKEN` com um
> token de leitura restrito a este repositório.

## Uma pasta por tipo

A raiz tem uma pasta para cada tipo de item que o registro do shadcn reconhece.
O tipo diz o que a coisa é; a pasta diz onde ela mora. Não há exceção.

| Pasta | Tipo | O que guarda |
| --- | --- | --- |
| [`ui/`](ui) | `registry:ui` | Primitivos: botão, campo, rótulo |
| [`components/`](components) | `registry:component` | Composições de primitivos |
| [`blocks/`](blocks) | `registry:block` | Seções de página: herói, preços, rodapé |
| [`pages/`](pages) | `registry:page` | Telas completas, com rota |
| [`themes/`](themes) | `registry:theme` | Paletas e variáveis de aparência |
| [`styles/`](styles) | `registry:style` | Base de estilo, tokens, fontes |
| [`hooks/`](hooks) | `registry:hook` | Comportamento sem interface |
| [`lib/`](lib) | `registry:lib` | Funções puras |
| [`files/`](files) | `registry:file` | Arquivos avulsos de projeto |
| [`bundles/`](bundles) | `registry:item` | Kits que instalam vários itens juntos |

Cada pasta tem o próprio `README.md` dizendo o que entra e o que não entra, e o
próprio `registry.json` com os itens dela.

`blocks/` e `pages/` ainda se dividem por domínio — `marketing`, `application`,
`commerce`, `content`, `forms`, `data` — porque é onde o volume cresce.

## Como o registro é montado

O `registry.json` da raiz não lista item nenhum. Ele só compõe:

```json
{
  "name": "supernova-layouts",
  "include": [
    "ui/registry.json",
    "blocks/registry.json",
    "hooks/registry.json"
  ]
}
```

Cada `registry.json` de pasta declara os caminhos **relativos a ele mesmo**. Na
resolução, os caminhos viram relativos à raiz do repositório automaticamente.

Isso tem uma consequência prática: quem adiciona um layout mexe em um arquivo
pequeno, dentro da própria pasta. Duas pessoas trabalhando em domínios
diferentes não colidem no mesmo JSON.

O nome de cada item, porém, precisa ser único **no repositório inteiro** — não
apenas dentro da pasta.

## O que já existe

O [**catálogo**](CATALOG.md) lista todos os itens publicados, com o nome
legível, a descrição, o link para a pasta e o comando de instalação já montado.
Ele é **gerado** a partir dos `registry.json` por `npm run catalog`, e a CI
reprova quando ele fica desatualizado — então o que está escrito lá é o que a
CLI realmente entrega.

O catálogo ainda é texto. Uma vitrine com imagem de cada layout não existe e
está anotada como próximo passo no [CHANGELOG.md](CHANGELOG.md).

## Verificar antes de abrir um PR

```bash
npm install
npm run verify
```

`npm run verify` faz três coisas:

1. `check` — as regras próprias deste repositório: nome duplicado, item na
   pasta errada para o tipo dele, nome que colide com primitivo do shadcn,
   nome terminado em número, arquivo declarado que não existe, arquivo
   existente que ninguém declarou, `target` faltando onde o schema exige.
2. `catalog:check` — se o `CATALOG.md` ainda bate com o registro. Se não bate,
   rode `npm run catalog` e inclua o resultado no commit.
3. `build` — o `shadcn build` de verdade, escrevendo em `.registry-build/`, que
   é descartável e não vai para o Git.

Se os três passam, a instalação funciona.

## Documentação

- [Como adicionar um layout](docs/como-adicionar-um-layout.md)
- [Taxonomia: onde cada coisa mora](docs/taxonomia.md)
- [Convenções de código e nomes](docs/convencoes.md)
- [Instalação e consumo](docs/instalacao.md)
- [Como contribuir](CONTRIBUTING.md)

## Relação com os outros repositórios

Este repositório trata de **layouts**. O produto Supernova — catálogo, temas e
efeitos — vive em `supernova-ui` e tem o próprio registro, sob o apelido
`@supernova-ui`. Os dois são independentes: um item daqui não depende de nada
de lá, e vice-versa.

## Licença

Ver [LICENSE.md](LICENSE.md). Ver também [NOTICE.md](NOTICE.md), que registra a
origem do que existe neste repositório.
