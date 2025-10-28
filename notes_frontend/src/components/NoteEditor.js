import React, { useEffect, useRef, useState } from 'react';

/**
 * NoteEditor renders the right pane for editing a note with autosave feedback.
 */
// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete, onTogglePin }) {
  const [local, setLocal] = useState({
    title: note.title || '',
    content: note.content || '',
    tags: Array.isArray(note.tags) ? note.tags : []
  });
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setLocal({
      title: note.title || '',
      content: note.content || '',
      tags: Array.isArray(note.tags) ? note.tags : []
    });
  }, [note.id]); // reset when note changes

  // Debounced save on local changes
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      onChange(local);
      setSaving(false);
    }, 250);
    return () => clearTimeout(saveTimer.current);
  }, [local, onChange]);

  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const t = e.target.value.trim();
      setLocal(prev => ({ ...prev, tags: [...new Set([...(prev.tags || []), t])] }));
      e.target.value = '';
    }
  };

  const removeTag = (t) => {
    setLocal(prev => ({ ...prev, tags: (prev.tags || []).filter(x => x !== t) }));
  };

  return (
    <div className="editor">
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          className="title-input"
          value={local.title}
          onChange={e => setLocal(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          aria-label="Note title"
        />
        <div className="editor-actions">
          <button className="btn secondary" onClick={onTogglePin} aria-label={note.pinned ? 'Unpin' : 'Pin'}>
            {note.pinned ? '📌 Unpin' : '📌 Pin'}
          </button>
          <button className="btn danger" onClick={onDelete} aria-label="Delete note">
            🗑 Delete
          </button>
        </div>
      </div>

      <textarea
        className="content-input"
        value={local.content}
        onChange={e => setLocal(prev => ({ ...prev, content: e.target.value }))}
        placeholder="Write your note..."
        aria-label="Note content"
      />

      <div className="tag-row" aria-label="Tags">
        {(local.tags || []).map(t => (
          <span key={t} className="btn secondary" style={{ borderRadius: 999 }}>
            #{t}
            <button
              className="btn danger"
              style={{ marginLeft: 6, padding: '2px 6px' }}
              onClick={() => removeTag(t)}
              aria-label={`Remove tag ${t}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="tag-input"
          placeholder="Add tag and press Enter"
          onKeyDown={onTagKeyDown}
          aria-label="Add tag"
        />
      </div>

      <div className="hint" role="status" aria-live="polite">
        {saving ? 'Saving…' : `Last edited ${new Date(note.updatedAt).toLocaleString()}`}
      </div>
    </div>
  );
}
