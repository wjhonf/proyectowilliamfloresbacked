const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Product = require('../models/product.model');
const productsService = require('../services/products.service');

const router = Router();
router.get('/', async (req, res) => {
  try {
    const products = await productsService.getAll();
    res.json({ status: 'success', payload: products });
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
    const product = await productsService.getById(id);

    if (!product) {
      return res
        .status(HTTP_RESPONSES.NOT_FOUND)
        .json({ status: 'error', error: 'Product not found' });
    }

    res.json({ status: 'success', payload: product });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.post('/', async (req, res) => {
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
      .json({ status: 'success', payload: newProduct });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.put('/:id', async (req, res) => {
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
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await productsService.deleteOne(id);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

module.exports = router;
