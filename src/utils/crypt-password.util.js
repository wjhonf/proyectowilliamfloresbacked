const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Users = require('../DAO/mongo/models/user.model');

const createHash = password => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const useValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
}

const generatePasswordResetToken = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');
  const token = crypto.randomBytes(32).toString('hex');
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + 5); 
  user.resetPasswordToken = token;
  user.resetPasswordExpires = currentTime;
  await user.save();
  return token;
};
const resetPassword = async (token, newPassword) => {
  const currentTime = new Date();
  const expirationTime = new Date(currentTime.getTime() - (5 * 60000)); 
  const user = await Users.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: expirationTime } 
  });
  if (!user) {
    throw new Error('Token inválido o expirado');
  }
  try {
    const passwordEncrypted = createHash(newPassword);
    await Users.updateOne(
      { _id: user._id }, 
      { 
          password: passwordEncrypted,
          resetPasswordToken: null, 
          resetPasswordExpires: null 
      }
  );
    return true; 
  } catch (error) {
    throw new Error('Error al restablecer la contraseña');
  }
};

module.exports = {
  createHash,
  useValidPassword,
  generatePasswordResetToken,
  resetPassword,
};

/*const bcrypt = require('bcrypt');

const createHash = password => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const useValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
}

module.exports = {
  createHash,
  useValidPassword,
}*/

