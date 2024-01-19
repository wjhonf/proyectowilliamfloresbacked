const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Cart = require('../models/carts.model');
const cartsService = require('../services/carts.service');

const router = Router();
router.get('/', async (req, res) => {
  try {
    const carts = await cartsService.getAll();
    res.json({ status: 'success', payload: carts });
  } catch (error) {
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
