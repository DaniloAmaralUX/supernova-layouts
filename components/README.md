# components — componentes compostos

**Tipo do registro:** `registry:component`

Composições de primitivos que resolvem uma tarefa, mas ainda não são uma seção
inteira de página. Um seletor de tema, um cartão de métrica com gráfico, uma
barra de busca com filtros.

## O que entra

- Peças que combinam dois ou mais primitivos.
- Peças reutilizadas por mais de um bloco ou página.

## O que não entra

- Peças indivisíveis — isso é `ui/`.
- Seções de página completas, com título, texto e ações — isso é `blocks/`.

## Como nomear

```
components/
└── theme-switcher/
    ├── theme-switcher.tsx
    └── theme-switcher-item.tsx
```

Quando o componente precisa de um hook próprio, o hook vai para `hooks/` e
entra como `registryDependencies` do componente. Assim ele pode ser reusado.
