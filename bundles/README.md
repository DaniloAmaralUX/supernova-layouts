# bundles — conjuntos

**Tipo do registro:** `registry:item`

Um conjunto não tem arquivo próprio: ele só aponta para outros itens em
`registryDependencies`. Serve para instalar um kit inteiro com um comando.

```json
{
  "name": "kit-inicial",
  "type": "registry:item",
  "registryDependencies": [
    "DaniloAmaralUX/supernova-layouts/hero-supernova",
    "DaniloAmaralUX/supernova-layouts/use-media-query"
  ]
}
```

## O endereço completo é obrigatório

Um item deste repositório referencia outro pelo endereço completo
`DaniloAmaralUX/supernova-layouts/<item>`. O apelido `@supernova-layouts/...`
**não funciona**: ele exigiria que quem instala tivesse um registro por URL
configurado no `components.json`, e este registro é lido direto do GitHub.

Usar o apelido faz a instalação falhar com a mensagem
`Add the registry configuration under "registries"`.

## O que entra

- Kits de partida por tipo de projeto: landing page, painel, área de conta.
- Combinações que já se provaram juntas.

## O que não entra

- Conjunto com um item só. Instale o item direto.
- Arquivo de código. Se você precisa de um arquivo, o item pertence a outra
  pasta e o conjunto apenas o referencia.
