# lib — utilitários

**Tipo do registro:** `registry:lib`

Funções puras, sem React e sem estado: formatação, validação, cálculo,
manipulação de texto e data.

## O que entra

- Funções que dariam no mesmo em qualquer framework.
- Constantes compartilhadas por vários itens.

## O que não entra

- Qualquer coisa com `useState`, `useEffect` ou JSX — isso é `hooks/` ou
  `components/`.
- O utilitário `cn` do shadcn/ui: ele já vem com a instalação da CLI. Declare
  `"registryDependencies": ["utils"]` em vez de copiar.

## Regras

- Sem efeito colateral em nível de módulo.
- Toda função exportada precisa de tipos explícitos de entrada e saída.
