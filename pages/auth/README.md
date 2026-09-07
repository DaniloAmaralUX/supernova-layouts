# pages/auth

Telas de entrada e recuperação de conta.

## Páginas previstas

`login-page` · `register` · `forgot-password` · `reset-password` ·
`verify-email`

## Regras

- Estas páginas desenham a tela. Elas **não** autenticam ninguém: nenhuma
  chamada de rede, nenhuma sessão, nenhum token. Quem instala liga ao seu
  provedor de identidade.
- Nada de credencial de exemplo preenchida no formulário.
- O campo de senha usa `type="password"` e `autoComplete` correto
  (`current-password` ou `new-password`).
- Mensagem de erro genérica na entrada, para não revelar se um e-mail existe.
