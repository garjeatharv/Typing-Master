const mongoose = require('mongoose');
const { TEST_MODES } = require('../constants/categories');

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: Object.values(TEST_MODES),
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    timedSeconds: {
      type: Number,
      default: null,
    },
    wordCount: {
      type: Number,
      required: true,
      min: 0,
    },
    durationSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    correctChars: {
      type: Number,
      required: true,
      min: 0,
    },
    totalChars: {
      type: Number,
      required: true,
      min: 0,
    },
    errorCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    wpm: {
      type: Number,
      required: true,
      min: 0,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ user: 1, createdAt: -1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
