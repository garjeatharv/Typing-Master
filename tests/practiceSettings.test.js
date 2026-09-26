const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Mirror client helpers (keep in sync with public/js/components/practice-settings.js)
function parseTestMode(value) {
  if (value === 'timed30') return { mode: 'timed', timedSeconds: 30 };
  if (value === 'timed60') return { mode: 'timed', timedSeconds: 60 };
  return { mode: 'words', timedSeconds: null };
}

function clampWordCount(value, fallback = 20) {
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) return fallback;
  return Math.min(Math.max(num, 3), 100);
}

describe('practice settings helpers', () => {
  test('parseTestMode maps timed options', () => {
    assert.deepEqual(parseTestMode('timed30'), { mode: 'timed', timedSeconds: 30 });
    assert.deepEqual(parseTestMode('words'), { mode: 'words', timedSeconds: null });
  });

  test('clampWordCount enforces bounds', () => {
    assert.equal(clampWordCount('2'), 3);
    assert.equal(clampWordCount('999'), 100);
    assert.equal(clampWordCount('abc', 25), 25);
  });
});
