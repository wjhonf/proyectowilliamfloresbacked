const NewUserDto = require('../DTOs/new-user.dto');
const Users = require('../repository');
const UsersRepository = require('../repository');
const MailAdapter = require('../adapters/mail.adapter') 
const { sms } = require('../configs/app.config')
const client = require('../utils/twilio.util')
const sendMail= new MailAdapter()
const getUsers = async () => {
  return await Users.get();
};

const createUser = async newUser => {
  const newUserInfo = new NewUserDto(newUser); 
  sendMail.sendMessage
  return await Users.create(newUserInfo);
};

const findOne = async query => {
  return await UsersRepository.findOne(query); 
};

module.exports = {
  getUsers,
  createUser,
  findOne,
};
