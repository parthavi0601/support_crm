const Ticket = require('../models/Ticket');
const Note = require('../models/Note');
const Activity = require('../models/Activity');

const generateTicketId = async () => {
  const lastTicket = await Ticket.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!lastTicket || !lastTicket.ticketId) return 'TKT-001';
  const lastNum = parseInt(lastTicket.ticketId.split('-')[1], 10);
  const nextNum = lastNum + 1;
  return `TKT-${String(nextNum).padStart(3, '0')}`;
};

const createTicket = async (req, res) => {
  try {
    const { customerName, customerEmail, subject, description, priority, assignedTo } = req.body;

    if (!customerName || !customerEmail || !subject || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const ticketId = await generateTicketId();

    const ticket = await Ticket.create({
      ticketId,
      customerName,
      customerEmail,
      subject,
      description,
      priority: priority || 'Medium',
      assignedTo: assignedTo || 'Unassigned',
    });

    await Activity.create({
      ticketId,
      actionType: 'TICKET_CREATED',
      description: 'Ticket created',
    });

    res.status(201).json({
      ticketId: ticket.ticketId,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const { search, status, priority, assignedTo, page = 1, limit = 10, sort = 'latest' } = req.query;

    const query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (assignedTo && assignedTo !== 'All Agents') query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let tickets;

    if (sort === 'priority') {
      tickets = await Ticket.aggregate([
        { $match: query },
        {
          $addFields: {
            priorityWeight: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'Critical'] }, then: 4 },
                  { case: { $eq: ['$priority', 'High'] }, then: 3 },
                  { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'Low'] }, then: 1 }
                ],
                default: 0
              }
            }
          }
        },
        { $sort: { priorityWeight: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);
    } else {
      const sortOrder = sort === 'oldest' ? 1 : -1;
      tickets = await Ticket.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const total = await Ticket.countDocuments(query);

    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = { Open: 0, 'In Progress': 0, Closed: 0 };
    let totalCount = 0;
    stats.forEach((s) => {
      statsMap[s._id] = s.count;
      totalCount += s.count;
    });

    res.json({
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      stats: { ...statsMap, Total: totalCount },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const notes = await Note.find({ ticketId: req.params.ticketId }).sort({ createdAt: 1 });
    const activities = await Activity.find({ ticketId: req.params.ticketId }).sort({ createdAt: -1 });

    res.json({ ...ticket.toObject(), notes, activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { status, priority, assignedTo, note } = req.body;
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (status && status !== ticket.status) {
      await Activity.create({
        ticketId,
        actionType: 'STATUS_CHANGED',
        description: `Status changed from ${ticket.status} to ${status}`,
      });
      ticket.status = status;
    }

    if (priority && priority !== ticket.priority) {
      await Activity.create({
        ticketId,
        actionType: 'PRIORITY_CHANGED',
        description: `Priority changed from ${ticket.priority} to ${priority}`,
      });
      ticket.priority = priority;
    }

    if (assignedTo && assignedTo !== ticket.assignedTo) {
      await Activity.create({
        ticketId,
        actionType: 'ASSIGNMENT_CHANGED',
        description: `Assigned from ${ticket.assignedTo} to ${assignedTo}`,
      });
      ticket.assignedTo = assignedTo;
    }

    await ticket.save();

    if (note && note.trim()) {
      await Note.create({ ticketId, noteText: note.trim() });
      await Activity.create({
        ticketId,
        actionType: 'NOTE_ADDED',
        description: 'Note added to ticket',
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const recentActivities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(recentActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  getRecentActivity,
};
