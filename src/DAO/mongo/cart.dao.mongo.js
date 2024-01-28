const Carts = require('../../models/carts.model');

class CartDAO {
  async tomaTodo({ limit = 10, page = 1, fromDate, toDate } = {}) {
    let query = {};

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        let toDateObject = new Date(toDate);
        toDateObject.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDateObject;
      }
    }
    const carts = await Carts.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
      .exec();
    
    const total = await Carts.countDocuments(query);

    return { carts, total, limit, page };
  }
  async creamosUno(newCartInfo) {
    try {
      console.log('Creado desde el DAO');
      return await Carts.create(newCartInfo);
    } catch (error) {
      throw error;
    }
  }
  async tomaUno(cartId) {
    try {
      return await Carts.findById(cartId);  
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
  async eliminarCarrito(cartId) {
    try {
      return await Carts.findByIdAndDelete(cartId);
    } catch (error) {
      throw error;
    }
  }

}

module.exports = CartDAO;
