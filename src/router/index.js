const productsController = require('../controllers/product.controller');
const router = (app, io) => {
  app.use('/', productsController.setup(io));
};

module.exports = router;
