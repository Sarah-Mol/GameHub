const shortid = require('shortid');
const productRepository = require('../../repositories/product.repository');

class ProductService {
    async getAllProducts(queryParams, isAdmin) {
        let products = await productRepository.getAllProducts();

        if (queryParams) {
            for (const [key, value] of Object.entries(queryParams)) {
                if (key !== 'stock' && key !== 'min' && key !== 'max' && value) {
                    products = products.filter(p => 
                        p[key] && p[key].toString().toLowerCase().includes(value.toLowerCase())
                    );
                }
            }

            const min = parseFloat(queryParams.min);
            const max = parseFloat(queryParams.max);

            if (!isNaN(min) && !isNaN(max)) {
                products = products.filter(p => p.pricePerUnit >= min && p.pricePerUnit <= max);
            } else if (!isNaN(min)) {
                products = products.filter(p => p.pricePerUnit >= min);
            } else if (!isNaN(max)) {
                products = products.filter(p => p.pricePerUnit <= max);
            }
        }

        if (!isAdmin) {
            products = products.map(({ stock, ...product }) => product);
        }

        return products;
    }

    async getProductById(id) {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async addToCart(userName, productIds) {
        if (!Array.isArray(productIds)) {
            const error = new Error('El body debe ser un arreglo de IDs');
            error.status = 400;
            throw error;
        }

        for (const id of productIds) {
            const exists = await productRepository.getProductById(id);
            if (!exists) {
                const error = new Error(`Producto con ID ${id} no encontrado`);
                error.status = 404;
                throw error;
            }
        }

        await productRepository.saveCart(userName, productIds);
        
        const products = [];
        for (const id of productIds) {
            const product = await productRepository.getProductById(id);
            if (product) {
                const { stock, ...productWithoutStock } = product;
                products.push(productWithoutStock);
            }
        }
        
        return products;
    }

    async getCart(userName) {
        const cart = await productRepository.getCartByUser(userName);
        
        if (!cart) {
            return { user: userName, products: [], total: 0 };
        }

        const products = [];
        let total = 0;

        for (const id of cart.cart) {
            const product = await productRepository.getProductById(id);
            if (product) {
                const { stock, ...productWithoutStock } = product;
                products.push(productWithoutStock);
                total += product.pricePerUnit;
            }
        }

        return {
            user: userName,
            products,
            total
        };
    }

    async createProduct(productData) {
        const requiredFields = ['imageUrl', 'title', 'description', 'unit', 'category', 'pricePerUnit', 'stock'];
        const missingFields = requiredFields.filter(field => !(field in productData));
        
        if (missingFields.length > 0) {
            const error = new Error(`Campos faltantes: ${missingFields.join(', ')}`);
            error.status = 400;
            throw error;
        }

        const newProduct = {
            id: shortid.generate(),
            ...productData
        };

        await productRepository.addProduct(newProduct);
        return newProduct;
    }

    async updateProduct(id, productData) {
        const existing = await productRepository.getProductById(id);
        if (!existing) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }

        const requiredFields = ['imageUrl', 'title', 'description', 'unit', 'category', 'pricePerUnit', 'stock'];
        const missingFields = requiredFields.filter(field => !(field in productData));
        
        if (missingFields.length > 0) {
            const error = new Error(`Campos faltantes: ${missingFields.join(', ')}`);
            error.status = 400;
            throw error;
        }

        const updated = await productRepository.updateProduct(id, productData);
        return updated;
    }

    async deleteProduct(id) {
        const existing = await productRepository.getProductById(id);
        if (!existing) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }

        const deleted = await productRepository.deleteProduct(id);
        return deleted;
    }
}

module.exports = new ProductService();
