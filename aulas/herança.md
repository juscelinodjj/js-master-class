# Herança

- O principal objetivo da herança é **permitir o reuso de código** por meio do compartilhamento de propriedades entre objetos, **evitando a duplicação**.
- Na linguagem JavaScript a herança é realizada entre **objetos** e não classes.
- A propriedade **\_\_proto\_\_** é uma referência para o protótipo do objeto.
- Porque a propriedade **paradigm** não foi exibida dentro do objeto?
- O método **hasOwnProperty** pode ser utilizado para determinar se uma propriedade **pertence ao objeto**.
- Os métodos **Object.setPrototypeOf** e **Object.getProtypeOf** permitem a interação com o protótipo do objeto.
- Com o método **Object.create** é possível criar um objeto passando o seu protótipo por parâmetro.
- **Sem o seu protótipo o objeto perde algumas operações importantes**.
- Caso a mesma propriedade exista no objeto e no seu protótipo, **a propriedade do próprio objeto é retornada, fazendo sombra á propriedade do protótipo**.