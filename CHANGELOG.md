# Registro de mudanças

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Versões seguem [SemVer](https://semver.org/lang/pt-BR/).

Para este registro, o que conta como quebra é o que muda o resultado de quem já
instalou um item: renomear ou remover item, mudar `target` de arquivo, alterar
variável de tema já publicada.

## [Não publicado]

### Adicionado

- Estrutura inicial do registro: uma pasta por tipo de item do shadcn
  (`ui`, `components`, `blocks`, `pages`, `themes`, `styles`, `hooks`, `lib`,
  `files`, `bundles`), cada uma com `README.md` e `registry.json` próprios.
- Composição do registro pela chave `include` do `registry.json` da raiz.
- Subdivisão por domínio em `blocks/` e `pages/`.
- `hero-supernova`, bloco autoral de referência.
- `use-media-query`, hook autoral de referência.
- `kit-inicial`, conjunto que instala os dois itens de referência.
- `scripts/check-registry.mjs`, que confere nome duplicado, tipo fora da pasta,
  arquivo declarado inexistente, arquivo órfão e `target` faltando.
- Verificação automática em pull request e em `main`.
- Documentação em `docs/` e regras de contribuição.
