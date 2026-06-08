const Ticket = require('../models/Ticket');
const Note = require('../models/Note');

const getAnalytics = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    const criticalTickets = await Ticket.countDocuments({ priority: 'Critical' });

    const totalNotes = await Note.countDocuments();
    const averageNotesPerTicket = totalTickets > 0 ? (totalNotes / totalTickets).toFixed(1) : 0;

    const statusDist = await Ticket.aggregate([
      { $group: { _id: '$status', value: { $sum: 1 } } }
    ]);
    const statusDistribution = statusDist.map(d => ({ name: d._id, value: d.value }));

    const priorityDist = await Ticket.aggregate([
      { $group: { _id: '$priority', value: { $sum: 1 } } }
    ]);
    const priorityDistribution = priorityDist.map(d => ({ name: d._id, value: d.value }));

    const agentDist = await Ticket.aggregate([
      { $group: { _id: '$assignedTo', tickets: { $sum: 1 } } }
    ]);
    const agentWorkload = agentDist.map(d => ({ name: d._id, tickets: d.tickets }));

    const trendDist = await Ticket.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          tickets: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);
    const ticketCreationTrend = trendDist.map(d => ({ date: d._id, tickets: d.tickets }));

    res.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      closedTickets,
      criticalTickets,
      averageNotesPerTicket: parseFloat(averageNotesPerTicket),
      statusDistribution,
      priorityDistribution,
      agentWorkload,
      ticketCreationTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics
};
