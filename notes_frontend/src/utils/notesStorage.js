function pad(n, w = 4) {
  return String(n).padStart(w, '0');
}

/**
 * Generates a compact unique id using time and randomness.
 */
// PUBLIC_INTERFACE
export function generateId() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${t}${r}`;
}

/**
 * Sort notes: pinned first, then by updatedAt desc.
 */
// PUBLIC_INTERFACE
export function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });
}

/**
 * Filter notes by a search query. Matches title, content, and tags.
 * Optionally restrict to pinned only.
 */
// PUBLIC_INTERFACE
export function filterByQuery(notes, query, pinnedOnly = false) {
  const q = (query || '').toLowerCase().trim();
  return notes.filter(n => {
    if (pinnedOnly && !n.pinned) return false;
    if (!q) return true;
    const inTitle = (n.title || '').toLowerCase().includes(q);
    const inContent = (n.content || '').toLowerCase().includes(q);
    const inTags = Array.isArray(n.tags) && n.tags.some(t => String(t).toLowerCase().includes(q));
    return inTitle || inContent || inTags;
  });
}
