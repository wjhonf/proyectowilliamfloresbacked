const Product = require('../mongo/models/product.model')
class ProductDAO {
  async tomaTodo({ limit = 10, page = 1, sort = '', category = '', status = '', search = '' }) {
    const query = {};
    if (category) {
      query.category = category;
    }
    if (status !== '') {
      query.status = status === 'true';
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    query.stock = { $gte: 1 };
    let sortOrder = sort === 'asc' ? { price: 1 } : { price: -1 };
  
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOrder,
    };
    try {
      const response = await Product.paginate(query, options);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async creamosUno(newProductInfo) {
    return await Product.create(newProductInfo)
  }
  async findById(productId) {
    try {
      const product = await Product.findById(productId).lean().exec();
      return product;
    } catch (error) {
      throw error;
    }
  }
  async updateById(id, updatedProductData) {
    try {
      const updatedProduct = await Product.updateOne({ _id: id }, updatedProductData);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
  
  async deleteProduct(idProduct) {
    console.log(idProduct)
    return await Product.deleteOne({ _id: idProduct });
 }
  async insertMany(products) {
    return await Product.insertMany(products);
  }
  
}

module.exports = ProductDAO