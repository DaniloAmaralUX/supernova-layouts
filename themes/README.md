# themes — temas

**Tipo do registro:** `registry:theme`

Um tema é um conjunto de variáveis de cor, raio e tipografia. Ele não traz
componente nenhum: troca a aparência do que já está instalado.

## O que entra

Itens com `cssVars`, divididos em `theme`, `light` e `dark`:

```json
{
  "name": "supernova-noite",
  "type": "registry:theme",
  "cssVars": {
    "theme": { "radius": "0.5rem" },
    "light": { "background": "oklch(1 0 0)" },
    "dark": { "background": "oklch(0.145 0 0)" }
  }
}
```

## O que não entra

- Fontes e camadas de CSS que valem para todos os temas — isso é `styles/`.
- Componentes com estilo embutido. O tema precisa funcionar sem eles.

## Cuidado ao editar

Cor é contrato. Mudar uma variável aqui muda toda tela já instalada por quem
usa o tema. Trate como mudança de versão e registre no `CHANGELOG.md`.
