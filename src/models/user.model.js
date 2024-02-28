const mongoose = require('mongoose')
const { useValidPassword } = require('../utils/crypt-password.util');
const userCollection = 'user'
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age:Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carts',
  },
  role: {
    type: String,
    default: 'user',
  },
  githubId: Number,
  githubUsername: String,
  gmailId: Number,
  facebookId: Number,
})
const Users = mongoose.model(userCollection, userSchema)

module.exports = Users