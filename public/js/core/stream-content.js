const SYMBOL_TOKENS = ['@', '#', '$', '%', '&', '*', '-', '_', '=', '+', ':', ';', '/', '?'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function injectTokens(list, tokens, count) {
  const next = [...list];
  for (let i = 0; i < count; i += 1) {
    const token = tokens[randomInt(0, tokens.length - 1)];
    const pos = randomInt(0, next.length);
    next.splice(pos, 0, token);
  }
  return next;
}

function applyLowercase(words, enabled) {
  if (!enabled) return words;
  return words.map((word) => word.toLowerCase());
}

function enrichPracticeWords(words, options = {}) {
  const {
    lowercase = false,
    includeNumbers = false,
    includeSymbols = false,
  } = options;

  let list = applyLowercase(words, lowercase);
  const injectCount = Math.max(1, Math.floor(list.length * 0.12));

  if (includeNumbers) {
    const numbers = Array.from({ length: injectCount }, () => String(randomInt(10, 9999)));
    list = injectTokens(list, numbers, injectCount);
  }

  if (includeSymbols) {
    list = injectTokens(list, SYMBOL_TOKENS, injectCount);
  }

  return list;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { enrichPracticeWords, SYMBOL_TOKENS };
} else {
  window.TM = window.TM || {};
  TM.enrichPracticeWords = enrichPracticeWords;
}
