# bundles — conjuntos

**Tipo do registro:** `registry:item`

Um conjunto não tem arquivo próprio: ele só aponta para outros itens em
`registryDependencies`. Serve para instalar um kit inteiro com um comando.

```json
{
  "name": "kit-inicial",
  "type": "registry:item",
  "registryDependencies": [
    "@supernova-layouts/hero-supernova",
    "@supernova-layouts/use-media-query"
  ]
}
```

## O que entra

- Kits de partida por tipo de projeto: landing page, painel, área de conta.
- Combinações que já se provaram juntas.

## O que não entra

- Conjunto com um item só. Instale o item direto.
- Arquivo de código. Se você precisa de um arquivo, o item pertence a outra
  pasta e o conjunto apenas o referencia.
