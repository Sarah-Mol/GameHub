const productService = require('../services/product.service');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const isAdmin = req.isAdmin || false;
            const products = await productService.getAllProducts(req.query, isAdmin);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            const products = await productService.addToCart(req.userName, req.body);
            res.status(202).json(products);
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    }

    async getCart(req, res) {
        try {
            const cart = await productService.getCart(req.userName);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json({ message: `Producto ${product.title} creado exitosamente`, product });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.status(200).json({ message: `Producto ${product.title} actualizado`, product });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const product = await productService.deleteProduct(req.params.id);
            res.status(200).json({ message: `Producto ${product.title} eliminado` });
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();