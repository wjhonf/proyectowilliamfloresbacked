const mongoose = require('mongoose');

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
  user: {  
    type: String,
    required: true
  },
  message: {  
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model(messageCollection, messageSchema);

module.exports = Message;
