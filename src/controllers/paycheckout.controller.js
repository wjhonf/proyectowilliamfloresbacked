const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Cart = require('../DAO/mongo/models/carts.model');
const productsService = require('../services/products.service');
const authMiddleware = require('../middleware/auth.middleware');
const cartsService = require('../services/carts.service');
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const { isAdmin, isUser } = require('../middleware/authorizacion.acces');
const router = Router();

router.get('/', passportCall('jwt'),authorization('user'),isUser, async (req, res) => {
    const { user } =req;
    res.render('paycheckout', {user});
});
module.exports = router;
