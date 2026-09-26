function isEditableTarget(element) {
  if (!element) return false;
  const tag = element.tagName;
  if (tag === 'TEXTAREA' || element.isContentEditable) return true;
  if (tag !== 'INPUT') return false;
  const type = (element.type || 'text').toLowerCase();
  return !['button', 'submit', 'checkbox', 'radio', 'range', 'reset'].includes(type);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isEditableTarget };
} else {
  window.TM = window.TM || {};
  TM.isEditableTarget = isEditableTarget;
}
