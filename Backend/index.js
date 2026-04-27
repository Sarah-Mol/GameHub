



/*
====================================================
INDEX.JS
====================================================

Aquí debes probar TODO tu sistema.
Aquí debes probar TODO tu sistema.

    !IMPORTANTE: Despues de cada TODO completado muestra en consola lo realizado junto con un mensaje 
    ! referente al TODO 

* TIP: Pueden utilizar console.table para mostrar de una forma más clara sus objetos y listas.

Debes:

1. Crear instancia de ProductosService
2. Crear varios productos
3. Probar:
   - createProduct
   - updateProduct
   - deleteProduct
   - findProducts
   - productListToHTML

4. Crear instancia de ShoppingCart
5. Probar:
   - addItem
   - updateItem
   - removeItem
   - calculateTotal

6. Provocar al menos UNA excepción
   y manejarla con try/catch
====================================================
*/
// * No mostrar en consola
// TODO: Obtener elemento HTML principal
const mainList = document.getElementById('mainList');

// * No mostrar en consola
// TODO: Crear instancia ProductosService
const productService = new ProductosService();

// * Mostrar en consola
// TODO: Crear productos manualmente
// ? Crea 1 producto USANDO el metodo addProduct de ProductosService
// ? Crea 1 producto USANDO el metodo createProduct de ProductosService
const prod1 = new Product("Manzana", "Roja", "manzana.jpg", "kg", 10, 25.50, "fruta");
productService.createProduct(prod1);
console.log("Producto creado:", prod1.title);

const prod2 = new Product("Pan", "Blanco", "pan.jpg", "pz", 20, 35.00, "pan");
productService.createProduct(prod2);
console.log("Producto creado:", prod2.title);

// * Mostrar en consola
// TODO: Crear producto desde JSON utilizando el metodo estatico correspondiente de la clase Producto
const jsonTexto = '{"title": "Pan", "description": "Blanco", "imageUrl": "pan.jpg", "unit": "pz", "stock": 20, "pricePerUnit": 35.00, "category": "pan"}';
const prod3 = Product.createFromJson(jsonTexto);
productService.createProduct(prod3);
console.log("Producto 3 creado desde JSON:", prod3.title);

// * Mostrar en consola
// TODO: Crear producto desde objeto
const objetoConExtras = {
    title: "Platano",
    description: "De Tabasco",
    imageUrl: "platano.jpg",
    unit: "kg",
    stock: 8,
    pricePerUnit: 40.00,
    category: "fruta",
    datoExtra: "esto no deberia aparecer",
    otroDato: 123
};
const prod4 = Product.createFromObject(objetoConExtras);
productService.createProduct(prod4);
console.log("Producto desde objeto:", prod4.title);

// * Mostrar en consola
// TODO: Mostrar productos en consola
console.log("Total de productos:", productService.getProducts().length);
console.table(productService.getProducts());

// * Mostrar en consola
// TODO: Crea un objeto con muchas más propiedades que un producto
// ? Limpia el objeto  (cleanObject) //muestra el resultado en consola
// ? añadelo a la lista de ProductosService con el metodo que quieras
const objetoSucio = {
    title: "Queso",
    description: "Amarillo",
    imageUrl: "queso.jpg",
    unit: "kg",
    stock: 5,
    pricePerUnit: 120.00,
    category: "lacteo",
    virus: "no deberia estar",
    hacker: "tampoco esto"
};
console.log("Objeto antes de limpiar:", objetoSucio);
const objetoLimpio = Product.cleanObject(objetoSucio);
console.log("Objeto despues de limpiar:", objetoLimpio);
const prod5 = Product.createFromObject(objetoLimpio);
productService.createProduct(prod5);
console.log("Producto limpio agregado:", prod5.title);

/************ PROBAR TODO *******************/
//TODO: crea un ciclo for para añadir a ProductoService 5 productos con estos datos
//? PUEDES CAMBIAR LOS DATOS A TU GUSTO
let titulos = ["mermelada", "cebolla", "aguacate", "platano", "pan blanco"]
let descripcion = ["de México", "de Puebla", "de Michoacan", "de Aguascalientes", "de Jalisco"]
let unit = ["pieza", "kg", "kg", "kg", "pieza"]
let category = ["aderezo", "verdura", "verdura", "fruta", "pan"]
let precio = [50.50, 25.00, 58.00, 40.00, 60.50]
let stock = [15, 5, 10, 8, 15]
let images = ["mermelada.jpg", "cebolla.jpg", "aguacate.jpg", "platano.jpg", "pan.jpg"] //TODO: PONLE IMAGENES AL GUSTO

for (let i = 0; i < titulos.length; i++) {
    const prod = new Product(
        titulos[i],
        descripcion[i],
        images[i],
        unit[i],
        stock[i],
        precio[i],
        category[i]
    );
    productService.createProduct(prod);
    console.log(`Creado: ${prod.title}`);
}
// TODO: Mostrar productos en consola
console.log("Total después del ciclo:", productService.getProducts().length);
console.table(productService.getProducts());

// * Mostrar en consola console.table
// TODO: Actualizar producto
productService.updateProduct(prod1.uuid, { pricePerUnit: 30.00, stock: 15 });
console.log("Producto actualizado - Nuevo precio:", prod1.pricePerUnit, "Nuevo stock:", prod1.stock);

// * Mostrar en consola
// TODO: Eliminar producto
productService.deleteProduct(prod2.uuid);
console.log("Producto eliminado. Total ahora:", productService.getProducts().length);

// * Mostrar en consola
// TODO: Probar búsquedas por categoria
const verduras = productService.findProducts("verdura:");
console.log("Verduras encontradas:", verduras.map(p => p.title));

// * Mostrar en consola
// TODO: Probar búsquedas por titulo
const conPla = productService.findProducts(":platano");
console.log("Productos con 'platano':", conPla.map(p => p.title));

// * Mostrar en consola
// TODO: Probar búsquedas por ambos filtros
const verduraConA = productService.findProducts("verdura:a");
console.log("Verduras con 'a':", verduraConA.map(p => p.title));

// TODO: Renderizar HTML
// ? Ejemplo de uso: productoService.productListToHTML(mainList);
productService.productListToHTML(mainList);
console.log("Productos renderizados en la página");

// TODO: Realiza una accion que genere una excepcion
try {
   const productoInvalido = new Product("", "Sin título", "img.jpg", "pz", 10, 25, "test");
} catch (e) {
   console.error("Excepción capturada:", e.name, "-", e.message);
}

// ------------------ Test ShoppingCart ------------------
// * Mostrar en consola con un console.table
// TODO: Crear carrito
const cart = new ShoppingCart();
cart.products = productService;
console.log("Carrito creado");

// * Mostrar en consola
// TODO: Agregar productos al carrito
const productosDisponibles = productService.getProducts();
cart.addItem(productosDisponibles[0].uuid, 2); // 2 mermeladas
cart.addItem(productosDisponibles[1].uuid, 3); // 3 cebollas
cart.addItem(productosDisponibles[2].uuid, 1); // 1 aguacate
cart.addItem(productosDisponibles[3].uuid, 5); // 5 platanos
console.log("Productos en carrito:", cart.productProxies.length);
console.table(cart.productProxies);

// TODO: Actualizar producto del carrito
cart.updateItem(productosDisponibles[0].uuid, 5); 
console.log("Cantidad actualizada:", cart.productProxies[0].amount);

// TODO: Eliminar producto del carrito
cart.removeItem(productosDisponibles[1].uuid);
console.log("Después de eliminar:", cart.productProxies.length, "productos");

// TODO: Calcular total
const total = cart.calculateTotal();
console.log("Total del carrito: $" + total.toFixed(2));

// TODO: Probar excepción con try/catch
try {
    cart.addItem(productosDisponibles[0].uuid, -1);
} catch (e) {
    console.error("Excepción del carrito:", e.name, "-", e.message);
}