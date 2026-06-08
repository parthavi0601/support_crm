const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: [
        'TICKET_CREATED',
        'STATUS_CHANGED',
        'PRIORITY_CHANGED',
        'NOTE_ADDED',
        'ASSIGNMENT_CHANGED',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
