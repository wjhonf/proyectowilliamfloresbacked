const { Router } = require('express');
const Users = require('../models/user.model');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'adminCoder@coder.com') {
      const user = await Users.findOne({ email });
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
    res.status(200).json({ success: true, message: 'Autenticación exitosa' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('err');
      console.log(err);
      return res.status(500).json({ error: 'Error destroying session' });
    }
    res.redirect('/login');
  });
});

module.exports = router;
