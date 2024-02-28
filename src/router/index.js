const authControlller  = require('../controllers/auth.controller')
const viewsTemplateController = require('../controllers/views-template.controller')
const productsController = require('../controllers/product.controller');
const productscontrollers = require('../controllers/product.controllers');
const userscontroller = require('../controllers/users.controller');
const cartcontroller = require('../controllers/carts.controller');
const messagecontroller = require('../controllers/message.controller');
const paycheckoutcontroller = require('../controllers/paycheckout.controller');
const router = (app, io) => {
  app.use('/', viewsTemplateController);
  app.use('/users', userscontroller);
  app.use('/auth', authControlller);
  app.use('/auth/auth', authControlller);
  app.use('/listcarts/auth', authControlller)
  app.use('/products', productscontrollers);
  app.use('/messages', messagecontroller);
  app.use('/productcatalog', cartcontroller);
  app.use('/paycheckout', paycheckoutcontroller);
  app.use('/listcarts', cartcontroller);
};

module.exports = router;
