/**
 * Standard typing metrics (5 characters = 1 word).
 * Shared by API validation and client-side display for consistency.
 */
function calculateWpm(correctChars, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  return Math.round(((correctChars / 5) / durationSeconds) * 60);
}

function calculateAccuracy(correctChars, totalChars) {
  if (!totalChars || totalChars <= 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

module.exports = { calculateWpm, calculateAccuracy };
