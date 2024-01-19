class CartDAO {
  carts = []

  async tomaTodo() {
    console.log('carts desde el array')
    return this.carts
  }

  async creamosUno(newCartInfo) {
    console.log('Creado desde el DAO')
    this.carts.push(newCartInfo)
    return 'Nuevo cart creado'
  }
}

module.exports = CartDAO