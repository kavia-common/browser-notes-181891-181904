import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId, sortNotes, filterByQuery } from './utils/notesStorage';

/**
 * App is the root component that manages notes state, selection, search, and filters.
 * It renders a responsive two-pane layout with a left notes list and a right editor.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [selectedId, setSelectedId] = useLocalStorage('selectedId', null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedOnly, setPinnedOnly] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    const now = Date.now();
    const newNote = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      tags: [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => {
      const updated = sortNotes([newNote, ...prev]);
      return updated;
    });
    setSelectedId(newNote.id);
  }, [setNotes, setSelectedId]);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((id, patch) => {
    setNotes(prev => {
      const updated = prev.map(n => {
        if (n.id !== id) return n;
        const next = { ...n, ...patch, updatedAt: Date.now() };
        return next;
      });
      return sortNotes(updated);
    });
  }, [setNotes]);

  // PUBLIC_INTERFACE
  const togglePin = useCallback((id) => {
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n);
      return sortNotes(updated);
    });
  }, [setNotes]);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === id);
      const nextList = prev.filter(n => n.id !== id);
      // Choose neighbor selection
      if (selectedId === id) {
        const neighbor = nextList[Math.max(0, idx - 1)] || null;
        setSelectedId(neighbor ? neighbor.id : null);
      }
      return nextList;
    });
  }, [setNotes, selectedId, setSelectedId]);

  // Derived data: filtered and sorted list
  const visibleNotes = useMemo(() => {
    const filtered = filterByQuery(notes, searchQuery, pinnedOnly);
    return sortNotes(filtered);
  }, [notes, searchQuery, pinnedOnly]);

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // Ensure a selected note exists when notes list changes
  useEffect(() => {
    if (!selectedNote && notes.length > 0) {
      setSelectedId(notes[0].id);
    }
  }, [notes, selectedNote, setSelectedId]);

  return (
    <div className="app-root">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onCreate={createNote}
      />
      <main className="app-main" role="main">
        <aside className="sidebar" aria-label="Notes list">
          <NotesList
            notes={visibleNotes}
            allCount={notes.length}
            onCreate={createNote}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onTogglePin={togglePin}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            pinnedOnly={pinnedOnly}
            onPinnedOnlyChange={setPinnedOnly}
          />
        </aside>
        <section className="editor-pane" aria-label="Note editor">
          {selectedNote ? (
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onChange={(patch) => updateNote(selectedNote.id, patch)}
              onDelete={() => deleteNote(selectedNote.id)}
              onTogglePin={() => togglePin(selectedNote.id)}
            />
          ) : (
            <EmptyState onCreate={createNote} />
          )}
        </section>
      </main>

      {/* Floating action button for mobile create */}
      <button
        className="fab"
        aria-label="Create new note"
        onClick={createNote}
      >
        +
      </button>
    </div>
  );
}

export default App;
