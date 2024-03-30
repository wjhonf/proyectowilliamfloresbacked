class ProductDAO {
    products = []
  
    async tomaTodo() {
      return this.products
    }
    async creamosUno(newProductInfo) {
      this.products.push(newProductInfo)
      return 'Nuevo Equipo creado'
    }
  }
  
  module.exports = ProductDAO