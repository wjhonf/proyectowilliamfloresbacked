const NewUserDto = require('../DTOs/new-user.dto');
const Users = require('../repository');
const UsersRepository = require('../repository');
const MailAdapter = require('../adapters/mail.adapter') 
const { sms } = require('../configs/app.config')
const client = require('../utils/twilio.util')
const sendMail= new MailAdapter()
const getUsers = async () => {
  console.log('Obteniendo usuarios desde el service');
  return await Users.get();
};

const createUser = async newUser => {
  console.log('Creando usuario desde el service');
  const newUserInfo = new NewUserDto(newUser); 
  sendMail.sendMessage
  return await Users.create(newUserInfo);
};

const findOne = async query => {
  console.log('Buscando usuario desde el service');
  return await UsersRepository.findOne(query); 
};

module.exports = {
  getUsers,
  createUser,
  findOne,
};
