# Closures

- Na linguagem JavaScript, **toda função permite a utilização de variáveis** que não foram declaradas e nem passadas por parâmetro.
- O problema é que como as funções são de primeira classe, **dependendo da situação poderia existir uma ambiguidade** e isso foi **resolvido com o conceito de closure**.
- Resumindo, closure é uma função com um **scope chain estático** que é d**efinido no momento em que uma função é criada**, por isso, **todas as funções na linguagem JavaScript são closures**.
- Apesar de estático, o scope chain faz referência para objetos que estão na memória e **podem ser compartilhados por mais de uma função**.