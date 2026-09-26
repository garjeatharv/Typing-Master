/**
 * Display initials for a display name.
 * "John Doe" → JD; single word "John" → JN (first + last letter).
 */
function userInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0][0] || '';
    const last = parts[parts.length - 1][0] || '';
    return `${first}${last}`.toUpperCase() || '?';
  }
  const single = parts[0] || '';
  if (single.length >= 2) {
    return `${single[0]}${single[single.length - 1]}`.toUpperCase();
  }
  return single.toUpperCase() || '?';
}

module.exports = { userInitials };
