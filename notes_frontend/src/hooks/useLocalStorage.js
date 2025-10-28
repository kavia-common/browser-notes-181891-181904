import { useEffect, useState } from 'react';

/**
 * useLocalStorage persists state to localStorage with JSON serialization.
 * Safely handles unavailable window and invalid JSON.
 */
// PUBLIC_INTERFACE
export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState(readValue);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // ignore quota/serialization errors
    }
  }, [key, state]);

  return [state, setState];
}
