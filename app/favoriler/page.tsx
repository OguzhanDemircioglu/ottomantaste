'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/lib/use-favorites';
import { getLang, t, categoryLabel as catLabel, type Lang } from '@/lib/i18n';
import { getStoryHook } from '@/lib/story-hooks';
import { SiteHeaderBar } from '@/components/site-header-bar';
import { RecipeCard, type RecipeCardData } from '@/components/recipe-card';

/**
 * Client-side favorites page.
 *
 * Flow:
 *   1. Read favorite slugs from localStorage (useFavorites hook).
 *   2. Fetch the (cached, immutable) /search-index.json once.
 *   3. Filter to the favorite slugs, project into RecipeCardData,
 *      compute storyHook locally — no Worker call needed.
 *
 * Why client-only: favorites live in localStorage, which the server
 * doesn't see. Previously this page POSTed to /api/recipes-by-slugs
 * just to translate slugs into card data; with the search index now
 * carrying the same fields, the route is gone and Cloudflare's edge
 * cache handles the data load entirely.
 */

interface IndexEntry {
  slug: string;
  title_tr: string;
  title_en: string;
  tagline_tr: string;
  tagline_en: string;
  category: string;
  hero_image: string;
  total_min: number | null;
  serves: number | null;
  step_count: number;
  difficulty: 'kolay' | 'orta' | 'zor' | null;
  main_ingredients: string[];
  period: string | null;
  realm: string | null;
}

let _indexCache: IndexEntry[] | null = null;
let _indexPromise: Promise<IndexEntry[]> | null = null;

async function loadIndex(): Promise<IndexEntry[]> {
  if (_indexCache) return _indexCache;
  if (_indexPromise) return _indexPromise;
  _indexPromise = fetch('/search-index.json')
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => {
      _indexCache = (data as IndexEntry[]) ?? [];
      return _indexCache;
    })
    .catch(() => {
      _indexCache = [];
      return _indexCache;
    });
  return _indexPromise;
}

function entryToCard(entry: IndexEntry, lang: Lang): RecipeCardData {
  return {
    slug: entry.slug,
    title: (lang === 'en' ? entry.title_en : entry.title_tr) || entry.slug,
    tagline: (lang === 'en' ? entry.tagline_en : entry.tagline_tr) || '',
    category: entry.category,
    categoryLabel: catLabel(entry.category, lang),
    hero_image: entry.hero_image || '/recipes/placeholder.jpg',
    total_min: entry.total_min ?? 0,
    serves: entry.serves ?? 0,
    stepCount: entry.step_count,
    difficulty: entry.difficulty ?? undefined,
    mainIngredients: entry.main_ingredients,
    storyHook: getStoryHook({
      slug: entry.slug,
      period: entry.period ?? undefined,
      realm: entry.realm ?? undefined,
      lang,
    }),
  };
}

export default function FavorilerPage() {
  // Read lang from URL on the client (no useSearchParams to keep this leaf simple)
  const [lang, setLang] = React.useState<Lang>('tr');
  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setLang(getLang(sp.get('lang') ?? undefined));
  }, []);

  const { favorites, mounted, count } = useFavorites();
  const [cards, setCards] = React.useState<RecipeCardData[] | null>(null);

  // When favorites set changes (on mount or after toggle), filter the index.
  React.useEffect(() => {
    if (!mounted) return;
    const slugs = [...favorites];
    if (slugs.length === 0) {
      setCards([]);
      return;
    }
    let cancelled = false;
    loadIndex().then((idx) => {
      if (cancelled) return;
      const bySlug = new Map(idx.map((e) => [e.slug, e]));
      const built = slugs
        .map((s) => bySlug.get(s))
        .filter((e): e is IndexEntry => Boolean(e))
        .map((e) => entryToCard(e, lang));
      setCards(built);
    });
    return () => {
      cancelled = true;
    };
  }, [mounted, favorites, lang]);

  return (
    <main>
      <SiteHeaderBar lang={lang} />

      <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
        <Link
          href={lang === 'en' ? '/?lang=en' : '/'}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#2a1810]/65 transition-colors hover:text-[var(--color-magenta-deep)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t('back', lang)}
        </Link>

        <header className="mt-6 border-b-[3px] border-double border-[#2a1810] pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-magenta-deep)]">
            <Heart
              className="-mt-0.5 mr-1.5 inline-block h-3 w-3 fill-current"
              aria-hidden
            />
            {t('nav_favs', lang)}
          </p>
          <h1
            className="mt-3 leading-[0.95] tracking-[-0.02em] text-[#2a1810]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
            }}
          >
            {lang === 'en' ? 'Your saved recipes' : 'Saklanan tarifleriniz'}
          </h1>
          {mounted && (
            <p className="mt-3 text-base text-[#2a1810]/65">
              {count > 0
                ? lang === 'en'
                  ? `${count} recipe${count === 1 ? '' : 's'} on your list.`
                  : `Listenizde ${count} tarif var.`
                : t('noFavs', lang)}
            </p>
          )}
        </header>
      </div>

      {/* Loading state while fetching card details */}
      {mounted && count > 0 && cards === null && (
        <SkeletonGrid />
      )}

      {/* Cards */}
      {cards && cards.length > 0 && (
        <div className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cards.map((card, idx) => (
              <RecipeCard
                key={card.slug}
                recipe={card}
                variant="standard"
                index={idx}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {mounted && count === 0 && (
        <div className="mx-auto max-w-3xl px-6 pb-32 pt-12 text-center">
          <Heart
            className="mx-auto h-10 w-10 text-[#2a1810]/25"
            aria-hidden
          />
          <p
            className="mx-auto mt-6 max-w-prose text-lg text-[#2a1810]/70"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            {t('noFavs', lang)}
          </p>
          <Link
            href={lang === 'en' ? '/?lang=en' : '/'}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#2a1810] px-7 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5"
          >
            {lang === 'en' ? 'Browse recipes' : 'Tariflere göz at'}
          </Link>
        </div>
      )}
    </main>
  );
}

function SkeletonGrid() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--color-paper)] p-3"
            style={{
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 4px -1px rgba(42,24,16,0.10), 0 18px 30px -18px rgba(42,24,16,0.30)',
            }}
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-[#2a1810]/10" />
            <div className="mt-3 h-4 w-3/4 animate-pulse bg-[#2a1810]/10" />
            <div className="mt-2 h-3 w-1/2 animate-pulse bg-[#2a1810]/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
