"use strict";

/*
====================================================
PRODUCTS.JS
====================================================

Aquí debes crear:

1. Clase ProductException
2. Clase Product

La clase Product debe:
- Generar automáticamente un UUID
- Tener getters y setters con validaciones
- Tener métodos estáticos
- Tener un método toHTML()

====================================================
*/

/*
------------------------------------
1. Clase ProductException
------------------------------------

Debe extender de Error.
Debe recibir un mensaje en el constructor.
*/
class ProductException extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductException";
  }
}

/*
------------------------------------
2. Clase Product
------------------------------------

Atributos privados:
- _uuid
- _title
- _description
- _imageUrl
- _unit
- _stock
- _pricePerUnit
- _category

REQUISITOS IMPORTANTES:

✔ uuid:
   - Se genera automáticamente usando generateUUID()
   - No debe poder modificarse desde fuera
   - Si alguien intenta modificarlo → lanzar excepción

✔ Validaciones:
   - Strings no pueden estar vacíos
   - Números no pueden ser negativos
   - Si hay error → lanzar ProductException

✔ Debe incluir:
   - getters y setters
   - método toHTML()
   - métodos estáticos:
       • createFromJson(jsonValue)
       • createFromObject(obj)
       • cleanObject(obj)

------------------------------------
*/

class Product {
  #uuid;
  #title;
  #description;
  #imageUrl;
  #unit;
  #stock;
  #pricePerUnit;
  #category;
  constructor(
    title,
    description,
    imageUrl,
    unit,
    stock,
    pricePerUnit,
    category,
  ) {
    // TODO:
    // 1. Generar UUID
    // 2. Asignar valores
    this.#uuid = generateUUID();
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.unit = unit;
    this.stock = stock;
    this.pricePerUnit = pricePerUnit;
    this.category = category;
  }

  /*
    ==========================
    GETTERS Y SETTERS
    ==========================
    - Implementar validaciones
    - Lanzar ProductException si algo es inválido
    */

  // TODO: uuid (getter + setter protegido)
  get uuid() {
    return this.#uuid;
  }
  set uuid(value) {
    throw new ProductException("El UUID no puede ser modificado");
  }
  // TODO: title
  get title() {
    return this.#title;
  }
  set title(value) {
    if (!value || value.trim() === "") {
      throw new ProductException("El título no puede estar vacío");
    }
    this.#title = value;
  }
  // TODO: description
  get description() {
    return this.#description;
  }
  set description(value) {
    if (!value || value.trim() === "") {
      throw new ProductException("La descripción no puede estar vacía");
    }
    this.#description = value;
  }
  // TODO: imageUrl
  get imageUrl() {
    return this.#imageUrl;
  }
  set imageUrl(value) {
    if (!value || value.trim() === "") {
      throw new ProductException("Debe de ingresar una URL de la imagen");
    }
    this.#imageUrl = value;
  }
  // TODO: unit
  get unit() {
    return this.#unit;
  }
  set unit(value) {
    if (!value || value.trim() === "") {
      throw new ProductException("Ingrese una unidad");
    }
    this.#unit = value;
  }
  // TODO: stock
  get stock() {
    return this.#stock;
  }
  set stock(value) {
    if (typeof value !== "number") {
      throw new ProductException("El stock debe ser un número");
    }
    if (!Number.isInteger(value)) {
      throw new ProductException("El stock debe ser un número entero");
    }
    if (value < 0) {
      throw new ProductException("El stock no puede ser negativo");
    }
    this.#stock = value;
  }
  // TODO: pricePerUnit
  get pricePerUnit() {
    return this.#pricePerUnit;
  }
  set pricePerUnit(value) {
    if (value < 0 || typeof value !== "number") {
      throw new ProductException("El precio debe ser un numero positivo");
    }
    this.#pricePerUnit = value;
  }
  // TODO: category
  get category() {
    return this.#category;
  }
  set category(value) {
    if (!value || value.trim() === "") {
      throw new ProductException("La categoría no puede estar vacía");
    }
    this.#category = value;
  }

  /*
    ==========================
    MÉTODO toHTML()
    ==========================
    Debe regresar un template string HTML
    con la información del producto.
    */
  toHTML() {
    // TODO
    return `
            <div class="col">
                <div class="card h-100">
                    <img src="${this.imageUrl}" class="card-img-top" alt="${this.title}">
                    <div class="card-body">
                        <h5 class="card-title">${this.title}</h5>
                        <p class="card-text">${this.description}</p> 
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Precio: $${this.pricePerUnit}</small>
                        <small class="text-body-secondary">Stock: ${this.stock}</small>
                    </div>
                </div>
            </div>
        `;
  }

  /*
    ==========================
    MÉTODOS ESTÁTICOS
    ==========================
    */

  /*
    createFromJson(jsonValue)
    - Recibe un string JSON
    - Lo convierte a objeto
    - Llama a createFromObject
    */
  static createFromJson(jsonValue) {
    // TODO
    var json_object = JSON.parse(jsonValue);
    return this.createFromObject(json_object);
  }

  /*
    createFromObject(obj)
    - Recibe un objeto
    - Debe limpiar propiedades extra
    - Debe crear una nueva instancia de Product
    */
  static createFromObject(obj) {
    // TODO
    const clean = this.cleanObject(obj);
    return new Product(
      clean.title,
      clean.description,
      clean.imageUrl,
      clean.unit,
      clean.stock,
      clean.pricePerUnit,
      clean.category,
    );
  }

  /*
    cleanObject(obj)
    - Elimina propiedades que no pertenezcan a Product
    - Regresa el objeto limpio
    */
  static cleanObject(obj) {
    // TODO
    const properties = [
      "title",
      "description",
      "imageUrl",
      "unit",
      "stock",
      "pricePerUnit",
      "category",
    ];
    const clean = {};
    for (let propertie of properties) {
      if (obj.hasOwnProperty(propertie)) {
        clean[propertie] = obj[propertie];
      }
    }
    return clean;
  }
}
