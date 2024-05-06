const UserDao = require('../DTOs/new-user.dto');
const UserDA = require('../DAO/mongo/user-dao.mongo');
const Users = require('../repository');
const UsersRepository = require('../repository');
const MailAdapter = require('../adapters/mail.adapter') 
const { sms } = require('../configs/app.config')
const client = require('../utils/twilio.util');
const usersRepository = require('../repository');
const sendMail= new MailAdapter()
const getUsers = async () => {
  return await Users.get();
};

const createUser = async newUser => {
  const newUserInfo = new UserDao(newUser); 
  sendMail.sendMessage
  return await Users.create(newUserInfo);
};

const findOne = async query => {
  return await UsersRepository.findOne(query); 
};
const updateUserProfile = async (userId, profileData) => {
  try {
    const user = await usersRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (profileData.profileImage) {
      const profileImagePath = 'profiles/' + profileData.profileImage;
      user.profileImage = profileImagePath;
    }
    if (profileData.documents) {
      const documentObjects = profileData.documents.map(fileName => {
        return { name: fileName, reference: 'documents/' + fileName };
      });
      user.documents = documentObjects;
      user.role = 'premium';
    }
    await  user.save();
    return { status: 'success', message: 'Perfil de usuario actualizado exitosamente' };
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
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
  updateUserProfile,
};
