const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  evidence: {
    type: String
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  wordCount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Script', scriptSchema);
