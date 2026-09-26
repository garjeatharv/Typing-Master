window.TM = window.TM || {};

TM.calculateWpm = function calculateWpm(correctChars, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  return Math.round(((correctChars / 5) / durationSeconds) * 60);
};

TM.calculateAccuracy = function calculateAccuracy(correctChars, totalChars) {
  if (!totalChars || totalChars <= 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

TM.formatDuration = function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
