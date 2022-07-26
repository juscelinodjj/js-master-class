# RegExp

- As expressões regulares são estruturas formadas por um sequência de caracteres que especificam um padrão formal que serve para **validar**, **extrair** ou mesmo **substituir** caracteres dentro de uma string.
- Metacaracteres
  - **.** : Representa qualquer caractere.
  - **\w** : Representa o conjunto **[a-zA-Z0-9_]**
  - **\W** : Representa o conjunto **[^a-zA-Z0-9_]**
  - **\d** : Representa o conjunto **[0-9]**
  - **\D** : Representa o conjunto **[^0-9]**
  - **\s** : Representa um **espaço em branco**.
  - **\S** : Representa um **não espaço em branco**.
  - **\n** : Representa uma **quebra de linha**.
  - **\t** : Representa um **tab**.
- Escapando caracteres especiais
  - **\\** : A barra inversa é utilizada antes de caracteres especiais, com o objetivo de escapá-los.
- Iniciando e finalizando com um determinado caractere.
  - **^** : Inícia com um determinado caractere.
  - **$** : Finaliza com um determinado caractere.
- Grupos de caracteres
  - **[abc]** : Aceita qualquer caractere dentro do grupo, nesse caso **a**, **b** e **c**.
  - **[^abc]** : Não aceita qualquer caractere dentro do grupo, nesse caso **a**, **b** ou **c**.
  - **[0-9]** : Aceita qualquer caractere entre **0** e **9**.
  - **[^0-9]** : Não aceita qualquer caractere entre **0** e **9**.
- Quantificadores
  - Os quantificadores podem ser aplicados a caracteres, grupos, conjuntos ou metacaracteres.
  - **{n}** : Quantifica um número específico.
  - **{n,}** : Quantifica um número mínimo.
  - **{n,m}** : Quantifica um número mínimo e um número máximo.
  - **?** : Zero ou um.
  - **\*** : Zero ou mais.
  - **+** : Um ou mais.
- Grupos de captura
  - **()** : Determina um grupo de captura para realizar a extração de valores de uma determinada string.