const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
    },
    noteText: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
