import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { getAllRecipes, filterRecipes } from '@/lib/recipes';
import { localized } from '@/lib/title';
import { CATEGORIES, type Category } from '@/data/taxonomies';
import { getLang, t, categoryLabel as catLabel } from '@/lib/i18n';
import { getStoryHook } from '@/lib/story-hooks';
import { pickToday, currentSeasonShort } from '@/lib/today';
import { SiteHeaderBar } from '@/components/site-header-bar';
import { Masthead } from '@/components/masthead';
import { SearchBar } from '@/components/search-bar';
import { FilterTabs } from '@/components/filter-tabs';
import { MagazineGrid } from '@/components/magazine-grid';
import { AlphabetIndex } from '@/components/alphabet-index';
import { TodayWidget } from '@/components/today-widget';
import { FeedbackSection } from '@/components/feedback-section';
import type { RecipeCardData } from '@/components/recipe-card';

type SearchParams = { category?: string; lang?: string; p?: string };

const isCategory = (v: string | undefined): v is Category =>
  !!v && (CATEGORIES as readonly string[]).includes(v);

/** Recipes per page — keeps initial HTML payload bounded. */
const PAGE_SIZE = 50;

function clampPage(value: string | undefined, max: number): number {
  const n = Number.parseInt(value ?? '1', 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, Math.max(1, max));
}

function buildHrefFor(currentLang: 'tr' | 'en') {
  return (slug: string | undefined) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (currentLang === 'en') params.set('lang', 'en');
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  };
}

function pickMainIngredients(r: ReturnType<typeof getAllRecipes>[number]): string[] {
  const list = r.ingredients ?? [];
  const filtered = list.filter((ing) => {
    const g = (ing.group ?? '').toLowerCase();
    return !g.includes('süsle') && !g.includes('garn');
  });
  const out: string[] = [];
  const seen = new Set<string>();
  for (const ing of filtered) {
    const cleaned = (ing.name ?? '').replace(/\s*\([^)]*\)\s*/g, '').trim();
    const head = cleaned.split(/[,;·]/)[0]?.trim() ?? cleaned;
    if (head && !seen.has(head.toLowerCase())) {
      seen.add(head.toLowerCase());
      out.push(head);
    }
    if (out.length >= 4) break;
  }
  return out;
}

function toCard(
  r: ReturnType<typeof getAllRecipes>[number],
  lang: 'tr' | 'en',
): RecipeCardData {
  const diff = r.difficulty as 'kolay' | 'orta' | 'zor' | undefined;
  return {
    slug: r.slug,
    title: localized(r.title, r.slug, lang),
    tagline: localized(r.tagline, '', lang),
    category: r.category as string,
    categoryLabel: catLabel(r.category as string, lang),
    hero_image: r.hero_image || '/recipes/placeholder.jpg',
    total_min: r.total_min,
    serves: r.serves,
    stepCount: r.steps?.length ?? 0,
    difficulty: diff,
    mainIngredients: pickMainIngredients(r),
    storyHook: getStoryHook({
      slug: r.slug,
      period: r.period as string | undefined,
      realm: r.realm as string | undefined,
      lang,
    }),
  };
}

function groupAlphabetically(
  recipes: Array<{ slug: string; title: string }>,
): Array<{ letter: string; recipes: Array<{ slug: string; title: string }> }> {
  const collator = new Intl.Collator('tr', { sensitivity: 'base' });
  const sorted = [...recipes].sort((a, b) => collator.compare(a.title, b.title));
  const groups = new Map<string, Array<{ slug: string; title: string }>>();
  for (const r of sorted) {
    const first = r.title[0]?.toLocaleUpperCase('tr') ?? '#';
    const arr = groups.get(first) ?? [];
    arr.push(r);
    groups.set(first, arr);
  }
  return Array.from(groups.entries()).map(([letter, recipes]) => ({ letter, recipes }));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const lang = getLang(sp.lang);
  const all = getAllRecipes();

  const activeCategory = isCategory(sp.category) ? sp.category : undefined;
  const filtered = filterRecipes(all, activeCategory ? { category: activeCategory } : {});

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = clampPage(sp.p, totalPages);
  const start = 0;
  const end = page * PAGE_SIZE;     // cumulative — feels like "show more"
  const visible = filtered.slice(start, end);
  const hasMore = end < filtered.length;

  const counts = new Map<string, number>();
  for (const r of all) counts.set(r.category as string, (counts.get(r.category as string) ?? 0) + 1);
  const tabs = CATEGORIES.map((slug) => ({
    slug,
    label: catLabel(slug, lang),
    count: counts.get(slug) ?? 0,
  }));

  const cards = visible.map((r) => toCard(r, lang));
  const indexGroups = groupAlphabetically(
    all.map((r) => ({ slug: r.slug, title: localized(r.title, r.slug, lang) })),
  );

  const todayPick = pickToday(all);
  const todayCard = todayPick
    ? {
        slug: todayPick.recipe.slug,
        title: localized(todayPick.recipe.title, todayPick.recipe.slug, lang),
        category: todayPick.recipe.category as string,
        categoryLabel: catLabel(todayPick.recipe.category as string, lang),
        hero_image: todayPick.recipe.hero_image,
        total_min: todayPick.recipe.total_min,
      }
    : null;

  // "Show more" = bump the page param, preserve other params
  const moreParams = new URLSearchParams();
  if (activeCategory) moreParams.set('category', activeCategory);
  if (lang === 'en') moreParams.set('lang', 'en');
  moreParams.set('p', String(page + 1));
  const moreHref = `/?${moreParams.toString()}#more`;

  return (
    <main>
      <SiteHeaderBar lang={lang} />
      <Masthead total={all.length} lang={lang} />
      <SearchBar lang={lang} />
      <FilterTabs
        tabs={tabs}
        active={activeCategory}
        totalAll={all.length}
        allLabel={t('all', lang)}
        hrefFor={buildHrefFor(lang)}
      />

      <MagazineGrid recipes={cards} season={currentSeasonShort()} lang={lang} />

      {hasMore && (
        <div id="more" className="mx-auto -mt-8 mb-16 flex justify-center px-6">
          <Link
            href={moreHref}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#2a1810]/25 bg-[var(--color-paper)] px-7 py-3.5 text-sm font-semibold text-[#2a1810] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:bg-[#2a1810] hover:text-[var(--color-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-magenta-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          >
            {t('loadMore', lang)}
            <ArrowDown
              className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
              aria-hidden
            />
            <span className="font-mono text-[11px] text-[#2a1810]/55 group-hover:text-[var(--color-paper)]/65">
              {visible.length}/{filtered.length}
            </span>
          </Link>
        </div>
      )}

      <FeedbackSection lang={lang} />
      <AlphabetIndex groups={indexGroups} lang={lang} />

      {todayCard && <TodayWidget recipe={todayCard} reason={todayPick?.reason} lang={lang} />}
    </main>
  );
}
