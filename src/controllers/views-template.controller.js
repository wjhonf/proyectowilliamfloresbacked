const { Router } = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const {authToken}= require('../utils/jwt.util')
const passport = require('passport')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const router = Router()
router.get('/login', (req, res) => {
  if (req.user) {
    const user= req.user
    res.redirect('/home',{user});
  } else {
    res.render('login', { layout: false });
  }
});

router.get('/',  passportCall('jwt'),authorization('user'), (req, res) => {
  if (req.user) {
    const user= req.user
    res.render('home',{user});
  } else {
    res.render('login', { layout: false });
  }
});

router.get('/home', passportCall('jwt'),authorization('user'), (req, res) => {
  if (req.user) {
    const user= req.user
    res.render('home', {user});
  } else {
    const user= req.user
    res.render('home', {user} );
  }
});

router.get('/signup', (req, res) => {
  res.render('signup', { layout: false });
})

router.get('/profile', passportCall('jwt'), authorization('user'), (req, res) => {
  const user= req.user
  console.log(user)
  res.render('profile', { user })
})
router.get('/forgotPassword', (req, res) => {

  res.render('forgot-Password'); 
})
module.exports = router