# Classes

- As classes são **um tipo especial de função** que atuam como um **template para a criação de objetos**.
- As classes **não sofrem hoisting**, não importando a forma como foram declaradas.
- As classes são formadas por 3 tipos de membros: **constructor**, **prototype methods** e **static methods**.
  - O **constructor** é invocado no momento da instanciação de uma classe e serve para inicializar um determinado objeto.
  - Os **prototype methods** dependem de uma instância para serem invocados.
  - Os **static methods** não dependem de uma instância para serem invocados.
- As classes funcionam de forma **similar as funções construtoras**.
- É possível **criar uma hierarquia de classes** por meio da palavra-chave **extends**.
- Ao declarar um constructor na subclass é necessário **invocar o constructor da superclass** por meio **super() antes de utilizar a referência this**.