# blocks/commerce

Seções que apresentam produto e conduzem à compra.

## Categorias previstas

`product-list` · `product-detail` · `cart-summary` · `checkout-steps` ·
`plan-selector`

## Regras

- Preço é dado, não texto: receba valor e moeda separados e formate com
  `Intl.NumberFormat`.
- Nenhum bloco daqui executa pagamento. Ele emite a intenção por callback e
  quem instala conecta ao provedor.
- Marca de terceiro (bandeira de cartão, logo de loja) não entra no repositório.
