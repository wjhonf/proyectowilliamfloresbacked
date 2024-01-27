const productsController = require('../controllers/product.controller');
const productscontrollers = require('../controllers/product.controllers');
const userscontroller = require('../controllers/users.controller');
const cartcontroller = require('../controllers/carts.controller');
const messagecontroller = require('../controllers/message.controller');
const paycheckoutcontroller = require('../controllers/paycheckout.controller');
const router = (app, io) => {
  app.use('/', productsController.setup(io));
  app.use('/users', userscontroller);
  app.use('/products', productscontrollers);
  app.use('/messages', messagecontroller);
  app.use('/productcatalog', cartcontroller);
  app.use('/paycheckout', paycheckoutcontroller);
};

module.exports = router;
