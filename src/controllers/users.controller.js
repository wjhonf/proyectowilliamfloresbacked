const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.contant')
const User = require('../DAO/mongo/models/user.model')
const usersService = require('../services/users.service')
const userCurrent = require('../services/user.service.current');
const { createHash } = require('../utils/crypt-password.util');
const { generateToken } = require('../utils/jwt.util');
const passport = require('passport')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const { email } = require('../configs/app.config')
const transport = require('../utils/nademailer.util')
const router = Router()
router.get('/', passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    const users = await usersService.getUsers()
    res.json({ status: 'success', payload: users })
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error })
  }
})
router.get('/:id', async (req, res) => {
  try {
    res.json({ status: 'success', payload: user })
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error })
  }
})
router.post(
  '/',
  passport.authenticate('register', {
    session: false, 
    failureRedirect: '/users/fail-register',
  }),
  async (req, res) => {
    try {
      const user= req.user
      const token = generateToken({ id: user._id, first_name: user.first_name,last_name: user.last_name, email: user.email, role: user.role });
    
      res.cookie('authToken', token, {
        maxAge: 30000,
        httpOnly: true,
      }).json({ status: 'Success', payload: 'Logged in' });
    } catch (error) {
      console.log(error);
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
    }
  }
);
router.get('/fail-register', (req, res) => {
  console.log('Falló registro')
  res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error', error: 'Bad request' })
})
router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params

    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password)
      res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ status: error, error: HTTP_RESPONSES.BAD_REQUEST_CONTENT })

    const userInfo = {
      firstName,
      lastName,
      email,
      password,
      updatedAt: new Date(),
    }

    await User.updateOne({ _id: uid }, userInfo)

    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newUser })
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error })
  }
})
router.delete('/:uid', async (req, res) => {
  try {
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newUser })
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error })
  }
})
router.get('/current', async (req, res) => {
  try {
    const userId = req.userId; 
    const currentUser = await userCurrent.getCurrentUser(userId);
    const userDTO = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email
    };

    res.json(userDTO);
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
  }
});
/*router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body

    const newUserInfo = {
      first_name,
      last_name,
      email,
      password: createHash(password),
    }
    const newUser = await usersService.insertOne(newUserInfo)

    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newUser })
  } catch (error) {
    console.log(error)
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error })
  }
})*/



module.exports = router