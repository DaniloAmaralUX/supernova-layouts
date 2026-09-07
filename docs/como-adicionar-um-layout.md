# Como adicionar um layout

Um exemplo inteiro, do zero até o pull request. Vamos criar um bloco de preços
com três planos.

## 1. Escolher a pasta

É uma seção de página, de assunto comercial. Então:

```
blocks/marketing/
```

Se você não tem certeza, a tabela em [taxonomia.md](taxonomia.md) decide.

## 2. Criar a pasta e o arquivo

O nome da pasta é o nome do item, em `kebab-case`, e diz o que a coisa faz:

```
blocks/marketing/pricing-three-tiers/pricing-three-tiers.tsx
```

Evite `pricing-2`. Daqui a um ano ninguém vai lembrar o que era o 2.

## 3. Declarar no `registry.json` da pasta

Abra `blocks/registry.json` e acrescente ao array `items`:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "pricing-three-tiers",
  "type": "registry:block",
  "title": "Preços em três planos",
  "description": "Tabela de preços com três planos e destaque no plano do meio.",
  "author": "Supernova",
  "categories": ["marketing", "pricing"],
  "registryDependencies": ["button", "card", "badge"],
  "files": [
    {
      "path": "marketing/pricing-three-tiers/pricing-three-tiers.tsx",
      "type": "registry:component",
      "target": "components/supernova/pricing-three-tiers.tsx"
    }
  ]
}
```

Três detalhes que costumam escapar:

- O `path` é relativo a `blocks/registry.json`, então começa em `marketing/`,
  não em `blocks/marketing/`.
- `registryDependencies` traz os primitivos do shadcn na instalação. Não copie
  `button.tsx` para cá.
- O `registry.json` da raiz não muda. Ele só tem `include`.

## 4. Escrever o componente

```tsx
interface Plano {
  nome: string
  preco: number
  destaque?: boolean
}

interface PricingThreeTiersProps {
  planos: [Plano, Plano, Plano]
  onEscolher: (plano: Plano) => void
}
```

O bloco recebe os planos e devolve a escolha. Ele não conhece preço de verdade,
não fala com API e não sabe se existe um checkout do outro lado.

## 5. Atualizar o catálogo e conferir

```bash
npm run catalog
npm run verify
```

O primeiro comando regrava o `CATALOG.md` a partir dos `registry.json`. Ele é
gerado — não edite à mão. O segundo confere tudo.

Erro comum e o que ele quer dizer:

| Mensagem | Causa |
| --- | --- |
| `Arquivo órfão: blocks/...` | Você criou o arquivo e esqueceu de declarar |
| `declara ..., que não existe` | O `path` está relativo à raiz em vez da pasta |
| `Nome duplicado` | Já existe item com esse nome em outra pasta |
| `é do tipo X mas foi declarado em Y/` | O item está na pasta errada |
| `é o mesmo de um item do registro oficial do shadcn` | Escolha outro nome; esse colide com um primitivo |
| `termina em número` | Nomeie a diferença da variante, não a ordem dela |
| `CATALOG.md está desatualizado` | Faltou rodar `npm run catalog` |

## 6. Abrir o pull request

Branch `feat/pricing-three-tiers`, checklist do template preenchido, e uma
linha no `CHANGELOG.md` em "Não publicado".

## 7. Conferir a instalação de verdade

Depois que o pull request entrar em `main`:

```bash
npx shadcn@latest add DaniloAmaralUX/supernova-layouts/pricing-three-tiers
```

Só depois desse comando funcionar é que o layout existe para quem usa.
