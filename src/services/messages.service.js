const MessageDAOMongo = require('../DAO/mongo/message-dao.mongo')
const MessageDAOArray = require('../DAO/memory/user-memory.dao')

const Message = new MessageDAOMongo()
const getAll = async () => {
  try {
    const Menssages = await Message.tomaTodo()
    return Menssages
  } catch (error) {
    throw error
  }
}

const insertOne = async newMenssagetInfo => {
  try {
    const newMessage = await Message.creamosUno(newMenssagetInfo)

    return newMessage
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAll,
  insertOne,
}