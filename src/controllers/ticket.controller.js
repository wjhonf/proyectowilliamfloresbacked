const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const authMiddleware = require('../middleware/auth.middleware')
const ticketService = require('../services/ticket.service');
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middleware/authorization.middleware')
const { v4: uuidv4 } = require('uuid');
const router = Router();


router.get('/ticket/:ticketId',passportCall('jwt'),authorization('user'), async (req, res) => {
    try {
      const user= req.user
      const { ticketId } = req.params;
      const ticket = await ticketService.getTicketById(ticketId);
      console.log(ticket)
      if (!ticket) {
        return res.status(HTTP_RESPONSES.NOT_FOUND).json({ status: 'error', error: 'Ticket no encontrado' });
      }
      const ticketObj = ticket.toObject();

      res.render('view-ticket', { ticket: ticketObj, user });
    } catch (error) {
      console.error('Error al obtener el ticket:', error);
      res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error: error.message });
    }
  });

  module.exports = router;

  