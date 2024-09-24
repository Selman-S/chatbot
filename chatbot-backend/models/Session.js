const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  qa: [
    {
      question: String,
      answer: String,
    },
  ],
});

module.exports = mongoose.model('Session', SessionSchema);
