const CartDAOMongo = require('../DAO/mongo/cart.dao.mongo')
const UserDAOArray = require('../DAO/arrays/cart-dao.arrays')

const Cart = new CartDAOMongo()
const getAll = async () => {
  try {
    const carts = await Cart.tomaTodo()
    console.log('Obtenemos todos desde el service')
    return carts
  } catch (error) {
    throw error
  }
}

const insertOne = async newCartInfo => {
  try {
    newCartInfo.createdAt = new Date()
    newCartInfo.updatedAt = new Date()

    const newCart = await Cart.creamosUno(newCartInfo)

    return newCart
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAll,
  insertOne,
}