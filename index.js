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
        } catch (error) {
            console.error("Error al leer los datos");
            this.products = [];
        }
    }
    async saveProducts() {
        try {
            return await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar equipos:', error);
            throw error;
        }
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
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
    
        try {
            await this.saveProducts();
            console.log("Equipo Agregado correctamente");
        } catch (error) {
            console.error("Error al guardar equipos:", error);
        }
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
    deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.loadProducts();
                const idEquipo = this.products.findIndex(product => product.id === id);
                if (idEquipo !== -1) {
                    this.products.splice(idEquipo, 1);
                    console.log("Equipo Eliminado correctamente", id);
                    await this.saveProducts();
                    resolve();
                } else {
                    console.error("Equipo no encontrado ", id);
                    reject(new Error(`Equipo no encontrado: ${id}`));
                }
            } catch (error) {
                console.error("Error al eliminar el equipo:", error);
                reject(error);
            }
        });
    }
    calculateNextId() {
        if (this.products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.products.map(product => product.id));
        return maxId + 1;
    }
    async updateProduct(id, updatedProduct) {
        try {
            await this.loadProducts(); 
            const productToUpdate = this.products.find(product => product.id === id);
            if (productToUpdate) {
                Object.assign(productToUpdate, updatedProduct);
                await this.saveProducts(); 
                console.log("Equipo Actualizado correctamente", id);
            } else {
                console.error("Equipo no encontrado ", id);
            }
        } catch (error) {
            console.error("Error al actualizar el equipo:", error);
            throw error;
        }
    }
}
//Registra equipos 
const productManager = new ProductManager('./equipos.json');
productManager.addProduct("Laptop", "Pantalla 15.6 RAM 8GB SSD 1TB", 1755.22, "ruta/laptop.jpg", "E001", 6);
productManager.addProduct("PC Desktop", "i5 RAM 8GB SSD 500GB", 1300, "ruta/pc.jpg", "E002", 3);
/*
//Actualizar equipos 
const productManager = new ProductManager('./equipos.json');
(async () => {
    await productManager.updateProduct(7, { price: 70000, stock: 8 });
    const updatedProduct = productManager.getProductById(1);
    //console.log(updatedProduct);
}
)();

//Elimiar Equipos
const productManagerDelte = new ProductManager('./equipos.json');
(async () => {
    await productManagerDelte.deleteProduct(1); 
    const deletedProduct = productManagerDelte.getProductById(1);
    console.log(deletedProduct); 
})();*/
