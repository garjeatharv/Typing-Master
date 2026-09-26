const test = require('node:test');
const assert = require('node:assert/strict');
const { userInitials } = require('../src/utils/userInitials');

test('userInitials uses first letters of first and last name', () => {
  assert.equal(userInitials('John Doe'), 'JD');
});

test('userInitials uses first and last letter for a single name', () => {
  assert.equal(userInitials('John'), 'JN');
});

test('userInitials handles short and empty input', () => {
  assert.equal(userInitials('A'), 'A');
  assert.equal(userInitials('  '), '?');
});
