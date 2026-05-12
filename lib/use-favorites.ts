'use client';

import * as React from 'react';

const STORAGE_KEY = 'ottomantaste:favs:v1';

/**
 * Cross-tab synchronized favorites set persisted in localStorage.
 *
 * Hydration safety: the set is empty on the server and on the very first
 * client render. We populate from storage in a layout effect, then re-render.
 * Components that consume `isFavorite()` should not crash on empty initial
 * value, and `mounted` is exposed so UI can switch between SSR-safe stub and
 * the real state.
 *
 * Performance:
 *   - Reads localStorage once on mount.
 *   - Writes happen synchronously inside `toggle()` (single small JSON).
 *   - Other tabs receive updates via the native `storage` event.
 *   - The exported callbacks are stable across re-renders (useCallback).
 */
type FavoritesAPI = {
  favorites: ReadonlySet<string>;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  count: number;
  mounted: boolean;
};

function readFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((s): s is string => typeof s === 'string'));
  } catch {
    return new Set();
  }
}

function writeToStorage(favs: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
  } catch {
    // Quota exceeded or storage disabled — silently drop. Heart toggle stays
    // visually consistent within the tab; cross-tab sync simply degrades.
  }
}

export function useFavorites(): FavoritesAPI {
  const [favs, setFavs] = React.useState<Set<string>>(() => new Set());
  const [mounted, setMounted] = React.useState(false);

  // Initial read — runs after first paint to avoid SSR/CSR mismatch.
  React.useEffect(() => {
    setFavs(readFromStorage());
    setMounted(true);
  }, []);

  // Cross-tab sync — listen to storage events from other tabs.
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setFavs(readFromStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFavorite = React.useCallback(
    (slug: string) => favs.has(slug),
    [favs],
  );

  const add = React.useCallback((slug: string) => {
    setFavs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      writeToStorage(next);
      return next;
    });
  }, []);

  const remove = React.useCallback((slug: string) => {
    setFavs((prev) => {
      if (!prev.has(slug)) return prev;
      const next = new Set(prev);
      next.delete(slug);
      writeToStorage(next);
      return next;
    });
  }, []);

  const toggle = React.useCallback((slug: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      writeToStorage(next);
      return next;
    });
  }, []);

  return { favorites: favs, isFavorite, toggle, add, remove, count: favs.size, mounted };
}

/** Read favorites synchronously without hooking — used by client pages on first render. */
export function readFavoritesOnce(): string[] {
  return [...readFromStorage()];
}
