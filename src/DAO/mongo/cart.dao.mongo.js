const Carts = require('../../models/carts.model');

class CartDAO {
  async tomaTodo() {
    try {
      return await Carts.find();
    } catch (error) {
      throw error;
    }
  }

  async creamosUno(newCartInfo) {
    try {
      console.log('Creado desde el DAO');
      return await Carts.create(newCartInfo);
    } catch (error) {
      throw error;
    }
  }

  async removerProductoDelCarrito(cartId, productId) {
    try {
      return await Carts.updateOne({ _id: cartId }, { $pull: { items: { productId: productId } } });
    } catch (error) {
      throw error;
    }
  }

  async actualizarCarrito(cartId, updatedCartData) {
    try {
      return await Carts.updateOne({ _id: cartId }, { $set: updatedCartData });
    } catch (error) {
      throw error;
    }
  }

  async actualizarCantidadProducto(cartId, productId, newQuantity) {
    try {
      return await Carts.updateOne(
        { _id: cartId, 'items.productId': productId },
        { $set: { 'items.$.quantity': newQuantity } }
      );
    } catch (error) {
      throw error;
    }
  }

  async eliminarTodosLosProductosDelCarrito(cartId) {
    try {
      return await Carts.updateOne({ _id: cartId }, { $set: { items: [] } });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartDAO;
