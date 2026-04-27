const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'products.json');
const CART_FILE = path.join(__dirname, '..', 'cart.json');

class ProductRepository {
    async getAllProducts() {
        try {
            const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === id);
    }

    async saveProducts(products) {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    }

    async addProduct(product) {
        const products = await this.getAllProducts();
        products.push(product);
        await this.saveProducts(products);
    }

    async updateProduct(id, updatedData) {
        const products = await this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            await this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        const products = await this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            const deleted = products.splice(index, 1)[0];
            await this.saveProducts(products);
            return deleted;
        }
        return null;
    }

    async getAllCarts() {
        try {
            const data = await fs.readFile(CART_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.writeFile(CART_FILE, JSON.stringify(carts, null, 2));
    }

    async getCartByUser(userName) {
        const carts = await this.getAllCarts();
        return carts.find(c => c.user === userName);
    }

    async saveCart(userName, productIds) {
        const carts = await this.getAllCarts();
        const existingIndex = carts.findIndex(c => c.user === userName);
        
        if (existingIndex !== -1) {
            carts[existingIndex].cart = productIds;
        } else {
            carts.push({ user: userName, cart: productIds });
        }
        
        await this.saveCarts(carts);
    }
}

module.exports = new ProductRepository();
