# blocks/forms

Seções de coleta de dados.

## Categorias previstas

`form-layout` · `file-upload` · `multi-step-form` · `settings-form`

## Regras

- Todo campo tem `<label>` associado. `placeholder` não substitui rótulo.
- Erro fica junto do campo, ligado por `aria-describedby`, e descreve a
  correção — não apenas que houve erro.
- O bloco não valida regra de negócio nem envia nada. Ele expõe `onSubmit` e
  recebe o estado de erro de fora.
- Nenhum campo de senha, cartão ou documento vem preenchido, nem em exemplo.
