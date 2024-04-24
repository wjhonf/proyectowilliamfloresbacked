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
    const users = await usersService.getUsers();
    const formattedUsers = users.map(user => {
      return {
        _id: user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      };
    });
    res.render('list-users', { users: formattedUsers, user: req.user, });
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
  }
});
router.put('/premium/:uid', async (req, res) => {
  try {
    const userId = req.params.uid;
    await usersService.comabiarrol(userId);
    res.status(HTTP_RESPONSES.OK).json({ status: 'success', message: 'Rol de usuario cambiado a premium correctamente' });
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
  }
});
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
      }).json({ status: 'success', payload: 'Logged in' });
    } catch (error) {
      req.logger.error(error);
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
    }
  }
);
router.get('/fail-register', (req, res) => {
  req.logger.error(error);
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




module.exports = router