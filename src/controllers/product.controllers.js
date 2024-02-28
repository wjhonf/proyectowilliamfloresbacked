const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Product = require('../models/product.model');
const productsService = require('../services/products.service');
const authMiddleware = require('../middleware/auth.middleware')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const fs = require('fs');
const router = Router();

router.get('/',  passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    const params = { ...req.query };
    const response = await productsService.getAll(params);
    const productsData = response.docs.map(product => ({
      id:product._id,
      title: product.title,
      description: product.description,
      code: product.code,
      thumbnail: product.thumbnail,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
    }));
    res.render('products', {
      products: productsData,
      user: req.user,
      pagination: response,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
  }
});

router.get('/:id', passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);

    if (!product) {
      return res
        .status(HTTP_RESPONSES.NOT_FOUND)
        .json({ status: 'error', error: 'Product not found' });
    }
     
    res.json({ status: 'success', payload: product });
  } catch (error) {
    console.log(error)
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.get('/details/:cartId', passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
      const cartId = req.params.cartId;
      const cartDetails = await cartsService.getCartDetails(cartId);

      if (!cartDetails) {
          return res.status(HTTP_RESPONSES.NOT_FOUND)
                    .json({ status: 'error', message: 'Carrito no encontrado' });
      }

      res.render('cart-details', { cartDetails });
  } catch (error) {
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
         .json({ status: 'error', error: error.message });
  }
});

router.post('/', passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    if (!title || !code || !price || !stock) {
      return res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ status: 'error', error: 'Incomplete or invalid product data' });
    }
    
    const newProductInfo = {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newProduct = await productsService.insertOne(newProductInfo);
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: 'Equipo registrado exitosamente'});
    //res.redirect('/products');
  } catch (error) {
    console.log(error)
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.put('/:id', passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, code, price, stock, category, thumbnail } = req.body;
    if (!title || !code || !price || !stock) {
      return res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ status: 'error', error: 'Incomplete or invalid product data' });
    }
    const updatedProductInfo = {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
      updatedAt: new Date(),
    };

    await Product.updateOne({ _id: id }, updatedProductInfo);

    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', payload: updatedProductInfo });
  } catch (error) {
    console.log(error)
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.delete('/:id', passportCall('jwt'),authorization('user'),  async (req, res) => {
  try {
    const { id } = req.params;
    await productsService.deleteProductById(id);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error)
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
/*
router.post('/', async (req, res) => {
  try {
    const rawData = fs.readFileSync('../proyectowilliamfloresbacked/equipos.json');
    const products = JSON.parse(rawData);

    if (!products || products.length === 0) {
      return res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ status: 'error', error: 'No products provided' });
    }
    for (const product of products) {
      if (!product.title || !product.code || !product.price || !product.stock) {
        return res
          .status(HTTP_RESPONSES.BAD_REQUEST)
          .json({ status: 'error', error: 'Incomplete or invalid product data' });
      }
    }
    const newProducts = await productsService.insertMany(products);
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newProducts });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error: 'Internal server error' });
  }
});
*/
module.exports = router;
