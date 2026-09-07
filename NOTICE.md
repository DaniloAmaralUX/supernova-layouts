# Avisos de origem — Supernova Layouts

Este arquivo registra a origem do que existe neste repositório. Ele é mantido
como registro verificável, não como formalidade.

Última atualização: 7 de setembro de 2026.

## Estado atual

Neste momento o repositório contém apenas:

- A estrutura de pastas e os arquivos `registry.json` de composição.
- A documentação em português.
- Dois itens autorais de referência: `hero-supernova` e `use-media-query`.
- O script `scripts/check-registry.mjs`.

**Não há código de terceiros vendorizado neste repositório.** Nenhum arquivo
foi copiado de outro projeto.

## Dependências externas, e por que não são cópia

Os itens declaram dependências que a CLI do shadcn instala do registro oficial,
em vez de trazerem cópias:

- **shadcn/ui** (© 2023 shadcn, licença MIT) — o item `hero-supernova` declara
  `"registryDependencies": ["button"]`. O botão vem do registro oficial do
  shadcn no momento da instalação. Nenhum arquivo do shadcn/ui está versionado
  aqui.

Sempre que um item novo precisar de um primitivo já existente, ele deve fazer o
mesmo: declarar a dependência, não copiar o arquivo.

## O que foi deliberadamente deixado de fora

O repositório irmão `supernova-ui` distribui 54 blocos originários do
**shadcn/studio** (© 2025 ThemeSelection), cuja licença traz uma cláusula de
produtos concorrentes:

> **Competing Products:** The Software shall not be used to create any product
> or service that directly competes with shadcn/studio.

Um catálogo público de layouts instaláveis é exatamente o tipo de produto que
essa cláusula alcança. Por isso **nenhum daqueles 54 blocos foi trazido para
este repositório**, nem em forma adaptada.

A taxonomia de categorias em `blocks/` e `pages/` — nomes como `hero-section`
ou `pricing-component` — descreve funções de interface de uso corrente no setor
e não reproduz código, texto ou arranjo visual daquele projeto.

## Como manter este arquivo verdadeiro

Ao trazer qualquer arquivo de fora para este repositório, registre aqui, antes
de abrir o pull request:

- autor e detentor do copyright;
- URL da origem e a revisão exata consultada;
- licença e onde está o texto dela;
- o que foi alterado em relação ao original.

Se você não consegue preencher esses quatro pontos, o arquivo não entra.
