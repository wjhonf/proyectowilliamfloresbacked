class MessageDAO {
    messages = []
  
    async tomaTodo() {
      console.log('Mensajes desde el array')
      return this.messages
    }
  
    async creamosUno(newMessageInfo) {
      console.log('Creado desde el DAO')
      this.messages.push(newMessageInfo)
      return 'Nuevo mensaje creado'
    }
  }
  
  module.exports = MessageDAO