const ProductDAOMongo = require('../DAO/mongo/product-dao.mongo')
const ProductDAOArray = require('../DAO/arrays/cart-dao.arrays')

const Product = new ProductDAOMongo()
const getAll = async () => {
  try {
    const products = await Product.tomaTodo()
    console.log('Obtenemos todos desde el service')
    return products
  } catch (error) {
    throw error
  }
}

const insertOne = async newProductInfo => {
  try {
    newProductInfo.createdAt = new Date()
    newProductInfo.updatedAt = new Date()

    const newProduct = await Product.creamosUno(newProductInfo)

    return newProduct
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAll,
  insertOne,
}