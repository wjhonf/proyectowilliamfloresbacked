const CartDAOMongo = require('../DAO/mongo/cart.dao.mongo');

const Cart = new CartDAOMongo();

const getAll = async () => {
  try {
    const carts = await Cart.tomaTodo();
    console.log('Obtenemos todos desde el service');
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

module.exports = {
  getAll,
  insertOne,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  removeAllProductsFromCart,
};
