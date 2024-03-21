const ProductDAOMongo = require('../DAO/mongo/product-dao.mongo')
const ProductDAOArray = require('../DAO/memory/cart-dao.arrays')

const Product = new ProductDAOMongo()
const getAll = async (params) => {
  try {
    const response = await Product.tomaTodo(params);
    return response;
  } catch (error) {
    throw error;
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
const getProductById = async productId => {
  try {
    return await Product.findById(productId);
  } catch (error) {
    throw error;
  }
}
const deleteProductById = async productId => {
  try {
    const deletedProduct = await Product.deleteProduct({ _id: productId });
    return deletedProduct;
  } catch (error) {
    throw error;
  }
}
const updateById = async (productId, updatedProductData) => {
  try {
    const updatedProduct = await Product.updateById(productId, updatedProductData);

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};
const insertMany = async products => {
  try {
    return await Product.insertMany(products);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAll,
  insertOne,
  deleteProductById,
  insertMany,
  getProductById,
  updateById,
}