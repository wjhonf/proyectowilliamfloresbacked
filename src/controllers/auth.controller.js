const { Router } = require('express');
const Users = require('../DAO/mongo/models/user.model');
const passport = require('passport')
const { useValidPassword, createHash, resetPassword, generatePasswordResetToken} = require('../utils/crypt-password.util')
const {sendPasswordResetEmail} = require('../utils/emailUtils')
const {generateToken} = require('../utils/jwt.util')
const HTTP_RESPONSES = require('../constants/http-responses.contant')
const CustomError = require('../handlers/errors/Custom-Error')
const generateUserErrorInfo = require('../handlers/errors/generate-user-error-info')
const moment = require('moment-timezone');
const EErrors = require('../handlers/errors/emun-errors')
const TYPES_ERRORS = require('../handlers/errors/types.errors');
const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      CustomError.createError({
        name: TYPES_ERRORS.USER_CREATION_ERROR,
        cause: generateUserErrorInfo({password, email }),
        message: 'Error trying to create User',
        code: EErrors.INVALID_USER_INFO,
      })
    }
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error', error: 'Bad Request' });
    const passwordMatch = useValidPassword(user, password);
    if (!passwordMatch)
      return res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error', error: 'Bad Request' });
    const peruDateTime = moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
    user.last_connection = peruDateTime;
    await user.save();
    const token = generateToken({ id: user._id, first_name: user.first_name,last_name: user.last_name, email: user.email, role: user.role, documents: user.documents, profileImage:user.profileImage});
    res.cookie('authToken', token, {
      maxAge: 300000,
      httpOnly: true,
    }).json({ status: 'Success', payload: 'Logged in' });
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
  }
});
router.get('/logout/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(HTTP_RESPONSES.NOT_FOUND).json({ status: 'error', error: 'User not found' });
    }
    const peruDateTime = moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
    user.last_connection = peruDateTime;
    await user.save();
    res.clearCookie('authToken');
    return res.redirect('/login');
  } catch (error) {
    req.logger.error(error);
    return res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    res.clearCookie('authToken');
    res.status(HTTP_RESPONSES.OK).json({ status: 'Success', message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Token  expirado' });
  }
});
router.post('/send-reset-email', async (req, res) => {
  try {
    const { email } = req.body;
    const token = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, token);
    res.redirect('/login')
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});
router.get(
  '/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] })
);

router.get(
  '/githubcallback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      const user = {
        id: req.user._id, 
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email, 
        role: req.user.role,
      };

      const token = generateToken({ 
        id: user.id, 
        first_name: user.first_name,
        last_name: user.last_name, 
        email: user.email, 
        role: user.role 
      });

      res.cookie('authToken', token, {
        maxAge: 30000,
        httpOnly: true,
      });
      res.render('profile',{user});
    } catch (error) {
      req.logger.error(error);
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
    }
  }
);
module.exports = router;
