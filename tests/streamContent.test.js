const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { enrichPracticeWords } = require('../public/js/core/stream-content.js');

describe('stream content helpers', () => {
  test('enrichPracticeWords applies lowercase', () => {
    const result = enrichPracticeWords(['Hello', 'World'], {
      lowercase: true,
      includeNumbers: false,
      includeSymbols: false,
    });
    assert.deepEqual(result, ['hello', 'world']);
  });

  test('enrichPracticeWords can inject numbers and symbols', () => {
    const result = enrichPracticeWords(['a', 'b', 'c', 'd', 'e'], {
      lowercase: false,
      includeNumbers: true,
      includeSymbols: true,
    });
    assert.equal(result.length > 5, true);
  });
});
