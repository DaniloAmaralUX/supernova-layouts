# Convenções

## Nomes

| Coisa | Formato | Exemplo |
| --- | --- | --- |
| Pasta do item | `kebab-case` | `pricing-three-tiers` |
| Arquivo principal | igual à pasta | `pricing-three-tiers.tsx` |
| Nome do item | igual à pasta | `pricing-three-tiers` |
| Componente exportado | `PascalCase` | `PricingThreeTiers` |
| Hook | `use-` na pasta, `useX` na função | `use-media-query` / `useMediaQuery` |

Pasta, arquivo e nome de item em inglês. Documentação, comentário e conteúdo de
exemplo em português do Brasil.

## Idioma dentro do código

Identificador em inglês, texto visível em português:

```tsx
export function PricingThreeTiers({ planos }: PricingThreeTiersProps) {
  return <h2>Escolha o seu plano</h2>
}
```

## Estrutura de um componente

- `interface` com sufixo `Props`, exportada quando alguém precisa dela.
- Sem `export default`. Exportação nomeada, sempre.
- `"use client"` só quando há estado, efeito ou evento. A maioria dos blocos é
  componente de servidor e deve continuar sendo.

## Fronteira: o que um item nunca faz

- Não busca dado. Recebe por propriedade.
- Não decide rota. Recebe `href` ou callback.
- Não lê variável de ambiente.
- Não fala com backend.

O motivo é simples: quem instala tem o próprio backend, as próprias rotas e o
próprio jeito de carregar dados. Um item que assume qualquer um dos três é um
item que precisa ser reescrito na instalação.

## Estilo

- Tailwind, com as variáveis do tema. `bg-background`, não `bg-white`.
- Nada de cor literal em classe. Se falta um token, discuta em `themes/`.
- Espaçamento pela escala do Tailwind. Nada de `mt-[13px]`.
- `text-balance` em título, `text-pretty` em parágrafo.

## Acessibilidade — o mínimo que a revisão cobra

- Todo controle alcançável por teclado, com foco visível.
- `<label>` associado a todo campo. `placeholder` não é rótulo.
- Imagem com `alt`; decorativa recebe `alt=""`.
- Cor nunca é o único portador de informação.
- Hierarquia de título sem pular nível.
- Alvo de toque com pelo menos 44 por 44 pixels.

## Dependências

- Primitivo do shadcn entra por `registryDependencies`, não por cópia.
- Pacote de npm entra em `dependencies` do item, com versão.
- Ícone vem do `lucide-react`.
- Antes de acrescentar uma biblioteca nova, pergunte no pull request se ela
  paga o próprio peso. Cada dependência é peso no projeto de quem instala.

## Conteúdo de exemplo

- Português do Brasil, texto plausível, sem `lorem ipsum`.
- Nada de nome de pessoa, empresa ou marca de verdade.
- Nada de imagem de terceiro. Use `bg-muted` como marcação de espaço ou um
  ícone.
- Valor monetário em real, formatado por `Intl.NumberFormat`.
