const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Cart = require('../models/carts.model');
const productsService = require('../services/products.service');
const cartsService = require('../services/carts.service');
const router = Router();

router.get('/', async (req, res) => {
  try {
      let { limit, page, sort, category, status , search } = req.query;
      if (status === undefined) {
        status = 'true';
      }
      const response = await productsService.getAll({ limit, page, sort, category, status,search  });
      const totalPages = Math.ceil(response.total / response.limit);
      const hasPrevPage = response.page > 1;
      const hasNextPage = response.page < totalPages;
      const prevPage = hasPrevPage ? response.page - 1 : null;
      const nextPage = hasNextPage ? response.page + 1 : null;
      const baseUrl = req.baseUrl + req.path;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          url: `${baseUrl}?page=${i}`,
          isCurrent: i === parseInt(page, 10),
        });
      }
      const result = {
        status: 'success',
        payload: response.products,
        totalPages,
        prevPage,
        nextPage,
        page: response.page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `${baseUrl}?page=${prevPage}` : null,
        nextLink: hasNextPage ? `${baseUrl}?page=${nextPage}` : null,
        products: response.products,
        pages
      };
      res.render('productcatalog', result);
      } catch (error) {
        console.log(error);
        res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
      }
}

);
/*
router.get('/', async (req, res) => {
  try {
    const carts = await cartsService.getAll();
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});*/
router.get('/:id', async (req, res) => {
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartsService.getOneById(id);
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCartData = req.body;
    const newCart = await cartsService.insertOne(newCartData);
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newCart });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

router.put('/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    const updateData = req.body;
    
    await Cart.updateOne({ _id: cartId }, updateData);

    const updatedCart = await cartsService.getOneById(cartId);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

router.delete('/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    await cartsService.deleteOne(cartId);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Cart deleted successfully' });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});


module.exports = router;
