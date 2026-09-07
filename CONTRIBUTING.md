# Como contribuir

## O ciclo curto

1. Crie uma branch a partir de `main`: `feat/nome-do-layout` ou `fix/o-que-quebrou`.
2. Escolha a pasta pelo **tipo** do item. Em dúvida, leia o `README.md` da pasta.
3. Crie a pasta do item e o arquivo dentro dela.
4. Declare o item no `registry.json` **daquela pasta**, nunca no da raiz.
5. Rode `npm run catalog` e depois `npm run verify`.
6. Abra o pull request preenchendo o checklist.

O passo 5 não é opcional. Se ele falhar, a CI vai falhar igual.

## Escolher a pasta

A pergunta é sempre "o que essa coisa é", não "onde eu quero usar":

| Se é… | Vai para |
| --- | --- |
| Uma peça indivisível | `ui/` |
| Uma combinação de peças | `components/` |
| Uma seção inteira de página | `blocks/<domínio>/` |
| Uma tela com rota | `pages/<domínio>/` |
| Só variáveis de cor e raio | `themes/` |
| Base de estilo do projeto | `styles/` |
| Comportamento sem interface | `hooks/` |
| Função pura | `lib/` |
| Arquivo de projeto, não de interface | `files/` |
| Um kit de vários itens | `bundles/` |

## Nomes

- Pasta e arquivo em `kebab-case`.
- O nome do item é o nome da pasta dele.
- O nome precisa ser único no repositório inteiro. `pricing-three-tiers` diz
  o que é; `pricing-2` não diz nada e vai colidir mais cedo ou mais tarde.
- Nome em inglês para pasta e arquivo. Texto de documentação em português.

## O que a revisão vai olhar

- **Origem.** Se o código veio de algum lugar, isso está no `NOTICE.md`? Sem
  os quatro pontos preenchidos, o arquivo não entra.
- **Acessibilidade.** Navegação por teclado funciona, foco é visível, imagem
  tem texto alternativo, rótulo está associado ao campo, cor não é a única
  forma de transmitir informação.
- **Fronteira.** O item recebe dados por propriedade. Ele não busca dado, não
  decide rota e não conhece backend nenhum.
- **Reuso.** Se você copiou um primitivo em vez de declará-lo em
  `registryDependencies`, vai voltar.
- **Texto.** Conteúdo de exemplo em português do Brasil, sem palavra inventada
  e sem `lorem ipsum`.

## Mudança que quebra quem já instalou

Renomear um item, remover um item ou mudar uma variável de tema muda o que já
está instalado por terceiros. Nesses casos:

1. Registre em `CHANGELOG.md` na seção da versão.
2. Explique no pull request o que quebra e o que a pessoa precisa fazer.

Renomear item é remover um e criar outro. Não existe renomeação silenciosa.

## Segredo

Nenhuma chave, token, senha ou dado pessoal entra neste repositório — nem em
exemplo, nem em teste, nem comentado. Ele é público.
