# Bloqueios de licença

O que **não** entrou neste registro, por quê, e o que exatamente desbloqueia
cada caso.

Este documento existe porque a alternativa é pior: sem ele, a razão de um
material ter ficado de fora vira memória de quem estava presente, e a decisão
se toma de novo do zero a cada rodada — às vezes para o outro lado.

Levantamento de 07/09/2026, sobre os três repositórios do ecossistema.

## A regra que decide

Distribuir com crédito resolve uma família de licenças e não resolve duas.

| Situação | Crédito resolve? | Por quê |
| --- | --- | --- |
| Licença permissiva declarada (MIT) | **Sim** | Preservar o aviso de copyright e a permissão é a única obrigação que o MIT impõe. |
| Nenhuma licença declarada | **Não** | Ausência de licença é "todos os direitos reservados" por padrão. Atribuição é boa prática; não é concessão de direito. |
| Licença com cláusula restritiva | **Não** | A cláusula restringe redistribuição independentemente de atribuição. Creditar não a satisfaz. |

Publicar num registro com comando de instalação é um convite forte a instalar,
e é a leitura moral mais generosa possível da intenção de quem publicou. Não é
uma licença.

## Bloqueado

### Telas derivadas do devl.dev — 140 itens

**Onde:** `supernova-catalogo/src/design/pages/` (140 de 158 arquivos com
cabeçalho de origem gerado), mais 8 arquivos em `src/design/molecules/devl/`.

**Restrição:** a origem não declara licença. O arquivo mais pesado em questão
de autoria é `molecules/devl/particle-field.tsx`, 20 KB de código de canvas
vindo do upstream — o próprio roadmap do experimento o listou como decisão em
aberto antes de migrar.

**Desbloqueia com:** permissão escrita do autor do devl.dev, com escopo
nomeado; **ou** reimplementação independente a partir do briefing público de
cada pasta, sem consultar o código de origem, com registro de quem escreveu e
quando.

**Observação:** as 18 telas autorais do experimento não estão nesta lista.
Elas foram escritas por nós, e estão neste registro.

### Blocos do shadcn/studio — 54 itens

**Onde:** `supernova-ui/vendor/compound-blocks/`.

**Restrição:** MIT + Commons Clause, com duas barreiras independentes. A
primeira proíbe venda ou redistribuição sem modificação. A segunda, "Competing
Products", não tem ressalva de modificação e alcança qualquer produto que
replique a função principal do shadcn/studio — que é exatamente o que um
registro público de layouts é.

**Agravante:** a revisão de origem está registrada como `unrecorded` em
`src/lib/blocks/provenance.ts`, então o texto de licença que de fato governa os
arquivos copiados nunca foi capturado.

**Desbloqueia com:** permissão escrita do titular, **e** a fixação da revisão de
origem com o texto de licença correspondente.

### Efeitos do Canvas UI — 96 itens

**Onde:** `supernova-ui/src/components/canvasui/` e `src/lib/<Efeito>/`.

**Restrição:** MIT + Commons Clause, © David Haz. A cláusula nomeia
explicitamente a redistribuição e a versão portada. Um registro público
instalável é redistribuição por definição, e as compilações para outros
frameworks são versões portadas pelo próprio nome.

**Desbloqueia com:** permissão escrita de David Haz.

**Não desbloqueia com:** o cabeçalho de atribuição que o produto já injeta. Ele
é boa prática e continua certo; não responde a esta cláusula.

## Em quarentena

### DialectCN — 349 arquivos

**Onde:** `supernova-ui/vendor/dialectcn/`, versionado.

**Situação:** sem arquivo de licença, sem campo de licença e sem nenhum aviso de
copyright. É importado direto por `src/data/compound-themes.ts` e por mais três
módulos, e os 24 itens de tema publicados são gerados dele. A única permissão
alegada é verbal.

**Desbloqueia com:** a autorização por escrito, com escopo nomeado; **ou** a
reconstrução dos dados de token a partir de fonte limpa.

### Licença do próprio `supernova-ui`

O `LICENSE.md` na raiz do produto é o do Canvas UI, nomeando David Haz como
titular do repositório. O produto não declara licença própria hoje. Enquanto
isso não for resolvido, a pergunta "sob que licença sai o que é nosso" não tem
resposta escrita.

## Consequência para este repositório

O `LICENSE.md` do `supernova-layouts` continua sendo o de todos os direitos
reservados, e a mudança para uma licença aberta continua pendente.

Esta é uma escolha deliberada, não um esquecimento. Este registro contém hoje
material próprio da Supernova (MIT-compatível na intenção) e material da Iconiq
sob MIT — os dois poderiam sair sob licença aberta. O que falta é decidir isso
explicitamente, com a lista acima resolvida ou conscientemente aceita, num
commit que trate a licença como o assunto principal e não como efeito colateral
de um refactor.

**Enquanto este documento tiver itens em aberto, não chame este registro de
open source.** Visibilidade pública não é concessão de licença aberta, e o
próprio `LICENSE.md` diz isso com todas as letras.

## O que está permitido e por quê

| Material | Itens | Base |
| --- | --- | --- |
| Telas autorais da Supernova | 18 | Trabalho próprio. |
| Componentes autorais da Supernova | 2 | Trabalho próprio. |
| Tokens da Supernova | 1 | Trabalho próprio; a estrutura vem de um preset do shadcn, a cor é nossa. |
| Bloco e hook de referência | 2 | Trabalho próprio. |
| Componentes da Iconiq UI | 20 | MIT, © 2024-2026 Edwin Vakayil. Aviso íntegro no topo de cada arquivo entregue. |
| Kit inicial | 1 | Conjunto dos itens acima. |

Os primitivos do shadcn/ui não são redistribuídos por este registro: as telas
os pedem por `registryDependencies`, e a CLI os busca no registro oficial. É a
diferença entre depender e copiar, e ela evita tanto a obrigação de aviso
quanto o trabalho de manter cópia alheia atualizada.
