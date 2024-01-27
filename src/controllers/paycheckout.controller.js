const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Cart = require('../models/carts.model');
const productsService = require('../services/products.service');
const cartsService = require('../services/carts.service');
const router = Router();

router.get('/', async (req, res) => {
    res.render('paycheckout');
});
module.exports = router;
