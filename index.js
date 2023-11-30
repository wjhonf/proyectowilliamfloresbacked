const fs = require('fs/promises');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.autoIncrementId = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
            this.autoIncrementId = this.calculateNextId();
            console.log("Productos cargados correctamente:", this.products); // Agregar esta línea
        } catch (error) {
            console.error("Error al leer los datos:", error);
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar equipos:', error);
            throw error;
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const requiredCampos = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const campo of requiredCampos) {
            if (!eval(campo)) {
                console.error("Por favor completar todos los campos");
                return;
            }
        }
        if (this.products.some(product => product.code === code)) {
            console.error("El código del equipo ya existe.");
            return;
        }
        const product = {
            id: this.autoIncrementId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(product);
        this.autoIncrementId++;
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.error("Equipo no encontrado ", id);
        }
        return product || null;
    }
    

    async updateProduct(id, updatedProduct) {
        const idEquipo = this.products.findIndex(product => product.id === id);
        if (idEquipo !== -1) {
            console.log("Antes de la actualización, productos:", this.products); // Agregar esta línea
            this.products[idEquipo] = { ...this.products[idEquipo], ...updatedProduct, id };
            console.error("Equipo Actualizado correctamente", id);
            await this.saveProducts();  // Asegúrate de esperar a que se guarden los productos antes de continuar
            console.log("Después de la actualización, productos:", this.products); // Agregar esta línea
        } else {
            console.error("Equipo no encontrado ", id);
        }
    }

    deleteProduct(id) {
        const idEquipo = this.products.findIndex(product => product.id === id);
        if (idEquipo !== -1) {
            this.products.splice(idEquipo, 1);
            console.error("Equipo Eliminado correctamente", id);
            this.saveProducts();
        } else {
            console.error("Equipo no encontrado ", id);
        }
    }

    calculateNextId() {
        if (this.products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.products.map(product => product.id));
        return maxId + 1;
    }
}

/*const productManager = new ProductManager('./equipos.json');
productManager.addProduct("Laptop", "Pantalla 15.6 RAM 8GB SSD 1TB", 1755.22, "ruta/laptop.jpg", "E001", 6);
productManager.addProduct("PC Desktop", "i5 RAM 8GB SSD 500GB", 1300, "ruta/pc.jpg", "E002", 3);*/


const productManager = new ProductManager('./equipos.json');
productManager.updateProduct(1, { price: 5888, stock: 8 });

// Llama al método getProductById en la instancia creada
const updatedProduct = productManager.getProductById(1);
console.log(updatedProduct);
