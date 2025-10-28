import React from 'react';

/**
 * EmptyState shows guidance when there is no selected note.
 */
// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  return (
    <div className="empty">
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No note selected</div>
        <div style={{ marginBottom: 16 }}>Create a new note to get started.</div>
        <button className="btn" onClick={onCreate} aria-label="Create your first note">+ Create note</button>
      </div>
    </div>
  );
}
