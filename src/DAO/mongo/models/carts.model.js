const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const cartCollection = 'carts';
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
cartSchema.plugin(mongoosePaginate);
const Cart = mongoose.model(cartCollection, cartSchema);
module.exports = Cart;
