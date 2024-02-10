const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.contant')
const User = require('../models/user.model')
const usersService = require('../services/users.service')
const { createHash } = require('../utils/crypt-password.util');
const passport = require('passport')
const router = Router()
router.get('/', async (req, res) => {
  try {
    const users = await usersService.getAll()
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
    failureRedirect: '/users/fail-register',
  }),
  async (req, res) => {
    try {
      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', message: 'User has been register' })
    } catch (error) {
      console.log(error)
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' })
    }
  }
)

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