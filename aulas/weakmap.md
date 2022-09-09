# WeakMap

- WeakMap é um objeto, similar ao Map, que permite **apenas chaves do tipo Object** e **mantém as referências de forma fraca**, sendo volátil e não iterável.
- **set**
  - Adiciona um par de chave e valor.
- **has**
  - Retorna true se a chave existir.
- **get**
  - Retorna o valor de uma determinada chave.
- **delete**
  - Remove um par de chave e valor.
- Sem a **referência para a chave** não é possível acessar o valor.
- Para que serve um WeakMap?
  - Evitar **memory leak**.