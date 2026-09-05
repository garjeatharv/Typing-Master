const Word = require('../models/Word');

// @desc    Get random words filtered by category and limit
// @route   GET /api/words
// @access  Private (Authenticated users only)
exports.getRandomWords = async (req, res) => {
  const { category, count } = req.query;

  try {
    const limit = parseInt(count, 10) || 25;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    // Use MongoDB aggregation framework to retrieve random records
    const words = await Word.aggregate([
      { $match: filter },
      { $sample: { size: limit } }
    ]);

    // Return the array of words
    return res.json({
      success: true,
      count: words.length,
      data: words.map(w => w.word)
    });

  } catch (error) {
    console.error('Fetch words error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve words' });
  }
};
