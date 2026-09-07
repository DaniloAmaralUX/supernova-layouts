# styles — base de estilo

**Tipo do registro:** `registry:style`

A camada que um projeto instala **uma vez**, antes de qualquer componente:
reset, tokens, camadas do Tailwind, fontes, utilitários de animação.

## O que entra

- Itens com `css` e `cssVars` que valem para o projeto inteiro.
- Dependências de fonte declaradas em `dependencies`.

## O que não entra

- Paletas alternativas — isso é `themes/`.
- Estilo de um componente só. Mantenha junto do próprio componente.

## Diferença entre `styles/` e `themes/`

`styles/` é o alicerce e vem primeiro. `themes/` é a pintura e pode ser trocada
quantas vezes quiser sem reinstalar o alicerce.
