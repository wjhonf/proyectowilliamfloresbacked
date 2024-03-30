class CartDAO {
  carts = []

  async tomaTodo() {
    return this.carts
  }

  async creamosUno(newCartInfo) {
    this.carts.push(newCartInfo)
    return 'Nuevo cart creado'
  }
}

module.exports = CartDAO