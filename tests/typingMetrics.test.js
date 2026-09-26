const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { calculateWpm, calculateAccuracy } = require('../src/utils/typingMetrics');

describe('typingMetrics', () => {
  test('calculateWpm uses 5 chars per word', () => {
    assert.equal(calculateWpm(50, 60), 10);
  });

  test('calculateAccuracy rounds percentage', () => {
    assert.equal(calculateAccuracy(90, 100), 90);
    assert.equal(calculateAccuracy(0, 0), 100);
  });
});
