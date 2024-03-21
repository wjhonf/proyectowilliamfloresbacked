const Message = require('../mongo/models/message.model')

class MessageDAO {
  async tomaTodo() {
    return await Message.find()
  }

  async creamosUno(newMessageInfo) {
    return await Message.create(newMessageInfo)
  }
}

module.exports = MessageDAO