import React from 'react';

/**
 * Navbar renders the top application bar with branding and actions.
 */
// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme, onCreate }) {
  /** This component shows app title, theme toggle and create note actions. */
  return (
    <header className="navbar" role="banner">
      <div className="brand" aria-label="App brand">
        <span className="logo" aria-hidden="true" />
        <span>Browser Notes</span>
      </div>
      <div className="nav-actions">
        <button
          className="btn secondary"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button
          className="btn"
          onClick={onCreate}
          aria-label="Create a new note"
        >
          + New
        </button>
      </div>
    </header>
  );
}
