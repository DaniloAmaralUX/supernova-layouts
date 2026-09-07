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
  nome em colisão com primitivo do shadcn, nome terminado em número, arquivo
  declarado inexistente, arquivo órfão, `target` faltando e pasta sem README.
- `CATALOG.md` gerado por `scripts/build-catalog.mjs`, com o comando de
  instalação de cada item já montado.
- Verificação automática em pull request e em `main`.
- Documentação em `docs/` e regras de contribuição.

### Próximo passo conhecido

- **Vitrine com imagem.** Hoje só existe descrição por escrito no `CATALOG.md`.
  Para escolher um layout sem instalar, falta uma imagem por item — o caminho
  provável é um `example.tsx` de nome fixo em cada pasta de item e um
  `preview.png` gerado dele na CI. Não foi feito, e o catálogo diz isso.
