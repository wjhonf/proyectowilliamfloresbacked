const mongoose = require('mongoose');

const productCollection = 'products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
  category: String,
  thumbnail: {
    type: String,
    default: "img/equipo3.jpg"
  },
  createdAt: Date,
  updatedAt: Date,
});


const Product = mongoose.model(productCollection, productSchema);

module.exports = Product;
