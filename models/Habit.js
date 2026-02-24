const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    streak: { type: Number, default: 0, min: 0 },
    lastCompletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);