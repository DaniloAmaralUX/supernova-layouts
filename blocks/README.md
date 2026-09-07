# blocks — seções de página

**Tipo do registro:** `registry:block`

O coração deste repositório. Um bloco é uma seção inteira, pronta para ser
empilhada com outras: um herói, uma tabela de preços, um rodapé.

Um bloco tem conteúdo de exemplo e recebe dados por propriedades. Ele não busca
dados sozinho e não decide rota.

## Subpastas por domínio

| Pasta | Para que serve |
| --- | --- |
| `marketing/` | Herói, chamadas, recursos, preços, depoimentos, FAQ, prova social, time, logos, comparativos |
| `application/` | Cascas de aplicação, cabeçalhos, barras laterais, rodapés de painel, diálogos, estados vazios, onboarding |
| `commerce/` | Listagem de produtos, carrinho, checkout, planos |
| `content/` | Blog, galeria, linha do tempo, portfólio, artigos |
| `forms/` | Layouts de formulário, envio de arquivo, campos em várias etapas |
| `data/` | Gráficos, estatísticas, indicadores, painéis de widget |

Se um bloco novo não couber em nenhuma delas, isso é sinal de conversa — abra
uma issue antes de criar uma sétima pasta.

## O que não entra

- Páginas inteiras com rota — isso é `pages/`.
- Peças pequenas reaproveitadas por vários blocos — isso é `components/`.

## Como nomear

Domínio, depois pasta do bloco em `kebab-case`:

```
blocks/
└── marketing/
    └── hero-supernova/
        └── hero-supernova.tsx
```

O nome do item precisa ser único no repositório inteiro, não apenas dentro da
pasta. Prefira nomes que digam a função: `pricing-three-tiers`, não `pricing-2`.
