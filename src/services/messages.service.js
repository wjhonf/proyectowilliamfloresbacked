const MessageDAOMongo = require('../DAO/mongo/message-dao.mongo')
const MessageDAOArray = require('../DAO/arrays/message.dao.arrays')

const Message = new MessageDAOMongo()
const getAll = async () => {
  try {
    const Menssages = await Message.tomaTodo()
    console.log('Obtenemos todos desde el service')
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