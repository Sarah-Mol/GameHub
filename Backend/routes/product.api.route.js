const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const validateUser = require('../middlewares/validateUser.middleware');
const validateAdmin = require('../middlewares/validateAdmin.middleware');

router.get(
  '/products',
  (req, res, next) => {
    if (req.headers['x-auth']) {
      return validateAdmin(req, res, next);
    }
    next();
  },
  productController.getAllProducts,
);

router.post('/products/cart', validateUser, productController.addToCart);
router.get('/products/cart', validateUser, productController.getCart);
router.get('/products/:id', productController.getProductById);
router.post('/products', validateAdmin, productController.createProduct);
router.put('/products/:id', validateAdmin, productController.updateProduct);
router.delete('/products/:id', validateAdmin, productController.deleteProduct);

module.exports = router;
