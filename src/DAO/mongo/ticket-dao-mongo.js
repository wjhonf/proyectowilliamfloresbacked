
const Ticket = require('../mongo/models/tickets.model');
class TicketDAO {
  async saveTicket(ticketData) {
    try {
      const newTicket = await Ticket.create(ticketData);
      return newTicket;
    } catch (error) {
      throw error;
    }
  }
  async getTicketByCode(ticketCode) {
    try {
      const ticket = await Ticket.findOne({ code: ticketCode });
      return ticket;
    } catch (error) {
      throw error;
    }
  }
  async findById(ticketId) {
    try {
      return await Ticket.findById(ticketId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TicketDAO;
