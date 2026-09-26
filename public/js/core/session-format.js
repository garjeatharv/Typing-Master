function formatSessionMode(session) {
  if (session.mode === 'timed') {
    return `${session.timedSeconds}s timed`;
  }
  return 'Word count';
}

function formatSessionDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildSessionTooltip(session) {
  return [
    formatSessionDate(session.createdAt),
    `${session.wpm} WPM · ${session.accuracy}% accuracy`,
    `${formatSessionMode(session)} · ${session.category}`,
    `${session.wordCount} words · ${session.errorCount || 0} errors`,
  ].join('\n');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatSessionMode, formatSessionDate, buildSessionTooltip };
} else {
  window.TM = window.TM || {};
  TM.formatSessionMode = formatSessionMode;
  TM.formatSessionDate = formatSessionDate;
  TM.buildSessionTooltip = buildSessionTooltip;
}
