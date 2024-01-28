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
router.get('/view', async (req, res) => {
  try {
    let { limit, page, fromDate, toDate } = req.query;
    limit = limit ? parseInt(limit, 10) : 10;
    page = page ? parseInt(page, 10) : 1;
    const response = await cartsService.getAll({ limit, page, fromDate, toDate });
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
        url: `${baseUrl}?page=${i}&limit=${limit}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`,
        isCurrent: i === page,
      });
    }
    const result = {
      status: 'success',
      carts: response.carts,
      totalPages,
      prevPage,
      nextPage,
      page: response.page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null,
      nextLink: hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null,
      pages
    };
    res.render('carts', result);
  } catch (error) {
    console.log(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: error.message });
  }
});
router.get('/details/:cartId', async (req, res) => {
  try {
      const cartId = req.params.cartId;
      const cartDetails = await cartsService.getCartDetails(cartId);

      if (!cartDetails) {
          return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
      res.json({ status: 'success', data: cartDetails });
  } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { userId, nombre, direccion, email, items, totalPrice } = req.body;
    if (!userId || !nombre || !direccion || !email || !items) {
      return res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ status: 'error', error: 'Faltan datos del carrito o del usuario' });
    }
    if (!Array.isArray(items) || !items.every(item => item.productId && typeof item.quantity === 'number')) {
      return res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ status: 'error', error: 'Datos de productos inválidos' });
    }
    const newCartData = { userId, nombre, direccion, email, items, totalPrice};
    const newCart = await cartsService.insertOne(newCartData);
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newCart });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error: error.message });
  }
});
router.delete('/carts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await cartsService.deleteCart(id);
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
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartsService.removeProductFromCart(cid, pid);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Product removed from cart successfully' });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCartData = req.body;
    await cartsService.updateCart(cid, updatedCartData);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Cart updated successfully' });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartsService.updateProductQuantity(cid, pid, quantity);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Product quantity updated successfully' });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
}); 
module.exports = router;
