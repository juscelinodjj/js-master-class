# Modules

- Os módulos vieram no ES6, ou ECMAScript 2015, foi especificado na própria linguagem, baseado no conceito de **importação** e **exportação**.
- Por meio da palavra-chave **export** é possível exportar qualquer tipo de dado existente dentro de um módulo.
- A palavra-chave **import** faz a importação de qualquer tipo de dado exportando para dentro do módulo.
- Para utilizar modules no Node.js **os arquivos devem ter a extensão .mjs** além de executar com a flag **--experimental-modules**.
- É possível utilizar um **alias** na importação, **renomeando o que estiver sendo importado**.
- Por meio do **\*** é possível **importar tudo que estiver sendo exportado em um único objeto**.
- Também podemos importar e exportar de forma padrão utilizando a palavra-chave **default**.
- A **ordem** da importação é relevante?
  - Não, devido ao hoisting.
- **Não é permitido realizar a importação e exportação dentro de blocos**.