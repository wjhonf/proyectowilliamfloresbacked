const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productCollection = 'product';
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index:true
  },
  description: String,
  code: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  thumbnail: {
    type: String,
  },
  owner: {
    type: String,
    default: 'admin'
  },
  createdAt: Date,
  updatedAt: Date,
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(productCollection, productSchema);

module.exports = Product;
