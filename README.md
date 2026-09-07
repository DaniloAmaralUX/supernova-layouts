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

Para encurtar, registre um apelido no `components.json` do seu projeto:

```json
{
  "registries": {
    "@supernova-layouts": "DaniloAmaralUX/supernova-layouts"
  }
}
```

E então:

```bash
npx shadcn@latest add @supernova-layouts/hero-supernova
```

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

## Verificar antes de abrir um PR

```bash
npm install
npm run verify
```

`npm run check` confere as regras próprias deste repositório: nome duplicado,
arquivo declarado que não existe, arquivo existente que ninguém declarou,
`target` faltando onde o schema exige.

`npm run build` roda o `shadcn build` de verdade e escreve em `.registry-build/`,
que é descartável e não vai para o Git. Se ele passar, a instalação funciona.

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
