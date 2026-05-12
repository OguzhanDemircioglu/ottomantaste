'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search as SearchIcon, X, ArrowUpRight } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

/**
 * Lazy substring search across title (TR + EN), tagline, and ingredient names.
 * Index is fetched on first open from /search-index.json and cached in module
 * scope; subsequent opens are instant. Search runs client-side; no DB.
 *
 * Performance:
 *   - Network: index fetch fires only once per session
 *   - CPU: simple lowercase substring + ranking, ≤5 ms for 427 entries
 *   - DOM: only top 12 matches rendered; rest discarded
 *   - Re-renders: input is debounced 100 ms, results updated via flushSync-free state
 */

type Entry = {
  slug: string;
  title_tr: string;
  title_en: string;
  tagline_tr: string;
  tagline_en: string;
  category: string;
  ingredients: string;
  hero_image: string;
};

let _indexCache: Entry[] | null = null;
let _indexPromise: Promise<Entry[]> | null = null;

async function loadIndex(): Promise<Entry[]> {
  if (_indexCache) return _indexCache;
  if (_indexPromise) return _indexPromise;
  _indexPromise = fetch('/search-index.json')
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => {
      _indexCache = (data as Entry[]) ?? [];
      return _indexCache;
    })
    .catch(() => {
      _indexCache = [];
      return _indexCache;
    });
  return _indexPromise;
}

function normalize(s: string) {
  // Turkish-aware lowercase + diacritic fold for forgiving search
  return s
    .toLocaleLowerCase('tr')
    .replace(/[ıİiI]/g, 'i')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[şŞ]/g, 's')
    .replace(/[çÇ]/g, 'c')
    .replace(/[öÖ]/g, 'o')
    .replace(/[üÜ]/g, 'u')
    .replace(/[âî]/g, (m) => (m === 'â' ? 'a' : 'i'));
}

function score(entry: Entry, q: string): number {
  const titleTr = normalize(entry.title_tr);
  const titleEn = normalize(entry.title_en);
  const tagline = normalize(`${entry.tagline_tr} ${entry.tagline_en}`);
  const ings = normalize(entry.ingredients);
  if (titleTr.startsWith(q)) return 1000;
  if (titleEn.startsWith(q)) return 950;
  if (titleTr.includes(q)) return 800;
  if (titleEn.includes(q)) return 750;
  if (tagline.includes(q)) return 400;
  if (ings.includes(q)) return 200;
  return 0;
}

type Props = {
  open: boolean;
  onClose: () => void;
  lang: Lang;
};

export function SearchModal({ open, onClose, lang }: Props) {
  const [query, setQuery] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [index, setIndex] = React.useState<Entry[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load index lazily on first open
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadIndex().then((idx) => {
      if (!cancelled) setIndex(idx);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Focus on open + Escape to close
  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  // Debounce input
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 100);
    return () => clearTimeout(id);
  }, [query]);

  const results = React.useMemo(() => {
    if (debounced.length < 2 || index.length === 0) return [];
    const q = normalize(debounced);
    const scored = index
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12);
    return scored.map((x) => x.e);
  }, [debounced, index]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('nav_search', lang)}
      className="fixed inset-0 z-[60]"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t('closeLabel', lang)}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-[#2a1810]/55 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative z-10 mx-auto mt-[10vh] flex w-[min(640px,92vw)] flex-col overflow-hidden rounded-md bg-[var(--color-paper)] shadow-[0_30px_80px_-20px_rgba(42,24,16,0.4)]">
        <header className="flex items-center gap-3 border-b border-[#2a1810]/15 px-4 py-3">
          <SearchIcon className="h-4 w-4 shrink-0 text-[#2a1810]/55" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder={t('searchPh', lang)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent py-1 text-base text-[#2a1810] placeholder:text-[#2a1810]/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeLabel', lang)}
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-[#2a1810]/55 transition-colors hover:bg-[#2a1810]/8 hover:text-[#2a1810]"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="max-h-[60vh] overflow-y-auto">
          {debounced.length < 2 ? (
            <p className="px-5 py-12 text-center text-sm text-[#2a1810]/55">
              {t('searchHint', lang)}
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-[#2a1810]/55">
              {t('searchEmpty', lang)}
            </p>
          ) : (
            <ul className="divide-y divide-[#2a1810]/10">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={lang === 'en' ? `/recipes/${r.slug}?lang=en` : `/recipes/${r.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#2a1810]/4"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                      <Image
                        src={r.hero_image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                        style={{ filter: 'sepia(0.16) saturate(0.92)' }}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-base text-[#2a1810]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {lang === 'en' ? r.title_en : r.title_tr}
                      </span>
                      {(lang === 'en' ? r.tagline_en : r.tagline_tr) && (
                        <span className="block truncate text-xs text-[#2a1810]/60">
                          {lang === 'en' ? r.tagline_en : r.tagline_tr}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[#2a1810]/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Keyboard hint footer */}
        <footer className="border-t border-[#2a1810]/15 bg-[#2a1810]/4 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#2a1810]/50">
          <kbd className="rounded border border-[#2a1810]/20 bg-[var(--color-paper)] px-1.5 py-0.5 font-mono">Esc</kbd>{' '}
          {t('closeLabel', lang)}
        </footer>
      </div>
    </div>
  );
}
