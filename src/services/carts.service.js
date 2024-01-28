const ProductDAOMongo = require('../DAO/mongo/product-dao.mongo');
const ProductDAO = new ProductDAOMongo();
const CartDAOMongo = require('../DAO/mongo/cart.dao.mongo');

const Cart = new CartDAOMongo();

const getAll = async (params = {}) => {
  try {
    const carts = await Cart.tomaTodo(params);
    return carts;
  } catch (error) {
    throw error;
  }
};
const insertOne = async newCartInfo => {
  try {
    newCartInfo.createdAt = new Date();
    newCartInfo.updatedAt = new Date();
    const newCart = await Cart.creamosUno(newCartInfo);
    return newCart;
  } catch (error) {
    throw error;
  }
};
const getCartDetails = async (cartId) => {
  try {
    const cart = await Cart.tomaUno(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    const itemsWithTitles = await Promise.all(cart.items.map(async (item) => {
      const product = await obtenerTituloDelProducto(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        title: product.title  
      };
    }));

    return {
      nombre: cart.nombre,
      direccion: cart.direccion,
      items: itemsWithTitles,
    };
  } catch (error) {
    throw error;
  }
};

const obtenerTituloDelProducto = async (productId) => {
  try {
      const product = await ProductDAO.findById(productId);
      if (!product) {
          throw new Error('Producto no encontrado');
      }
      return product;
  } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
  }
}
const removeProductFromCart = async (cartId, productId) => {
  try {
    return await Cart.removerProductoDelCarrito(cartId, productId);
  } catch (error) {
    throw error;
  }
};

const updateCart = async (cartId, updatedCartData) => {
  try {
    updatedCartData.updatedAt = new Date();
    return await Cart.actualizarCarrito(cartId, updatedCartData);
  } catch (error) {
    throw error;
  }
};

const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    return await Cart.actualizarCantidadProducto(cartId, productId, quantity);
  } catch (error) {
    throw error;
  }
};

const removeAllProductsFromCart = async (cartId) => {
  try {
    return await Cart.eliminarTodosLosProductosDelCarrito(cartId);
  } catch (error) {
    throw error;
  }
};
const deleteCart = async (cartId) => {
  try {
    return await Cart.eliminarCarrito(cartId);
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAll,
  insertOne,
  getCartDetails,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  removeAllProductsFromCart,
  deleteCart,
};
