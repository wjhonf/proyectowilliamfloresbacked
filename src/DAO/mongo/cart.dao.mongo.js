const Carts = require('../../models/carts.model')
class CartDAO {
  async tomaTodo() {
    return await Carts.find()
  }
  async creamosUno(newCartInfo) {
    console.log('Creado desde el DAO')
    return await Carts.create(newCartInfo)
  }
}
module.exports = CartDAO