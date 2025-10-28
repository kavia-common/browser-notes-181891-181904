import React, { useCallback, useMemo, useRef } from 'react';
import SearchBar from './SearchBar';

/**
 * NotesList is the left sidebar list showing notes with search and pin filter.
 */
// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  allCount,
  onCreate,
  selectedId,
  onSelect,
  onTogglePin,
  searchQuery,
  onSearchChange,
  pinnedOnly,
  onPinnedOnlyChange
}) {
  const listRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (!listRef.current) return;
    const items = [...listRef.current.querySelectorAll('[role="option"]')];
    const idx = items.findIndex(i => i.getAttribute('data-id') === String(selectedId));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[Math.min(items.length - 1, idx + 1)];
      next && onSelect(next.getAttribute('data-id'));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[Math.max(0, idx - 1)];
      prev && onSelect(prev.getAttribute('data-id'));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Already selected: no-op
    }
  }, [selectedId, onSelect]);

  const counts = useMemo(() => {
    const pinned = notes.filter(n => n.pinned).length;
    return { pinned, total: allCount };
  }, [notes, allCount]);

  return (
    <div className="notes-list" onKeyDown={handleKeyDown}>
      <div className="list-header">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <button className="btn secondary" onClick={onCreate} aria-label="Create new note in list">+ New</button>
      </div>
      <div className="filter-row">
        <label>
          <input
            type="checkbox"
            checked={pinnedOnly}
            onChange={e => onPinnedOnlyChange(e.target.checked)}
            aria-label="Show only pinned"
          />{' '}
          Pinned only
        </label>
        <span style={{ marginLeft: 'auto' }} aria-live="polite">
          {counts.pinned} pinned · {counts.total} total
        </span>
      </div>
      <div className="notes-scroll" role="listbox" aria-label="Notes" ref={listRef}>
        {notes.length === 0 ? (
          <div className="empty" role="status">No notes match your search.</div>
        ) : (
          notes.map(n => (
            <article
              key={n.id}
              role="option"
              aria-selected={String(n.id) === String(selectedId)}
              data-id={n.id}
              className="note-item"
              onClick={() => onSelect(n.id)}
              tabIndex={0}
            >
              <div>
                <div className="note-title">
                  {n.title?.trim() || 'Untitled'}
                </div>
                <div className="note-snippet">
                  {n.content?.slice(0, 100) || 'No content yet...'}
                </div>
                <div className="note-meta">
                  <time dateTime={new Date(n.updatedAt).toISOString()}>
                    {new Date(n.updatedAt).toLocaleString()}
                  </time>
                  {n.pinned && <span className="pin-badge" title="Pinned">📌</span>}
                </div>
              </div>
              <div>
                <button
                  className="btn secondary"
                  onClick={(e) => { e.stopPropagation(); onTogglePin(n.id); }}
                  aria-label={n.pinned ? 'Unpin note' : 'Pin note'}
                >
                  {n.pinned ? 'Unpin' : 'Pin'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
