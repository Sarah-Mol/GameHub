const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validateUser = require('../middlewares/validateUser.middleware');
const validateAdmin = require('../middlewares/validateAdmin.middleware');

// GET /api/products - Listar productos (x-auth opcional)
router.get('/products', (req, res, next) => {
    if (req.headers['x-auth']) {
        validateAdmin(req, res, next);
    } else {
        next();
    }
}, productController.getAllProducts);

// POST /api/products/cart - Agregar al carrito
router.post('/products/cart', validateUser, productController.addToCart);

// GET /api/products/cart - Ver carrito
router.get('/products/cart', validateUser, productController.getCart);

// GET /api/products/:id - Obtener producto por ID
router.get('/products/:id', productController.getProductById);

// POST /api/products - Crear producto (admin)
router.post('/products', validateAdmin, productController.createProduct);

// PUT /api/products/:id - Actualizar producto (admin)
router.put('/products/:id', validateAdmin, productController.updateProduct);

// DELETE /api/products/:id - Eliminar producto (admin)
router.delete('/products/:id', validateAdmin, productController.deleteProduct);

module.exports = router;
