const { Router } = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const privateAccess = require('../middleware/private-access.middleware')
const publicAccess = require('../middleware/public-acces.middleware')


const router = Router()
router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home');
  } else {
    res.render('login', { layout: false });
  }
});

router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home');
  } else {
    res.render('login', { layout: false });
  }
});

router.get('/signup', (req, res) => {
  res.render('signup', { layout: false });
})
router.get('/profile', authMiddleware, (req, res) => {
  const { user } = req.session
  res.render('profile', { user })
})
router.get('/home', authMiddleware, (req, res) => {
  const { user } = req.session;
  res.render('home', { user }); 
});
router.get('/forgotPassword', (req, res) => {

  res.render('forgot-Password'); 
});
module.exports = router