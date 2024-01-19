class ProductDAO {
    products = []
  
    async tomaTodo() {
      console.log('usuarios desde el array')
      return this.products
    }
    async creamosUno(newProductInfo) {
      console.log('Creado desde el DAO')
      this.products.push(newProductInfo)
      return 'Nuevo Equipo creado'
    }
  }
  
  module.exports = ProductDAO