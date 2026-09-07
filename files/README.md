# files — arquivos avulsos

**Tipo do registro:** `registry:file`

Arquivos que não são código de interface, mas que o projeto de quem instala
precisa ter: convenções de editor, instruções para agentes, configuração,
exemplo de variáveis de ambiente.

## Regra obrigatória do schema

Todo arquivo do tipo `registry:file` **precisa** de `target`. O prefixo `~/`
aponta para a raiz do projeto que está instalando:

```json
{
  "path": "files/editor-config/.editorconfig",
  "type": "registry:file",
  "target": "~/.editorconfig"
}
```

## O que não entra

- Segredo de qualquer natureza. Chave, token e senha nunca entram aqui, nem
  como exemplo preenchido. Use `.env.example` com valores vazios.
- Arquivo que sobrescreve configuração do projeto sem aviso. Descreva o efeito
  no campo `description` do item.
