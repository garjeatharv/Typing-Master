const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { buildSessionTooltip } = require('../public/js/core/session-format.js');

describe('session format helpers', () => {
  test('buildSessionTooltip includes key metrics', () => {
    const text = buildSessionTooltip({
      createdAt: '2026-01-01T12:00:00.000Z',
      wpm: 42,
      accuracy: 97,
      mode: 'words',
      category: 'Random',
      wordCount: 20,
      errorCount: 2,
    });

    assert.match(text, /42 WPM/);
    assert.match(text, /97% accuracy/);
    assert.match(text, /Random/);
    assert.match(text, /2 errors/);
  });
});

describe('keyboard shortcut helpers', () => {
  test('isEditableTarget treats text inputs as editable', () => {
    const { isEditableTarget } = require('../public/js/core/keyboard-helpers.js');
    assert.equal(isEditableTarget({ tagName: 'INPUT', type: 'text' }), true);
    assert.equal(isEditableTarget({ tagName: 'INPUT', type: 'button' }), false);
    assert.equal(isEditableTarget({ tagName: 'DIV' }), false);
  });
});
