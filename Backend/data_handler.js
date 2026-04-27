"use strict";

/*
====================================================
DATA_HANDLER.JS
====================================================

Aquí crearás la clase ProductosService.

Será responsable del CRUD de productos
y de realizar búsquedas.

Debe manejar internamente un arreglo privado:
  _products

====================================================
*/

class ProductosService {
  #products;
  constructor() {
    // TODO:
    // Inicializar arreglo vacío
    this.#products = [];
  }

  /*
    ==========================
    CRUD
    ==========================
    */

  // Regresa copia del arreglo
  getProducts() {
    // TODO
    return [...this.#products];
  }

  // Buscar por UUID
  getProductById(uuid) {
    // TODO
    return this.#products.find((product) => product.uuid === uuid);
  }

  // Agregar producto
  createProduct(product) {
    // TODO
    if (!(product instanceof Product)) {
      throw new Error("Debe ser instancia de Product");
    }
    this.#products.push(product);
  }

  // Actualizar producto existente
  updateProduct(uuid, updatedData) {
    /*
        REGLAS:
        - Buscar producto por UUID
        - Si no existe → no hacer nada o lanzar error
        - Usar Object.assign
        */
    // TODO
    const product = this.getProductById(uuid);
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    Object.assign(product, updatedData);
  }

  // Eliminar producto
  deleteProduct(uuid) {
    // TODO
    const index = this.#products.findIndex((p) => p.uuid === uuid);
    if (index !== -1) {
      this.#products.splice(index, 1);
    }
  }

  /*
    ==========================
    BÚSQUEDA
    ==========================
  
    Formatos permitidos:
  
    "categoria:titulo"
    "categoria:"
    ":titulo"
    "titulo"
  
    Debes usar:
    - split(":")
    - filter()
    - includes()
  
    */
  findProducts(query) {
    // TODO
    const cat_title = query.split(":");
    let category = null;
    let title = null;
    if (cat_title.length === 2) {
      category = cat_title[0];
      title = cat_title[1];
      if (category === "") category = null;
      if (title === "") title = null;
    }else{
        title = cat_title[0];
    }

    return this.#products.filter(product => 
    {
        const match_cat = category === null || product.category.toLowerCase().includes(category.toLowerCase());
        const match_title = title === null || product.title.toLowerCase().includes(title.toLowerCase());
        return match_cat && match_title;
    }
    )
  }

  /*
    ==========================
    RENDER HTML
    ==========================
  
    Debe:
    - Convertir lista en HTML usando toHTML()
    - Insertar resultado en htmlElement.innerHTML
    */
  productListToHTML(htmlElement) {
    // TODO
    const products = this.getProducts();
    const htmlString = products.map(product => product.toHTML()).join('');
    htmlElement.innerHTML = htmlString;
  }
}
