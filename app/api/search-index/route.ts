import { NextResponse } from 'next/server';
import { getAllRecipes } from '@/lib/recipes';
import { localized } from '@/lib/title';

export const runtime = 'nodejs';

/** Static-shape index built once per server start; cached by Next route cache. */
type Entry = {
  slug: string;
  title_tr: string;
  title_en: string;
  tagline: string;
  category: string;
  ingredients: string;  // joined names — single string for cheap substring scoring
  hero_image: string;
};

let CACHED: Entry[] | null = null;

/**
 * GET /api/search-index
 * Returns a compact JSON array (~100KB) the client uses for substring search.
 * Cached after first build inside this process — single read of all recipes.
 * Long Cache-Control because content only changes on deploy.
 */
export async function GET() {
  if (!CACHED) {
    const all = getAllRecipes();
    CACHED = all.map((r) => ({
      slug: r.slug,
      title_tr: localized(r.title, r.slug, 'tr'),
      title_en: localized(r.title, r.slug, 'en'),
      tagline:
        localized(r.tagline, '', 'tr') || localized(r.tagline, '', 'en') || '',
      category: r.category as string,
      ingredients: (r.ingredients ?? [])
        .map((i) => (i.name ?? '').replace(/\s*\([^)]*\)\s*/g, '').trim())
        .filter(Boolean)
        .join(' · '),
      hero_image: r.hero_image,
    }));
  }
  return NextResponse.json(CACHED, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600' },
  });
}
