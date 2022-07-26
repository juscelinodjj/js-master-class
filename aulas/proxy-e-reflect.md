# Proxy e Reflect

- Um Proxy é capaz de **interceptar** diversos tipos de operações **em um objeto alvo**.
- Existem métodos, **chamados de trap**, para diversos tipos de eventos relacionados a um objeto.
    - **apply**
    - **construct**
    - **defineProperty**
    - **deleteProperty**
    - **get**
    - **getOwnPropertyDescriptor**
    - **getPrototypeOf**
    - **has**
    - **isExtensible**
    - **ownKeys**
    - **preventExtensions**
    - **set**
    - **setPrototypeOf**
- O método **set** é invocado quando uma propriedade é definida no objeto.
- O método **deleteProperty** é invocado quando uma propriedade é deletada.
- O método **get** é invocado quando uma propriedade é acessada.
- A **Reflect API** tem os mesmos métodos que existem no Proxy, permitindo a **execução de diversos tipos de operações no objeo alvo**.