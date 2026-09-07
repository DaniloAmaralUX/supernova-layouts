# Avisos de origem — Supernova Layouts

Este arquivo registra a origem do que existe neste repositório. Ele é mantido
como registro verificável, não como formalidade.

Última atualização: 7 de setembro de 2026.

## Estado atual

O repositório publica 143 itens, de duas origens:

| Origem | Itens | Licença |
| --- | --- | --- |
| Supernova | 24 | Ver [LICENSE.md](LICENSE.md) |
| Iconiq UI, de Edwin Vakayil | 119 | MIT |

Cada item declara a sua origem em `meta.supernova.provenance`, e
`scripts/check-registry.mjs` reprova o item que não declarar. A atribuição não
depende de alguém lembrar de escrevê-la.

O que **não** entrou, e o que desbloqueia cada caso, está em
[docs/BLOQUEIOS-DE-LICENCA.md](docs/BLOQUEIOS-DE-LICENCA.md).

## Iconiq UI

```
Iconiq UI
Copyright © 2024-2026 Edwin Vakayil
MIT License
https://github.com/edwinvakayil/iconiq
```

- **Autor e titular:** Edwin Vakayil.
- **Origem:** <https://github.com/edwinvakayil/iconiq>, site <https://iconiqui.com>.
- **Revisão consultada:** `a85ae7b80c97e62da0b7b728a5f8582564289d20`, de
  2026-09-01. Fixada, não estimada.
- **Licença:** MIT. O texto integral acompanha cada arquivo entregue.
- **O que foi alterado:** nada no código. A única diferença em relação ao
  original é o aviso de licença acrescentado no topo de cada arquivo.

O MIT autoriza redistribuir, e impõe uma obrigação: o aviso de copyright e a
permissão têm de viajar com cada cópia. Como este registro entrega arquivos de
código para a máquina de terceiros, esse aviso vai **dentro de cada arquivo**, e
não numa página de créditos que a cópia deixa para trás. Cortar o aviso para uma
linha de crédito seria descumprir a única exigência da licença que torna esta
redistribuição possível.

Um componente da Iconiq distribuído pelo Supernova continua sendo da Iconiq. Os
itens se chamam `iconiq-<nome>` justamente por isso: o nome de instalação diz de
quem é o componente. O Supernova é a descoberta e a distribuição; a autoria é de
quem escreveu.

A biblioteca entra inteira: os 119 componentes de interface que o upstream
publica com arquivo. O **código** vem do upstream atual, não das cópias que o
experimento `supernova-catalogo` tinha em setembro (commit `bcb35b3a`) — o
upstream pode ter corrigido defeitos desde então, e recuperar código antigo por
comodidade seria herdar os defeitos junto.

Seis itens tiveram a **declaração** de dependência corrigida, e nenhum teve o
código alterado. O upstream os publica pedindo `@base-ui/react/input`,
`.../button` e afins: isso não é um pacote npm, é um caminho dentro de um, e a
CLI do shadcn falha com ENOENT tentando instalar. O import em tempo de execução
está correto; errada estava só a linha que declara o pacote. A correção é
mínima, está provada pelo teste de instalação, e recupera seis peças que
ficariam de fora por um erro de digitação alheio.

Um item ficou de fora: `iconiq-theme`, que não traz arquivo no upstream
vendorizado.

## Dependências externas, e por que não são cópia

Os itens declaram dependências que a CLI do shadcn instala do registro oficial,
em vez de trazerem cópias:

- **shadcn/ui** (© 2023 shadcn, licença MIT) — as telas declaram
  `registryDependencies` como `button`, `input`, `label`, `select` e afins. Eles
  vêm do registro oficial no momento da instalação. **Nenhum arquivo do
  shadcn/ui está versionado aqui**, e por isso este repositório não assume a
  obrigação de aviso nem o trabalho de manter cópia alheia atualizada.

Sempre que um item novo precisar de um primitivo já existente, ele deve fazer o
mesmo: declarar a dependência, não copiar o arquivo.

## O que foi deliberadamente deixado de fora

Resumo; o documento completo é
[docs/BLOQUEIOS-DE-LICENCA.md](docs/BLOQUEIOS-DE-LICENCA.md).

**shadcn/studio** — o repositório irmão `supernova-ui` distribui 54 blocos
originários do shadcn/studio (© 2025 ThemeSelection), cuja licença traz:

> **Competing Products:** The Software shall not be used to create any product
> or service that directly competes with shadcn/studio.

Um catálogo público de layouts instaláveis é exatamente o tipo de produto que
essa cláusula alcança. **Nenhum daqueles 54 blocos foi trazido para cá**, nem em
forma adaptada.

**devl.dev** — 140 telas do experimento `supernova-catalogo` derivam de um
registro que não declara licença. Ausência de licença é todos os direitos
reservados por padrão. Nenhuma delas entrou aqui. As 18 telas autorais do mesmo
experimento entraram, e são identificáveis por `provenance.origin: "supernova"`.

**Canvas UI** — os 96 efeitos do produto são MIT + Commons Clause, com
redistribuição e versão portada nomeadas na restrição. Não entraram.

A taxonomia de categorias em `blocks/` e `pages/` — nomes como `hero-section` ou
`pricing-component` — descreve funções de interface de uso corrente no setor e
não reproduz código, texto ou arranjo visual de nenhum desses projetos.

## Como manter este arquivo verdadeiro

Ao trazer qualquer arquivo de fora para este repositório, registre aqui, antes
de abrir o pull request:

- autor e detentor do copyright;
- URL da origem e a revisão exata consultada;
- licença e onde está o texto dela;
- o que foi alterado em relação ao original.

Se você não consegue preencher esses quatro pontos, o arquivo não entra.

Um NOTICE que subestima a origem de terceiros é pior do que nenhum: ele é uma
afirmação falsa distribuída junto com o código. Este repositório tem um exemplo
vivo do risco — o NOTICE do `supernova-catalogo` afirmava "18 de 36" telas
vindas do devl.dev enquanto a árvore já tinha 140 de 158.
