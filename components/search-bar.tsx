'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

/**
 * A slim, editorial right-arrow with consistent stroke weight. Rendered
 * inline as a small SVG so we can scale and recolor it via currentColor
 * without dragging in a heavier icon set. Used both inside the right-side
 * "submit" pill and as the per-row hint inside the results dropdown.
 */
function SlimArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M3 8h9.5" />
      <path d="m8.5 4 4 4-4 4" />
    </svg>
  );
}

/**
 * Inline search input that lives above the category tabs.
 *
 * No modal, no portal — a real <input> the user types into directly. Results
 * appear in a floating panel right below the input as soon as the query is
 * ≥2 chars long. Click-outside / Escape closes the panel.
 *
 * The recipe index is fetched lazily on first focus from /api/search-index
 * and cached in module scope, so subsequent focuses are instant. Search runs
 * fully client-side (no DB) with Turkish-aware diacritic folding.
 *
 * Performance:
 *   - Network: one fetch per session, kicked off at first focus
 *   - CPU: lowercase substring + scoring, ≤5 ms for 427 entries
 *   - DOM: only top 12 matches rendered; rest discarded
 *   - Re-renders: input is debounced 100 ms before query → results
 */

type Entry = {
  slug: string;
  title_tr: string;
  title_en: string;
  tagline: string;
  category: string;
  ingredients: string;
  hero_image: string;
};

let _indexCache: Entry[] | null = null;
let _indexPromise: Promise<Entry[]> | null = null;

async function loadIndex(): Promise<Entry[]> {
  if (_indexCache) return _indexCache;
  if (_indexPromise) return _indexPromise;
  _indexPromise = fetch('/api/search-index')
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
  const tagline = normalize(entry.tagline);
  const ings = normalize(entry.ingredients);
  if (titleTr.startsWith(q)) return 1000;
  if (titleEn.startsWith(q)) return 950;
  if (titleTr.includes(q)) return 800;
  if (titleEn.includes(q)) return 750;
  if (tagline.includes(q)) return 400;
  if (ings.includes(q)) return 200;
  return 0;
}

type Props = { lang: Lang };

export function SearchBar({ lang }: Props) {
  const [query, setQuery] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [index, setIndex] = React.useState<Entry[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load index once on first focus
  const onFocus = React.useCallback(() => {
    setOpen(true);
    if (!loaded) {
      setLoaded(true);
      loadIndex().then((idx) => setIndex(idx));
    }
  }, [loaded]);

  // Debounce input → debounced query
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 100);
    return () => clearTimeout(id);
  }, [query]);

  // Click-outside + Escape closes the panel
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const results = React.useMemo(() => {
    if (debounced.length < 2 || index.length === 0) return [];
    const q = normalize(debounced);
    return index
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.e);
  }, [debounced, index]);

  const showPanel = open && debounced.length >= 2;

  return (
    <div className="border-b border-[#2a1810]/15 bg-[var(--color-paper)]/40 py-5 sm:py-6">
      <div ref={wrapperRef} className="relative mx-auto w-full max-w-3xl px-6">
        <label
          className="group flex w-full cursor-text items-center gap-3 rounded-full border border-[#2a1810]/20 bg-[var(--color-paper)] px-5 py-3.5 text-[#2a1810]/55 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_2px_4px_-1px_rgba(42,24,16,0.08)] transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:-translate-y-0.5 focus-within:border-[var(--color-magenta-deep)]/55 focus-within:text-[#2a1810] focus-within:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_20px_-6px_rgba(42,24,16,0.18)]"
        >
          <SearchIcon className="h-4 w-4 shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder={t('searchPh', lang)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={onFocus}
            aria-label={t('nav_search', lang)}
            className="flex-1 bg-transparent text-sm text-[#2a1810] placeholder:text-[#2a1810]/45 focus:outline-none sm:text-base"
          />
          <span
            aria-hidden
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#2a1810]/20 bg-[var(--color-paper)] text-[var(--color-bordo)]/65 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[var(--color-bordo)]/40 group-focus-within:translate-x-0.5 group-focus-within:border-[var(--color-magenta-deep)] group-focus-within:bg-[var(--color-magenta-deep)] group-focus-within:text-[var(--color-paper)] group-focus-within:shadow-[0_4px_12px_-2px_rgba(149,30,55,0.35)]"
          >
            <SlimArrow className="h-3.5 w-3.5" />
          </span>
        </label>

        {showPanel && (
          <div
            role="listbox"
            aria-label={t('nav_search', lang)}
            className="absolute left-6 right-6 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#2a1810]/15 bg-[var(--color-paper)] shadow-[0_24px_60px_-18px_rgba(42,24,16,0.4)]"
          >
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-[#2a1810]/55">
                  {t('searchEmpty', lang)}
                </p>
              ) : (
                <ul className="divide-y divide-[#2a1810]/10">
                  {results.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={lang === 'en' ? `/recipes/${r.slug}?lang=en` : `/recipes/${r.slug}`}
                        onClick={() => setOpen(false)}
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
                          {r.tagline && (
                            <span className="block truncate text-xs text-[#2a1810]/60">
                              {r.tagline}
                            </span>
                          )}
                        </span>
                        <SlimArrow className="h-4 w-4 shrink-0 text-[#2a1810]/35 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
