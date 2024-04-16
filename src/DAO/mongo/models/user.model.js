const mongoose = require('mongoose')
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
    enum: ['user', 'admin', 'premium'], 
    default: 'user' 
  },
  githubId: Number,
  githubUsername: String,
  gmailId: Number,
  facebookId: Number,
  resetPasswordToken: String, 
  resetPasswordExpires: Date,
})
const Users = mongoose.model(userCollection, userSchema)

module.exports = Users