const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  getRecentActivity,
} = require('../controllers/ticketController');

router.get('/activity', getRecentActivity);
router.get('/', getAllTickets);
router.post('/', createTicket);
router.get('/:ticketId', getTicketById);
router.put('/:ticketId', updateTicket);

module.exports = router;
