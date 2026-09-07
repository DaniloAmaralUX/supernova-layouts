# Instalação e consumo

## O que quem instala precisa ter

- Node 22.18 ou mais novo.
- Um projeto com `components.json` — ou seja, `npx shadcn@latest init` já rodado.
- Tailwind CSS v4.

## Instalar um item

```bash
npx shadcn@latest add DaniloAmaralUX/supernova-layouts/hero-supernova
```

O endereço tem três partes: dono, repositório e **nome do item**. A última
parte não é um caminho de arquivo — `blocks/marketing/hero-supernova` não
funciona; `hero-supernova` funciona.

## Encurtar com um apelido

No `components.json` do projeto que consome:

```json
{
  "registries": {
    "@supernova-layouts": "DaniloAmaralUX/supernova-layouts"
  }
}
```

Depois disso:

```bash
npx shadcn@latest add @supernova-layouts/hero-supernova
```

O apelido também é o que permite um item deste repositório depender de outro,
como faz o `kit-inicial` em `bundles/`.

## Ver antes de instalar

```bash
npx shadcn@latest add DaniloAmaralUX/supernova-layouts/hero-supernova --dry-run
```

`--dry-run` mostra o que seria escrito sem escrever nada. Vale sempre na
primeira vez, para conferir onde os arquivos vão cair.

## Onde os arquivos caem

Depende do `target` declarado no item e dos `aliases` do `components.json` de
quem instala. O `hero-supernova`, por exemplo, declara:

```json
"target": "components/supernova/hero-supernova.tsx"
```

Os itens deste registro escrevem sob `components/supernova/` justamente para
não sobrescrever o que o projeto já tem em `components/ui/`.

## Se o repositório virar privado

A instalação continua funcionando para quem tem acesso de leitura. Dois
caminhos:

```bash
gh auth login
npx shadcn@latest add DaniloAmaralUX/supernova-layouts/hero-supernova
```

Ou por variável de ambiente, útil em CI:

```bash
GH_TOKEN=... npx shadcn@latest add DaniloAmaralUX/supernova-layouts/hero-supernova
```

Use um token de acesso restrito a este repositório, com permissão apenas de
leitura de conteúdo. `GH_TOKEN` tem precedência sobre `GITHUB_TOKEN`.

## Não existe build para publicar

A CLI lê o `registry.json` direto do repositório. Não há JSON gerado para
versionar, não há site para subir e não há pacote no npm.

O `npm run build` deste repositório existe só para conferência local: ele
escreve em `.registry-build/`, que está no `.gitignore`. Se alguém mandar essa
pasta num pull request, o pull request está errado.

## Relação com `@supernova-ui`

São dois registros independentes. Um projeto pode declarar os dois:

```json
{
  "registries": {
    "@supernova-ui": "https://supernovacn.vercel.app/r/{name}.json",
    "@supernova-layouts": "DaniloAmaralUX/supernova-layouts"
  }
}
```

Nenhum item daqui depende de item de lá.
