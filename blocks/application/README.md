# blocks/application

A moldura de um produto logado: o que envolve a tela em vez de ser a tela.

## Categorias previstas

`application-shell` · `dashboard-shell` · `dashboard-header` ·
`dashboard-footer` · `dashboard-dialog` · `dashboard-dropdown` ·
`navbar-component` · `footer-component` · `empty-state` · `onboarding-feed`

## Regras

- A casca recebe o conteúdo por `children`, nunca por importação direta de uma
  página. Isso é o que a torna reutilizável.
- Navegação chega por propriedade, como dado. Nada de lista de links fixa.
- Estado vazio precisa dizer o que fazer, não apenas que está vazio.
