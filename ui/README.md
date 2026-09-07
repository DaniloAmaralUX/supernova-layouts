# ui — primitivos

**Tipo do registro:** `registry:ui`

O andar mais baixo do sistema. Um primitivo é uma peça sem opinião de negócio:
botão, campo, rótulo, separador. Ele não sabe em que tela está.

## O que entra

- Peças de interface indivisíveis, com variantes e estados.
- Componentes que outros itens deste repositório usam como dependência.

## O que não entra

- Qualquer coisa que já combine dois primitivos — isso é `components/`.
- Seções de página — isso é `blocks/`.
- Cópias de primitivos do shadcn/ui sem alteração. Nesse caso, declare
  `"registryDependencies": ["button"]` e deixe a CLI instalar o original.

## Como nomear

Uma pasta por primitivo, em `kebab-case`, com o arquivo de mesmo nome dentro:

```
ui/
└── stat-tile/
    └── stat-tile.tsx
```

O nome do item no `registry.json` desta pasta é o nome da pasta.
