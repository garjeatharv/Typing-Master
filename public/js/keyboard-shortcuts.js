window.TM = window.TM || {};

function isTypingSessionActive() {
  const surface = document.getElementById('typing-surface');
  return Boolean(surface && surface.dataset.active === 'true');
}

function registerShortcuts() {
  document.addEventListener('keydown', (event) => {
    if (event.altKey) return;

    if (event.ctrlKey && event.shiftKey) {
      const key = event.key.toLowerCase();
      if (key === 'p' || key === 's') {
        if (isTypingSessionActive()) return;
        event.preventDefault();
        window.location.href = key === 'p' ? '/' : '/stats';
      }
      return;
    }

    if (event.ctrlKey && event.key === 'Enter') {
      if (isTypingSessionActive()) return;

      const restartBtn = document.getElementById('restart');
      const startBtn = document.getElementById('start');

      if (restartBtn && !restartBtn.hidden) {
        event.preventDefault();
        restartBtn.click();
        return;
      }

      if (startBtn && !startBtn.disabled) {
        event.preventDefault();
        startBtn.click();
      }
    }
  });
}

TM.isTypingSessionActive = isTypingSessionActive;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isTypingSessionActive };
}

document.addEventListener('DOMContentLoaded', registerShortcuts);
