# hooks — hooks de React

**Tipo do registro:** `registry:hook`

Comportamento sem interface. Um hook aqui é reutilizável por qualquer bloco ou
componente e não desenha nada.

## O que entra

- Hooks genéricos: media query, foco preso, cópia para a área de transferência,
  estado persistido.

## O que não entra

- Hook usado por um único componente e que nunca será reaproveitado. Deixe no
  arquivo do próprio componente.
- Chamada a API de produto. Este repositório não conhece backend.

## Regras

- Arquivo `.ts`, não `.tsx`.
- Comece com `"use client"` quando o hook tocar em `window` ou `document`.
- Precisa ter comportamento definido no servidor, onde `window` não existe.

```
hooks/
└── use-media-query/
    └── use-media-query.ts
```

O item `use-media-query` desta pasta serve de referência para os próximos.
