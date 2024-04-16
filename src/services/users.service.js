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
const comabiarrol = async userId => {
  try {
    const user = await UsersRepository.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.role = 'premium';
    await user.save();
  } catch (error) {
    throw new Error(`Failed to change user role to premium: ${error.message}`);
  }
};
module.exports = {
  getUsers,
  createUser,
  findOne,
  comabiarrol,
};
