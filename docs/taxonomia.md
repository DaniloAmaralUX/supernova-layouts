# Taxonomia: onde cada coisa mora

## A pergunta que decide

Não é "onde eu vou usar isso". É **"o que isso é"**.

Um botão continua sendo primitivo mesmo que só apareça no rodapé. Um herói
continua sendo bloco mesmo que só exista em uma página.

## Os dois eixos

O repositório se organiza em dois eixos, e eles não se confundem:

1. **Tipo** — a pasta de primeiro nível. Diz o que a coisa é. São dez, fixas,
   uma para cada tipo que o registro do shadcn reconhece.
2. **Domínio** — a subpasta dentro de `blocks/` e `pages/`. Diz de que assunto
   a coisa trata. Só existe onde o volume justifica.

Tipo é fechado: não se cria uma décima primeira pasta na raiz. Domínio é
discutível: para abrir um novo, abra uma issue antes.

## Escada de granularidade

```
ui/            um botão
components/    um seletor de plano (botões + rótulo + estado)
blocks/        a seção de preços inteira (três seletores + título + apoio)
pages/         a página de preços (seção de preços + FAQ + rodapé)
bundles/       o kit "landing de produto" (várias páginas e blocos)
```

Se você está em dúvida entre dois degraus, o teste é: **isso seria usado sozinho
em outro contexto?** Se sim, desça um degrau e referencie por dependência.

## As dez pastas de tipo

| Pasta | Tipo | Tem interface? | Tem rota? |
| --- | --- | --- | --- |
| `ui/` | `registry:ui` | sim | não |
| `components/` | `registry:component` | sim | não |
| `blocks/` | `registry:block` | sim | não |
| `pages/` | `registry:page` | sim | sim |
| `themes/` | `registry:theme` | não | não |
| `styles/` | `registry:style` | não | não |
| `hooks/` | `registry:hook` | não | não |
| `lib/` | `registry:lib` | não | não |
| `files/` | `registry:file` | não | não |
| `bundles/` | `registry:item` | — | — |

## Domínios de `blocks/`

| Domínio | Pergunta que ele responde |
| --- | --- |
| `marketing/` | Como convenço alguém que ainda não é cliente? |
| `application/` | O que envolve a tela de quem já entrou? |
| `commerce/` | Como apresento produto e conduzo à compra? |
| `content/` | O que a pessoa lê ou percorre? |
| `forms/` | Como coleto dados? |
| `data/` | Como mostro número? |

## Domínios de `pages/`

| Domínio | Pergunta que ele responde |
| --- | --- |
| `auth/` | Como a pessoa entra ou recupera acesso? |
| `marketing/` | O que é público, para quem não tem conta? |
| `app/` | O que é interno, para quem já entrou? |

## Casos que sempre geram dúvida

**Um cabeçalho de painel.** É `blocks/application/`, não `ui/`. Ele é uma
seção, mesmo sendo estreito.

**Um cartão de métrica.** Se ele aparece sozinho, é `components/`. Se ele vem
sempre em fileira com título de seção, a fileira é `blocks/data/` e o cartão
individual é `components/`.

**Uma tela de login.** É `pages/auth/`, e ela monta blocos de `blocks/forms/`.
Se você escreveu o formulário inteiro dentro do arquivo da página, faltou
quebrar.

**Um tema escuro.** É `themes/`, sempre. Mesmo que ele mude só uma cor.

**Uma fonte.** É `styles/`, porque vale para o projeto todo, não para um tema.

**Um `formatarMoeda`.** É `lib/`. Não tem React, não tem estado.

## A segunda taxonomia: a que a pessoa vê

Tudo acima é a taxonomia **física**: onde o arquivo mora e como a CLI do shadcn
trata o item. Ela existe para quem contribui.

Existe uma segunda, que existe para quem procura. No produto, em
<https://supernovacn.vercel.app>, os itens aparecem em prateleiras:

```
Components   unidades reutilizáveis
Blocks       seções de página
App UI       telas de produto
```

Quem procura uma tela de login não deveria precisar saber que ela é um
`registry:page`. Por isso as duas taxonomias não se misturam: cada item declara
a prateleira dele em `meta.supernova`, e o produto lê só isso.

```jsonc
"meta": {
  "supernova": {
    "collection": "app-ui",         // components | blocks | app-ui
    "category": "Autenticação",     // depende da coleção
    "tags": ["login", "acesso"],    // o que a busca encontra além do título
    "maturity": "stable",           // stable | beta
    "provenance": {
      "origin": "supernova",        // supernova | iconiq | shadcn
      "license": "MIT",
      "adapted": false
    }
  }
}
```

O vocabulário fechado está em [`scripts/taxonomia.mjs`](../scripts/taxonomia.mjs),
e `npm run check` reprova valor fora dele. Os rótulos de `blocks` e `app-ui` são
os mesmos que o produto já usa: um valor novo aqui sem o par de lá quebra a
build do site, e isso é de propósito.

Item de vitrine — o que mora em `ui/`, `components/`, `blocks/` ou `pages/` —
declara o bloco inteiro. Hook, utilitário, arquivo e conjunto declaram só a
proveniência: eles chegam junto com o que a pessoa escolheu e não aparecem em
prateleira nenhuma, então inventar coleção para eles seria inventar um lugar que
não existe.

### Por que a proveniência é obrigatória em todo item

Porque a alternativa é depender de alguém lembrar. Um registro público entrega
arquivos de código para a máquina de terceiros; de quem é aquele código e sob
que licença ele viaja não pode ser uma nota num arquivo separado que a cópia
deixa para trás.

Item de origem diferente de `supernova` precisa declarar `upstream`, senão a
atribuição fica pela metade: crédito sem endereço não permite conferir a origem.
