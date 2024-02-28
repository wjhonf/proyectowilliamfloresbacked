const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Cart = require('../models/carts.model');
const productsService = require('../services/products.service');
const authMiddleware = require('../middleware/auth.middleware');
const cartsService = require('../services/carts.service');
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const router = Router();

router.get('/',passportCall('jwt'),authorization('user'), async (req, res) => {
    const { user } = req.session;
    res.render('paycheckout', {user});
});
module.exports = router;
