const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(data) {
        this._id = data._id || uuidv4(); 
        this.title = data.title;
        this.description = data.description;
        this.code = data.code;
        this.price = data.price;
        this.status = data.status;
        this.stock = data.stock;
        this.category = data.category;
        this.thumbnail = data.thumbnail;
    }
}

module.exports = Product;
