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

## Não existe apelido curto para este registro

A chave `registries` do `components.json` serve para registro **servido por
URL**, e o valor precisa ser um endereço com `{name}`:

```json
{
  "registries": {
    "@algum-registro": "https://algum-site.com/r/{name}.json"
  }
}
```

Apontar um repositório do GitHub ali não funciona. A CLI recusa com
`Invalid configuration found in components.json` se o valor não for uma URL, e
com `item not found` se você montar uma URL que não existe.

Então, para este registro, use sempre o endereço completo. É mais comprido e é
o que funciona.

A mesma regra vale dentro do repositório: quando um item depende de outro item
daqui, `registryDependencies` recebe o endereço completo, não um apelido. É o
que o `kit-inicial` faz em `bundles/registry.json`.

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

São dois registros independentes, e eles são consumidos de formas diferentes.

O `supernova-ui` é servido por URL, então tem apelido:

```json
{
  "registries": {
    "@supernova-ui": "https://supernovacn.vercel.app/r/{name}.json"
  }
}
```

Este aqui é lido do GitHub e usa o endereço completo, sem apelido. Os dois
convivem no mesmo projeto sem conflito, e nenhum item daqui depende de item
de lá.
