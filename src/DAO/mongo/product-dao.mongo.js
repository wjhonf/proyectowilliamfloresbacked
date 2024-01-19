const Product = require('../../models/product.model')

class ProductDAO {
  async tomaTodo() {
    return await Product.find()
  }

  async creamosUno(newProductInfo) {
    console.log('Creado desde el DAO')
    return await Product.create(newProductInfo)
  }
}

module.exports = ProductDAO