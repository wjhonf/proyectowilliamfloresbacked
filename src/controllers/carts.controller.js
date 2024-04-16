const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Cart = require('../DAO/mongo/models/carts.model');
const productsService = require('../services/products.service');
const authMiddleware = require('../middleware/auth.middleware')
const cartsService = require('../services/carts.service');
const ticketService = require('../services/ticket.service');
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const { generateTicketCode } = require('../utils/ticketUtils');
const { isAdmin, isUser } = require('../middleware/authorizacion.acces');
const router = Router();

router.get('/', passportCall('jwt'),authorization('user'),isUser, async (req, res) => {
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
    res.render('productcatalog', {
      products: productsData,
      user: req.user,
      pagination: response,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
  }
});
router.get('/view', passportCall('jwt'),authorization('user'), isAdmin, async (req, res) => {
  try {
    const params = { ...req.query };
    const response = await cartsService.getAll(params);
    const cartsData = response.docs.map(cart => ({
      id: cart._id,
      userId: cart.userId,
      nombre: cart.nombre,
      direccion: cart.direccion,
      email: cart.email,
      items: cart.items, 
      totalPrice: cart.totalPrice,
    }));
    res.render('carts', {
      carts: cartsData,
      user: req.user,
      pagination: response,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error });
  }
});
router.get('/details/:cartId',passportCall('jwt'),authorization('user'), async (req, res) => {
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
router.post('/',passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    req.logger.info(req.body)
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
    const message = await cartsService.processPurchase(newCart._id, items);
    const ticketCode = generateTicketCode();
    const ticketnew = { code: ticketCode, amount: totalPrice, purchaser: email };
    const ticket = await ticketService.generateTicket(ticketnew);
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: newCart, message, ticketCode: ticketnew.code});
  } catch (error) {
    req.logger.error(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error: error.message });
  }
});
router.delete('/carts/:id',passportCall('jwt'),authorization('user'), async (req, res) => {
  try {
    const { id } = req.params;
    await cartsService.deleteCart(id);
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    req.logger.error(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.get('/:id',passportCall('jwt'),authorization('user'), async (req, res) => {
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
    req.logger.error(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.delete('/:cid/products/:pid', passportCall('jwt'),authorization('user'), async (req, res) => {
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
router.put('/:cid',passportCall('jwt'),authorization('user'), async (req, res) => {
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
router.put('/:cid/products/:pid', passportCall('jwt'),authorization('user'), async (req, res) => {
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
router.post('/:cid/purchase', passportCall('jwt'), authorization('user'), async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { failedProducts, ticket } = await cartsService.processPurchase(cartId);
    if (failedProducts.length > 0) {
      await cartsService.updateCartAfterPurchase(cartId, failedProducts);
      res.status(HTTP_RESPONSES.OK).json({ status: 'success', message: 'Compra completada con productos no procesados', failedProducts, ticket });
    } else {
      const newTicket = await ticketService.generateTicket(ticket);
      res.status(HTTP_RESPONSES.OK).json({ status: 'success', message: 'Compra completada exitosamente', ticket: newTicket });
    }
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: error.message });
  }
});
router.get('/consultastock/:pid', passportCall('jwt'), authorization('user'), async (req, res) => {
  try {
    const { pid } = req.params; 
    const { quantity } = req.query;
    const result = await cartsService.checkProductStockInCart(pid, quantity);
    if (result.success) {
      res.status(HTTP_RESPONSES.OK).json({ status: 'success', productInCart: result.productInCart });
    } else {
      res.status(HTTP_RESPONSES.BAD_REQUEST).json({ status: 'error',  productInCart: result.productInCart });
    }
  } catch (error) {
    req.logger.error(error);
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
