const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/httpResponse');
const {
  createSession,
  listSessions,
  getUserStats,
} = require('../services/sessionService');

exports.createTypingSession = asyncHandler(async (req, res) => {
  const session = await createSession(req.user._id, req.body);
  return sendSuccess(res, 201, {
    message: 'Session saved',
    data: session,
  });
});

exports.getTypingSessions = asyncHandler(async (req, res) => {
  const result = await listSessions(req.user._id, {
    limit: req.query.limit,
    skip: req.query.skip,
  });
  return sendSuccess(res, 200, { data: result });
});

exports.getTypingStats = asyncHandler(async (req, res) => {
  const stats = await getUserStats(req.user._id);
  return sendSuccess(res, 200, { data: stats });
});
