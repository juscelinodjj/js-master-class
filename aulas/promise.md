# Promise

- As promises são **objetos responsáveis por modelar comportamento assíncrono**, permitindo o seu tratamento de uma forma mais fácil e direta.
- Para criar uma promise basta instanciá-la, executando a função **resolve** em caso de sucesso, sendo tratado por meio de **then**.
- Em caso de fracasso, a função **reject** deve ser executada, sendo tratada por meio de **catch**.
- É possível **centralizar** o tratamento de uma promise encadeando seus retornos.
- Podemos executar várias promises ao mesmo tempo, retornando após todas terem sucesso usando **Promisse.all**.
- Também podemos executar várias promises ao mesmo tempo, retornando após a primeira ter sucesso usando **Promise.race**.