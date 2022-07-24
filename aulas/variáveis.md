# Variáveis

- É possível declarar variáveis de diferentes formas, utilizando **var**, **let** e **const**.
- Ciclo de vida de uma variável.
  - Declaração
  - Inicialização
  - Atribuição
- Declaração
  - O nome da variável é registrada no contexto de execução, também conhecido como escopo da função.
- Inicialização
  - A variável é inicializada com o valor undefined.
- Atribuição
  - Um valor pe atriubuído para a variável.
- Ao utilizar **var**, a variável é declarada e inicializada no escopo da função, não respeitando bloco e permitindo a redeclaração e reatribuição.
- Ao utilizar **let**, a variável é declarada no escopo da função mas só é inicializada posteriormente, respeitando bloco e permitindo reatribuição mas não a redeclaração.
- Ao utilizar **const**, a variável é declarada no escopo da função mas só é inicializada posteriormente, respeitando bloco e não permitindo reatribuição nem redeclaração.
- Ao declarar uma variável sem **var**, **let** ou **const** ela é criada no escopo global.
- Nunca declare variáveis sem **var**, **let** ou **const** e evite a utilização de **var**.
- Um identificador válido deve começar com `[a-zA-Z_$]` seguido por `[a-zA-Z0-9_$]`.