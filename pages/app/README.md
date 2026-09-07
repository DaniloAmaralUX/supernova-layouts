# pages/app

Telas de dentro do produto, para quem já entrou.

## Páginas previstas

`dashboard` · `account-settings` · `app-integration` · `billing`

## Regras

- A página usa uma casca de `blocks/application` e preenche o miolo. Ela não
  redesenha cabeçalho nem barra lateral.
- Dado chega por propriedade ou por um carregador que quem instala substitui.
  O repositório não conhece o backend de ninguém.
- Toda ação destrutiva pede confirmação e diz o que será perdido.
