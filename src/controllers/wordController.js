const Word = require('../models/Word');
const {
  SESSION_CATEGORIES,
  RANDOM_CATEGORY,
} = require('../constants/categories');
const asyncHandler = require('../middleware/asyncHandler');
const { sendError, sendSuccess } = require('../utils/httpResponse');

const MAX_WORD_COUNT = 200;

exports.getRandomWords = asyncHandler(async (req, res) => {
  const { category, count } = req.query;

  if (category && !SESSION_CATEGORIES.includes(category)) {
    return sendError(res, 400, 'Invalid category');
  }

  const requested = parseInt(count, 10) || 25;
  const limit = Math.min(Math.max(requested, 3), MAX_WORD_COUNT);
  const filter = {};

  if (category && category !== RANDOM_CATEGORY) {
    filter.category = category;
  }

  const words = await Word.aggregate([
    { $match: filter },
    { $sample: { size: limit } },
  ]);

  return sendSuccess(res, 200, {
    count: words.length,
    data: words.map((w) => w.word),
  });
});
