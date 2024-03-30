const Carts = require('../mongo/models/carts.model');
const ProductDAO=require('../mongo/models/product.model')
class CartDAO {
  async tomaTodo({ limit = 10, page = 1, fromDate, toDate } = {}) {
    let query = {};
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        let fromDateObject = new Date(fromDate);
        fromDateObject.setUTCHours(0, 0, 0, 0);
        query.createdAt.$gte = fromDateObject;
      }
      if (toDate) {
        let toDateObject = new Date(toDate);
        toDateObject.setUTCHours(23, 59, 59, 999);
        query.createdAt.$lte = toDateObject;
      }
    }
    const sortOrder = { createdAt: -1 }; 
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOrder,
    };

    try {
      const response = await Carts.paginate(query, options);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async creamosUno(newCartInfo) {
    try {
      req.logger.info('Creado desde el DAO');
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
  async checkProductStock(productId, desiredQuantity) {
    try {
      const product = await ProductDAO.findById(productId);
      
      if (!product) {
        return 'Producto no encontrado';
      }
      
      if (desiredQuantity > product.stock) {
        return `No hay suficiente stock disponible. Stock actual: ${product.stock}`;
      }
      
      return true;
    } catch (error) {
      return error.message; // Devolver el mensaje de error si ocurre alguno
    }
  }
  

}

module.exports = CartDAO;
