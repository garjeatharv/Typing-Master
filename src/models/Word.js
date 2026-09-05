const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Coding', 'Animals', 'Things', 'Places'],
    index: true
  },
  length: {
    type: Number,
    required: true,
    index: true
  }
});

// Auto-populate length on save
wordSchema.pre('save', function(next) {
  this.length = this.word.length;
  next();
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
