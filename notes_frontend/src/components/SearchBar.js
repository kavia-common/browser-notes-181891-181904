import React from 'react';

/**
 * SearchBar renders a text input used for filtering notes by query.
 */
// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search-input"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search notes…"
      aria-label="Search notes"
    />
  );
}
