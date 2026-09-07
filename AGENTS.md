# Instruções para agentes

Este repositório é um **registro do shadcn**, não uma aplicação. Não existe
servidor de desenvolvimento, não existe página para abrir no navegador e não
existe framework instalado. Não tente rodar `next dev` nem criar um app aqui.

## Antes de qualquer alteração

Leia o `README.md` da pasta em que você vai mexer. Cada pasta declara o que
aceita e o que recusa, e essas regras valem sobre qualquer suposição sua.

## A regra que organiza tudo

Uma pasta por tipo de item, sem exceção:

```
ui/ components/ blocks/ pages/ themes/ styles/ hooks/ lib/ files/ bundles/
```

O `type` declarado no item precisa combinar com a pasta em que ele foi
declarado. `scripts/check-registry.mjs` reprova quando não combina.

## Ao adicionar um item

1. A pasta é escolhida pelo **tipo** do item, não pelo assunto dele.
2. Declare o item no `registry.json` **da pasta**. O `registry.json` da raiz só
   tem `include`; não acrescente `items` nele.
3. Os caminhos em `files[].path` são relativos ao `registry.json` que os
   declara — não à raiz do repositório.
4. `registry:page` e `registry:file` exigem `target`. Sem ele a instalação
   não sabe onde escrever.
5. O nome do item precisa ser único no repositório inteiro.

## Nunca faça

- **Copiar código de terceiros para cá.** Se um item precisa de um primitivo do
  shadcn/ui, declare `registryDependencies` e deixe a CLI instalar o original.
  Qualquer arquivo vindo de fora exige registro em `NOTICE.md` com autor, URL,
  revisão e licença — quatro pontos, todos preenchidos.
- **Trazer os blocos do shadcn/studio** usados em `supernova-ui`. Estão
  bloqueados pela cláusula de produtos concorrentes. Ver `NOTICE.md`.
- **Escrever segredo.** O repositório é público. Nenhuma chave, token ou senha,
  nem em exemplo.
- **Editar `.registry-build/`.** É saída gerada e descartável.
- **Recuperar marca antiga.** Nada de Compound, Canvas UI ou DialectCN. O nome
  do produto é Supernova.

## Antes de dizer que terminou

```bash
npm run verify
```

Isso roda a conferência própria e o `shadcn build` de verdade. Se você não
rodou, você não sabe se funciona — e dizer que funciona seria falso.

## Idioma

Nome de pasta, de arquivo e de item em inglês. Todo texto de documentação,
comentário e conteúdo de exemplo em português do Brasil.
