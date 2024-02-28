const { Router } = require('express');
const Users = require('../models/user.model');
const passport = require('passport')
const { useValidPassword, createHash } = require('../utils/crypt-password.util')
const {generateToken} = require('../utils/jwt.util')
const HTTP_RESPONSES = require('../constants/http-responses.contant')
const router = Router();

router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error', error: 'Bad Request' });
  
    const user = await Users.findOne({ email });
    console.log(user)
    if (!user)
      return res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error', error: 'Bad Request' });
    const passwordMatch = useValidPassword(user, password);
    if (!passwordMatch)
      return res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error', error: 'Bad Request' });

    const token = generateToken({ id: user._id, first_name: user.first_name,last_name: user.last_name, email: user.email, role: user.role });

    res.cookie('authToken', token, {
      maxAge: 30000,
      httpOnly: true,
    }).json({ status: 'Success', payload: 'Logged in' });
  } catch (error) {
    console.log(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
  }
});
router.get('/logout', (req, res) => {
  res.clearCookie('authToken'); 
  res.redirect('/login'); 
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body
    const passwordEncrypted = createHash(password)

    await Users.updateOne({ email }, { password: passwordEncrypted })

    res.status(HTTP_RESPONSES.OK).json({ status: 'Success', message: 'Contraseña Actualizada' })
  } catch (error) {
    console.log(error)
    res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' })
  }
})

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
      console.log(error);
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' });
    }
  }
);




/*const users = [
  {
    id: 1,
    name: 'Mate',
    email: 'jhonwiww@gmail.com',
    password: '12345',
    role: 'user',
  },
]

/*router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ status: 'error', error: 'Bad Request' })

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ status: 'error', error: 'Bad Request' })

    if (user.password !== password)
      return res.status(400).json({ status: 'error', error: 'Bad Request' })

    const token = generateToken({ id: user.id, role: user.role })

    res
      .cookie('authToken', token, {
        maxAge: 30000,
        httpOnly: true,
      })
      .json({ status: 'Success', payload: 'Logged in' })

    //res.json({ status: 'success', payload: token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', error: 'Internal Server Error' })
  }
})
router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/auth/fail-login' }),
  async (req, res) => {
    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
      }
      res.json({ status: 'Success', message: 'Logged' });
    } catch (error) {
      console.log(error)
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal Server Error' })
    }
  }
)
router.get('/fail-login', (req, res) => {
  res.json({ status: 'error', error: 'Login failed' })
})


/*router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body
    if(!email || !password)
      return res.status(400).json({status: 'error', error:'Bad request'})
    const user = await Users.findOne({ email });
    if(!user) return res.status(401).json({status: 'Unauthorized'})
    if(!useValidPassword(user, password))
      return res.status(401).json({status: 'Unautthorized'})
    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    const { email, password } = req.body;
    if (email === 'adminCoder@coder.com') {
      const user = await Users.findOne({ email });
      if(!useValidPassword(user, password))
       return res.status(401).json({status: 'Bad request'})
      req.session.user = {
        id: user._id,
        first_name:'Admin',
        last_name:'Admin',
        email: 'adminCoder@coder.com',
        role: 'admin'
      };
      if (!user) {
        return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
      }
      if (user.password !== password) {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
      }
    } else {
            const user = await Users.findOne({ email });
            if (!user) {
              return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
            }
        
            if (user.password !== password) {
              return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
            }
            req.session.user = {
              id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role,
            };
    }
    res.status(200).json({ status: 'Success', message: 'Logged' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});*/
/*router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status: 'error', error: 'Solicitud incorrecta' });

    const user = await Users.findOne({ email });
    if (!user) 
      return res.status(401).json({ status: 'error', error: 'Usuario no autorizado' });

    if (!useValidPassword(user, password))
      return res.status(401).json({ status: 'error', error: 'Usuario no autorizado' });

    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ status: 'Success', message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});
*/

module.exports = router;
