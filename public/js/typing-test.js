(function initTypingTest() {
  const quoteElement = document.getElementById('quote');
  const quoteViewport = document.getElementById('quote-viewport');
  const typingSurface = document.getElementById('typing-surface');
  const liveStats = document.getElementById('live-stats');
  const messageElement = document.getElementById('message');
  const startBtn = document.getElementById('start');
  const restartBtn = document.getElementById('restart');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const practicePage = document.getElementById('practice-page');
  const liveTime = document.getElementById('live-time');
  const liveWpm = document.getElementById('live-wpm');
  const liveAccuracy = document.getElementById('live-accuracy');

  const settings = TM.practiceSettings || new TM.PracticeSettings();

  if (!quoteElement || !typingSurface || !startBtn || !settings.root) return;

  let words = [];
  let stream = '';
  let charIndex = 0;
  let charStates = [];
  let wordIndex = 0;
  let startTime = 0;
  let timerStarted = false;
  let timerInterval = null;
  let timedLimitSeconds = null;
  let testMode = 'words';
  let category = 'Random';
  let typingBehavior = 'forgiving';
  let finished = false;
  let sessionState = 'idle';

  const stats = {
    correctChars: 0,
    totalChars: 0,
    errorCount: 0,
    completedWords: 0,
  };

  function processWords(rawWords, config) {
    return TM.enrichPracticeWords(rawWords, {
      lowercase: config.lowercase,
      includeNumbers: config.includeNumbers,
      includeSymbols: config.includeSymbols,
    });
  }

  function resetStats() {
    stats.correctChars = 0;
    stats.totalChars = 0;
    stats.errorCount = 0;
    stats.completedWords = 0;
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function setTypingSessionActive(active) {
    typingSurface.dataset.active = active ? 'true' : 'false';
    typingSurface.classList.toggle('typing-surface--preview', !active);
  }

  function setLiveStatsVisible(visible) {
    if (liveStats) liveStats.classList.toggle('live-stats--hidden', !visible);
  }

  function setRunControls(state) {
    sessionState = state;
    if (practicePage) {
      practicePage.classList.toggle('practice-page--running', state === 'running');
    }
    if (state === 'running') {
      startBtn.hidden = true;
      restartBtn.hidden = true;
      updateFilterToggleState();
      return;
    }
    if (state === 'finished') {
      startBtn.hidden = true;
      restartBtn.hidden = false;
      updateFilterToggleState();
      return;
    }
    startBtn.hidden = false;
    startBtn.disabled = false;
    restartBtn.hidden = true;
    updateFilterToggleState();
  }

  function canChangeFilters() {
    return sessionState === 'idle' || sessionState === 'finished';
  }

  function setFilterToggleEnabled(enabled) {
    if (applyFiltersBtn) applyFiltersBtn.disabled = !enabled;
  }

  function setFiltersOpen() {
    /* settings stay visible; no overlay panel */
  }

  function updateFilterToggleState() {
    setFilterToggleEnabled(canChangeFilters());
  }

  function buildStream() {
    return words.join(' ');
  }

  function escapeHtml(char) {
    if (char === ' ') return ' ';
    return char
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderQuote(showCaret) {
    let html = '';
    for (let i = 0; i < stream.length; i += 1) {
      let className = 'char char--pending';
      if (i < charIndex) {
        className = charStates[i] === 'wrong' ? 'char char--wrong' : 'char char--done';
      } else if (showCaret && i === charIndex) {
        className = 'char char--pending char--active';
      }
      html += `<span class="${className}" data-i="${i}">${escapeHtml(stream[i])}</span>`;
    }
    quoteElement.innerHTML = html;
    quoteElement.classList.toggle('quote-track--idle', !timerStarted && charIndex === 0);
    updateQuoteScroll();
  }

  function renderPreview() {
    renderQuote(false);
  }

  function flashStrictError() {
    typingSurface.classList.add('typing-surface--error');
    const active = quoteElement.querySelector('.char--active');
    if (active) active.classList.add('char--error-flash');
    window.setTimeout(() => {
      typingSurface.classList.remove('typing-surface--error');
      if (active) active.classList.remove('char--error-flash');
    }, 160);
  }

  function updateQuoteScroll() {
    if (!quoteViewport || !stream.length) return;
    const active = quoteElement.querySelector('.char--active')
      || quoteElement.querySelector('.char--done:last-of-type')
      || quoteElement.querySelector('.char');
    if (!active) return;

    const trackStyle = getComputedStyle(quoteElement);
    const lineHeight = parseFloat(trackStyle.lineHeight) || 28;
    const viewportHeight = quoteViewport.clientHeight;
    const edgePad = 6;
    const maxScroll = Math.max(0, quoteElement.scrollHeight - viewportHeight + edgePad);
    const lineTop = active.offsetTop;
    const lineBottom = lineTop + lineHeight;

    let translateY = lineTop - lineHeight;

    if (lineBottom - translateY > viewportHeight - edgePad) {
      translateY = lineBottom - viewportHeight + edgePad;
    }

    if (!quoteElement.querySelector('.char--active') && charIndex === 0) {
      translateY = 0;
    }

    translateY = Math.max(0, Math.min(translateY, maxScroll));
    quoteElement.style.transform = `translateY(-${translateY}px)`;
  }

  function syncConfigFromSettings() {
    const config = settings.getConfig();
    testMode = config.mode;
    timedLimitSeconds = config.timedSeconds;
    category = config.category;
    typingBehavior = config.typingBehavior || 'forgiving';
    return config;
  }

  async function fetchWords(config) {
    const res = await TM.request(
      `/api/words?category=${encodeURIComponent(config.category)}&count=${config.wordCount}`
    );
    return res.data || [];
  }

  function resetTypingProgress() {
    charIndex = 0;
    charStates = [];
    wordIndex = 0;
    timerStarted = false;
    finished = false;
    resetStats();
    clearTimer();
    setTypingSessionActive(false);
    setLiveStatsVisible(false);
    quoteElement.style.transform = '';
    liveTime.textContent = '0:00';
    liveWpm.textContent = '0';
    liveAccuracy.textContent = '100';
  }

  function showQuoteLoading() {
    quoteElement.innerHTML =
      '<div class="quote-shimmer" aria-hidden="true">' +
      '<span class="shimmer shimmer--line"></span>'.repeat(4) +
      '</div>';
    quoteElement.classList.remove('quote-track--idle');
    startBtn.disabled = true;
    messageElement.textContent = '';
    messageElement.setAttribute('aria-busy', 'true');
  }

  function clearQuoteLoading() {
    messageElement.removeAttribute('aria-busy');
    if (sessionState === 'idle' || sessionState === 'finished') {
      startBtn.disabled = false;
    }
  }

  async function loadPreviewWords() {
    if (!canChangeFilters()) return;

    const config = syncConfigFromSettings();
    if (applyFiltersBtn) applyFiltersBtn.disabled = true;
    showQuoteLoading();

    try {
      const fetchedWords = await fetchWords(config);
      if (!fetchedWords.length) {
        messageElement.textContent = 'No words found. Run npm run seed.';
        quoteElement.innerHTML = '';
        return;
      }

      resetTypingProgress();
      words = processWords(fetchedWords, config);
      stream = buildStream();
      renderPreview();
      setRunControls('idle');
      messageElement.textContent = 'Press start or click in the text area when ready.';
    } catch (err) {
      quoteElement.innerHTML = '';
      messageElement.textContent = err.message || 'Failed to load words.';
    } finally {
      clearQuoteLoading();
      if (applyFiltersBtn) applyFiltersBtn.disabled = false;
      settings.setInteractive(true);
    }
  }

  function elapsedSeconds() {
    if (!timerStarted) return 0;
    return (Date.now() - startTime) / 1000;
  }

  function updateLiveStats() {
    const duration = testMode === 'timed' && timedLimitSeconds
      ? Math.min(elapsedSeconds(), timedLimitSeconds)
      : elapsedSeconds();

    liveWpm.textContent = TM.calculateWpm(stats.correctChars, duration || 1);
    liveAccuracy.textContent = TM.calculateAccuracy(stats.correctChars, stats.totalChars);

    if (testMode === 'timed' && timedLimitSeconds) {
      const remaining = Math.max(0, timedLimitSeconds - elapsedSeconds());
      liveTime.textContent = TM.formatDuration(remaining);
    } else {
      liveTime.textContent = TM.formatDuration(duration);
    }
  }

  function beginTimerIfNeeded() {
    if (timerStarted) return;
    timerStarted = true;
    startTime = Date.now();
    quoteElement.classList.remove('quote-track--idle');
    messageElement.textContent = '';
    setLiveStatsVisible(true);
    updateLiveStats();
    clearTimer();
    if (testMode === 'timed' && timedLimitSeconds) {
      timerInterval = setInterval(() => {
        updateLiveStats();
        if (elapsedSeconds() >= timedLimitSeconds) {
          finishTest('Time is up!');
        }
      }, 250);
    } else {
      timerInterval = setInterval(updateLiveStats, 500);
    }
  }

  async function saveSession(result) {
    try {
      await TM.request('/api/sessions', {
        method: 'POST',
        body: JSON.stringify(result),
      });
    } catch (err) {
      console.error('Failed to save session:', err);
      messageElement.innerHTML += '<br><small>Could not save this session to your profile.</small>';
    }
  }

  async function finishTest(reason) {
    if (finished) return;
    finished = true;
    clearTimer();
    setTypingSessionActive(false);
    typingSurface.blur();
    settings.setInteractive(true);
    setRunControls('finished');

    const durationSeconds = testMode === 'timed' && timedLimitSeconds
      ? Math.min(elapsedSeconds(), timedLimitSeconds)
      : Math.max(elapsedSeconds(), 0.01);

    const wpm = TM.calculateWpm(stats.correctChars, durationSeconds);
    const accuracy = TM.calculateAccuracy(stats.correctChars, stats.totalChars);

    messageElement.innerHTML =
      `<strong>${reason}</strong> · WPM: <strong>${wpm}</strong> · ` +
      `Accuracy: <strong>${accuracy}%</strong> · Words: <strong>${stats.completedWords}</strong>`;

    updateQuoteScroll();

    await saveSession({
      mode: testMode,
      category,
      timedSeconds: timedLimitSeconds,
      wordCount: stats.completedWords,
      durationSeconds: Number(durationSeconds.toFixed(2)),
      correctChars: stats.correctChars,
      totalChars: stats.totalChars,
      errorCount: stats.errorCount,
    });
  }

  function advanceChar(key, isCorrect) {
    charStates[charIndex] = isCorrect ? 'correct' : 'wrong';
    stats.totalChars += 1;
    if (isCorrect) stats.correctChars += 1;
    else stats.errorCount += 1;

    if (key === ' ') {
      stats.completedWords += 1;
      wordIndex += 1;
    }

    charIndex += 1;
    renderQuote(true);
    updateLiveStats();

    if (charIndex >= stream.length) {
      finishTest('Test complete!');
    }
  }

  function handleCharacterKey(key) {
    if (finished || charIndex >= stream.length) return;

    beginTimerIfNeeded();

    const expected = stream[charIndex];
    const isCorrect = key === expected;

    if (!isCorrect && typingBehavior === 'strict') {
      stats.errorCount += 1;
      stats.totalChars += 1;
      flashStrictError();
      updateLiveStats();
      return;
    }

    advanceChar(key, isCorrect);
  }

  function handleBackspace() {
    if (finished || charIndex === 0) return;

    charIndex -= 1;
    const removed = charStates[charIndex];
    charStates[charIndex] = undefined;

    if (stats.totalChars > 0) stats.totalChars -= 1;
    if (removed === 'correct' && stats.correctChars > 0) stats.correctChars -= 1;
    if (removed === 'wrong' && stats.errorCount > 0) stats.errorCount -= 1;

    if (stream[charIndex] === ' ') {
      if (stats.completedWords > 0) stats.completedWords -= 1;
      wordIndex = Math.max(0, wordIndex - 1);
    }

    renderQuote(true);
    updateLiveStats();
  }

  typingSurface.addEventListener('keydown', (event) => {
    if (finished || typingSurface.dataset.active !== 'true') return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
      return;
    }

    if (event.key.length !== 1) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    event.preventDefault();
    handleCharacterKey(event.key);
  });

  typingSurface.addEventListener('click', () => {
    if (typingSurface.dataset.active === 'true' && !finished) {
      typingSurface.focus();
      return;
    }
    if (sessionState === 'idle') {
      startTestFromIdle();
    }
  });

  window.addEventListener('resize', () => {
    if (stream.length) updateQuoteScroll();
  });

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', async () => {
      await loadPreviewWords();
    });
  }

  restartBtn.addEventListener('click', () => {
    loadPreviewWords();
  });

  function beginTest() {
    syncConfigFromSettings();
    const configDetails = document.getElementById('practice-config-details');
    if (configDetails && window.matchMedia('(max-width: 768px)').matches) {
      configDetails.removeAttribute('open');
    }
    resetTypingProgress();
    finished = false;
    renderQuote(true);
    messageElement.textContent = 'Start typing…';
    setTypingSessionActive(true);
    setRunControls('running');
    settings.setInteractive(false);
    typingSurface.focus();
  }

  async function startTestFromIdle() {
    if (sessionState === 'running') return;
    if (!stream.length) {
      await loadPreviewWords();
      if (!stream.length) return;
    }
    beginTest();
  }

  startBtn.addEventListener('click', () => {
    startTestFromIdle();
  });

  function syncConfigDetailsForViewport() {
    const configDetails = document.getElementById('practice-config-details');
    if (!configDetails) return;
    if (window.matchMedia('(min-width: 769px)').matches) {
      configDetails.setAttribute('open', '');
    }
  }

  function boot() {
    const configDetails = document.getElementById('practice-config-details');
    if (configDetails) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        configDetails.removeAttribute('open');
      }
      window.addEventListener('resize', syncConfigDetailsForViewport);
    }
    updateFilterToggleState();
    loadPreviewWords();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
