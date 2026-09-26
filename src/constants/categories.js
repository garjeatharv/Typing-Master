/** Categories stored on each word document in MongoDB */
const WORD_CATEGORIES = Object.freeze(['Coding', 'Animals', 'Things', 'Places']);

/** Virtual filter: sample words from all DB categories */
const RANDOM_CATEGORY = 'Random';

/** Allowed category values on sessions and API queries */
const SESSION_CATEGORIES = Object.freeze([RANDOM_CATEGORY, ...WORD_CATEGORIES]);

const TEST_MODES = Object.freeze({
  WORDS: 'words',
  TIMED: 'timed',
});

const TIMED_DURATIONS = Object.freeze([30, 60]);

module.exports = {
  WORD_CATEGORIES,
  RANDOM_CATEGORY,
  SESSION_CATEGORIES,
  /** @deprecated use SESSION_CATEGORIES */
  CATEGORIES: SESSION_CATEGORIES,
  TEST_MODES,
  TIMED_DURATIONS,
};
