const productsController = require('../controllers/product.controller');

const router = (app, io) => {
  app.use('/', productsController(io));
};

module.exports = router;
