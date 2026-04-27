"use strict";

/*
====================================================
SHOPPING_CART.JS
====================================================

Aquí crearás:

1. ShoppingCartException
2. ProductProxy
3. ShoppingCart

====================================================
*/

/*
------------------------------------
1. ShoppingCartException
------------------------------------
Debe extender de Error
*/
class ShoppingCartException extends Error {
  // TODO
  constructor(message) {
    super(message);
    this.name = "ShoppingCartException";
  }
}

/*
------------------------------------
2. ProductProxy
------------------------------------
Representa un producto dentro del carrito.

Atributos:
- productUuid
- amount
*/
class ProductProxy {
  // TODO
  #productUuid;
  #amount;
  constructor(productUuid, amount) {
    if (!productUuid || typeof productUuid !== "string") {
      throw new ShoppingCartException("UUID inválido");
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new ShoppingCartException("Cantidad debe ser entero positivo");
    }

    this.#productUuid = productUuid;
    this.#amount = amount;
  }

  get productUuid() {
    return this.#productUuid;
  }
  get amount() {
    return this.#amount;
  }
  set amount(value) {
    if (typeof value !== "number") {
      throw new ShoppingCartException("La cantidad debe ser un número");
    }
    if (!Number.isInteger(value)) {
      throw new ShoppingCartException("La cantidad debe ser un número entero");
    }
    if (value < 0) {
      throw new ShoppingCartException("La cantidad no puede ser negativa");
    }
    this.#amount = value;
  }
}

/*
------------------------------------
3. ShoppingCart
------------------------------------

Atributos privados:
- _products
- _productProxies

REQUISITOS:

✔ addItem(uuid, amount)
   - Si existe → sumar cantidad
   - Si no existe → agregar nuevo
   - Si amount < 0 → lanzar error

✔ updateItem(uuid, newAmount)
   - Si newAmount = 0 → eliminar
   - Si < 0 → error

✔ removeItem(uuid)
   - Elimina del arreglo

✔ calculateTotal()
   - Multiplicar cantidad × precio

*/
class ShoppingCart {
  #productProxies;
  #products;
  constructor() {
    // TODO
    this.#productProxies = [];
  }

  // Getter protegido para proxies
  get productProxies() {
    // TODO
    return this.#productProxies;
  }

  set productProxies(value) {
    // Debe lanzar excepción
    throw new ShoppingCartException(
      "No se puede modificar productProxies directamente",
    );
  }

  get products() {
    // TODO
    return this.#products;
  }

  set products(value) {
    /*
        - Recibe arreglo o JSON
        - Debe convertir a instancias de Product
        */
    // TODO
    if (!(value instanceof ProductosService)) {
      throw new ShoppingCartException("Debe ser instancia de ProductosService");
    }
    this.#products = value;
  }

  addItem(productUuid, amount) {
    // TODO
    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0)
      throw new ShoppingCartException("No puede haber cantidades negativas");
    const existingProxy = this.#productProxies.find(
      (p) => p.productUuid === productUuid,
    );
    if (existingProxy) {
      existingProxy.amount += amount;
    } else {
      const newProxy = new ProductProxy(productUuid, amount);
      this.#productProxies.push(newProxy);
    }
  }

  updateItem(productUuid, newAmount) {
    // TODO
    if (typeof newAmount !== 'number' || !Number.isInteger(newAmount) || newAmount < 0) {
        throw new ShoppingCartException("Cantidad inválida");
    }
    const proxy = this.#productProxies.find(p => p.productUuid === productUuid);
    if (!proxy) {
        throw new ShoppingCartException("Producto no encontrado en el carrito");
    }
    if (newAmount === 0) {
        this.removeItem(productUuid);
        return;
    }
    proxy.amount = newAmount;
  }

  removeItem(productUuid) {
    // TODO
    const index = this.#productProxies.findIndex(p => p.productUuid === productUuid);
    if (index !== -1) {
        this.#productProxies.splice(index, 1);
    }
  }

  calculateTotal() {
    // TODO
    return this.#productProxies.reduce((total, proxy) => {
      const product = this.#products.getProductById(proxy.productUuid);
      if (!product) return total;
      return total + proxy.amount * product.pricePerUnit;
    }, 0);
  }
}
