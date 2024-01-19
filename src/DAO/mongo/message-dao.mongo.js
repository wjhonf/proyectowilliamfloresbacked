const Message = require('../../models/message.model')

class MessageDAO {
  async tomaTodo() {
    return await Message.find()
  }

  async creamosUno(newMessageInfo) {
    console.log('Creado desde el DAO')
    return await Message.create(newMessageInfo)
  }
}

module.exports = MessageDAO