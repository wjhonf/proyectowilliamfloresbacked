class MessageDAO {
    messages = []
  
    async tomaTodo() {
      return this.messages
    }
  
    async creamosUno(newMessageInfo) {
      this.messages.push(newMessageInfo)
      return 'Nuevo mensaje creado'
    }
  }
  
  module.exports = MessageDAO