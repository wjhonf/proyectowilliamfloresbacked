const authControlller  = require('../controllers/auth.controller')
const viewsTemplateController = require('../controllers/views-template.controller')
const productscontrollers = require('../controllers/product.controllers');
const userscontroller = require('../controllers/users.controller');
const cartcontroller = require('../controllers/carts.controller');
const messagecontroller = require('../controllers/message.controller');
const paycheckoutcontroller = require('../controllers/paycheckout.controller');
const ticketController = require('../controllers/ticket.controller');
const mockingProductsController=require('../controllers/mockingProductsController');
const logertestcontroller=require('../controllers/loger-test.controller');
const router = (app, io) => {
  app.use('/', viewsTemplateController);
  app.use('/users', userscontroller);
  app.use('/', authControlller);
  app.use('/auth', authControlller);
  app.use('/auth/auth', authControlller);
  app.use('/listcarts/auth', authControlller)
  app.use('/products/auth', authControlller)
  app.use('/products', productscontrollers);
  app.use('/messages', messagecontroller);
  app.use('/productcatalog', cartcontroller);
  app.use('/paycheckout', paycheckoutcontroller);
  app.use('/listcarts', cartcontroller);
  app.use('/purchase', cartcontroller);
  app.get('/consultastock/:pid', cartcontroller);
  app.get('/ticket/:ticketId', ticketController);
  app.use('/ticket/auth', authControlller)
  app.use('/mockingproducts', mockingProductsController)
  app.use('/', logertestcontroller)
 
};

module.exports = router;
