# pages — páginas completas

**Tipo do registro:** `registry:page`

Uma página é o resultado de vários blocos montados, com rota definida. É o que
alguém instala para ter uma tela funcionando de ponta a ponta.

## Subpastas

| Pasta | Para que serve |
| --- | --- |
| `auth/` | Entrar, criar conta, recuperar senha, redefinir senha, confirmar e-mail |
| `marketing/` | Sobre, contato, preços, portfólio, página inicial |
| `app/` | Painel, configurações de conta, integrações |

## Regra obrigatória do schema

Todo arquivo do tipo `registry:page` **precisa** de `target` — é ele que diz
onde a página cai no projeto de quem instala:

```json
{
  "path": "pages/auth/login/page.tsx",
  "type": "registry:page",
  "target": "app/(auth)/login/page.tsx"
}
```

Sem `target`, a CLI do shadcn não sabe onde escrever o arquivo.

## O que não entra

- Seções soltas — isso é `blocks/`.

Uma página deve montar blocos existentes por `registryDependencies` em vez de
repetir o código deles.
