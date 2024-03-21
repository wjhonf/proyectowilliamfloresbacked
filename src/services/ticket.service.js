const TicketDAO = require('../DAO/mongo/ticket-dao-mongo');
const ticketDAO = new TicketDAO();
async function generateTicket(ticketData) {
  try {
    const newTicket = await ticketDAO.saveTicket(ticketData);
    return newTicket;
  } catch (error) {
    throw error;
  }
}
async function getTicketById(ticketId) {
  try {
    return await ticketDAO.getTicketByCode(ticketId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateTicket,
  getTicketById,
}
