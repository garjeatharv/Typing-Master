window.TM = window.TM || {};

const WORD_COUNT_MIN = 3;
const WORD_COUNT_MAX = 100;
const WORD_COUNT_DEFAULT = 20;

function parseTestMode(value) {
  if (value === 'timed30') return { mode: 'timed', timedSeconds: 30 };
  if (value === 'timed60') return { mode: 'timed', timedSeconds: 60 };
  return { mode: 'words', timedSeconds: null };
}

function clampWordCount(value, fallback = WORD_COUNT_DEFAULT) {
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) return fallback;
  return Math.min(Math.max(num, WORD_COUNT_MIN), WORD_COUNT_MAX);
}

TM.parseTestMode = parseTestMode;
TM.clampWordCount = clampWordCount;

class PracticeSettings {
  constructor(root = document.getElementById('practice-settings')) {
    this.root = root;
    if (!this.root) return;

    this.wordCountRow = this.root.querySelector('#word-count-row');
    this.slider = this.root.querySelector('#word-count-slider');
    this.numberInput = this.root.querySelector('#word-count-input');
    this.output = this.root.querySelector('#word-count-value');
    this.lowercaseToggle = this.root.querySelector('#toggleLowercase');
    this.numbersToggle = this.root.querySelector('#toggleNumbers');
    this.symbolsToggle = this.root.querySelector('#toggleSymbols');
    this.modeInputs = this.root.querySelectorAll('input[name="testMode"]');

    this._bindWordCountSync();
    this._bindModeVisibility();
  }

  _bindWordCountSync() {
    if (!this.slider || !this.numberInput || !this.output) return;

    const sync = (value) => {
      const clamped = clampWordCount(value);
      this.slider.value = String(clamped);
      this.numberInput.value = String(clamped);
      this.output.textContent = String(clamped);
    };

    this.slider.addEventListener('input', () => sync(this.slider.value));
    this.numberInput.addEventListener('input', () => sync(this.numberInput.value));
    this.numberInput.addEventListener('change', () => sync(this.numberInput.value));
    sync(this.numberInput.value);
  }

  _bindModeVisibility() {
    this.modeInputs.forEach((input) => {
      input.addEventListener('change', () => this._updateModeVisibility());
    });
    this._updateModeVisibility();
  }

  _updateModeVisibility() {
    if (!this.wordCountRow) return;
    const { mode } = this.getTestModeConfig();
    this.wordCountRow.hidden = mode === 'timed';
    this.wordCountRow.classList.toggle('is-disabled', mode === 'timed');
  }

  getSelectedCategory() {
    const selected = this.root.querySelector('input[name="category"]:checked');
    return selected ? selected.value : 'Random';
  }

  getTestModeConfig() {
    const selected = this.root.querySelector('input[name="testMode"]:checked');
    return parseTestMode(selected ? selected.value : 'words');
  }

  getWordCount() {
    if (!this.numberInput) return WORD_COUNT_DEFAULT;
    return clampWordCount(this.numberInput.value);
  }

  getContentOptions() {
    return {
      lowercase: Boolean(this.lowercaseToggle && this.lowercaseToggle.checked),
      includeNumbers: Boolean(this.numbersToggle && this.numbersToggle.checked),
      includeSymbols: Boolean(this.symbolsToggle && this.symbolsToggle.checked),
    };
  }

  getTypingBehavior() {
    const selected = this.root.querySelector('input[name="typingBehavior"]:checked');
    return selected ? selected.value : 'forgiving';
  }

  getConfig() {
    const modeConfig = this.getTestModeConfig();
    const content = this.getContentOptions();
    return {
      category: this.getSelectedCategory(),
      mode: modeConfig.mode,
      timedSeconds: modeConfig.timedSeconds,
      wordCount: modeConfig.mode === 'timed' ? 120 : this.getWordCount(),
      typingBehavior: this.getTypingBehavior(),
      ...content,
    };
  }

  setInteractive(enabled) {
    const fields = this.root.querySelectorAll('input, button');
    fields.forEach((el) => {
      el.disabled = !enabled;
    });
  }
}

TM.PracticeSettings = PracticeSettings;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('practice-settings')) {
    TM.practiceSettings = new PracticeSettings();
  }
});
