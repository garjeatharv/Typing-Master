const Session = require('../models/Session');
const { TEST_MODES, TIMED_DURATIONS, SESSION_CATEGORIES } = require('../constants/categories');
const { calculateWpm, calculateAccuracy } = require('../utils/typingMetrics');

function assertValidSessionPayload(payload) {
  const {
    mode,
    category,
    timedSeconds,
    wordCount,
    durationSeconds,
    correctChars,
    totalChars,
    errorCount,
  } = payload;

  if (!mode || !Object.values(TEST_MODES).includes(mode)) {
    const err = new Error('Invalid test mode');
    err.statusCode = 400;
    throw err;
  }

  if (!category || !SESSION_CATEGORIES.includes(category)) {
    const err = new Error('Invalid category');
    err.statusCode = 400;
    throw err;
  }

  if (mode === TEST_MODES.TIMED) {
    if (!TIMED_DURATIONS.includes(Number(timedSeconds))) {
      const err = new Error('Invalid timed duration');
      err.statusCode = 400;
      throw err;
    }
  }

  const numericFields = [
    ['wordCount', wordCount],
    ['durationSeconds', durationSeconds],
    ['correctChars', correctChars],
    ['totalChars', totalChars],
  ];

  for (const [name, value] of numericFields) {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      const err = new Error(`Invalid ${name}`);
      err.statusCode = 400;
      throw err;
    }
  }

  if (Number(correctChars) > Number(totalChars)) {
    const err = new Error('correctChars cannot exceed totalChars');
    err.statusCode = 400;
    throw err;
  }

  const errCount = Number(errorCount);
  if (Number.isNaN(errCount) || errCount < 0) {
    const err = new Error('Invalid errorCount');
    err.statusCode = 400;
    throw err;
  }
}

async function createSession(userId, payload) {
  assertValidSessionPayload(payload);

  const correctChars = Number(payload.correctChars);
  const totalChars = Number(payload.totalChars);
  const durationSeconds = Number(payload.durationSeconds);
  const wordCount = Number(payload.wordCount);

  const wpm = calculateWpm(correctChars, durationSeconds);
  const accuracy = calculateAccuracy(correctChars, totalChars);

  const session = await Session.create({
    user: userId,
    mode: payload.mode,
    category: payload.category,
    timedSeconds: payload.mode === TEST_MODES.TIMED ? Number(payload.timedSeconds) : null,
    wordCount,
    durationSeconds,
    correctChars,
    totalChars,
    errorCount: Number(payload.errorCount) || 0,
    wpm,
    accuracy,
  });

  return session;
}

async function listSessions(userId, { limit = 20, skip = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeSkip = Math.max(Number(skip) || 0, 0);

  const [sessions, total] = await Promise.all([
    Session.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(safeSkip)
      .limit(safeLimit)
      .lean(),
    Session.countDocuments({ user: userId }),
  ]);

  return { sessions, total, limit: safeLimit, skip: safeSkip };
}

async function getUserStats(userId) {
  const [aggregate] = await Session.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        bestWpm: { $max: '$wpm' },
        avgWpm: { $avg: '$wpm' },
        avgAccuracy: { $avg: '$accuracy' },
        lastSessionAt: { $max: '$createdAt' },
      },
    },
  ]);

  const recent = await Session.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    totalSessions: aggregate?.totalSessions || 0,
    bestWpm: Math.round(aggregate?.bestWpm || 0),
    avgWpm: Math.round(aggregate?.avgWpm || 0),
    avgAccuracy: Math.round(aggregate?.avgAccuracy || 0),
    lastSessionAt: aggregate?.lastSessionAt || null,
    recent,
  };
}

module.exports = { createSession, listSessions, getUserStats };
