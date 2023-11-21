class ProductManager {
    constructor() {
        this.products = [];
        this.autoIncrementId = 1;
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        const requiredCampos = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const campo of requiredCampos) {
            if (!eval(campo)) {
                console.error(`El campo ${campo} es obligatorio.`);
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
}
const productManager  = new ProductManager();
productManager.addProduct("Laptop", "Pantalla 15.6 RAM 8GB SSD 1TB", 1755.22, "ruta/laptop.jpg", "E001", 6);
productManager.addProduct("PC Desktop", "i5 RAM 8GB SSD 500GB", 1300, "ruta/pc.jpg", "E002", 3);
const productById = productManager.getProductById(1);
console.log(productById);

const notExistentProduct = productManager.getProductById(12);
if (!notExistentProduct) {
    console.log("Not found");
}
