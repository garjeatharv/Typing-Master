const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  SESSION_CATEGORIES,
  RANDOM_CATEGORY,
  WORD_CATEGORIES,
} = require('../src/constants/categories');

describe('categories constants', () => {
  test('Random is default session category option', () => {
    assert.equal(SESSION_CATEGORIES[0], RANDOM_CATEGORY);
  });

  test('word categories exclude Random', () => {
    assert.equal(WORD_CATEGORIES.includes(RANDOM_CATEGORY), false);
  });
});
