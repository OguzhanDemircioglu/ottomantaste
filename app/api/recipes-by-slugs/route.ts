import { NextResponse } from 'next/server';
import { getAllRecipes } from '@/lib/recipes';
import { localized } from '@/lib/title';
import { getStoryHook } from '@/lib/story-hooks';

export const runtime = 'nodejs';

const CATEGORY_LABELS: Record<string, Record<'tr' | 'en', string>> = {
  corba:  { tr: 'Çorbalar', en: 'Soups' },
  et:     { tr: 'Et',       en: 'Meat' },
  kebap:  { tr: 'Kebap',    en: 'Kebabs' },
  sarma:  { tr: 'Sarma',    en: 'Wraps' },
  pilav:  { tr: 'Pilav',    en: 'Pilaf' },
  meze:   { tr: 'Meze',     en: 'Meze' },
  borek:  { tr: 'Börek',    en: 'Pastries' },
  tatli:  { tr: 'Tatlı',    en: 'Desserts' },
  serbet: { tr: 'Şerbet',   en: 'Sherbets' },
  helva:  { tr: 'Helva',    en: 'Halva' },
};

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

/**
 * POST /api/recipes-by-slugs
 * Body: { slugs: string[], lang?: 'tr' | 'en' }
 * Returns the matching RecipeCardData entries in slug order.
 *
 * Used by the /favoriler client page which holds the slug list in
 * localStorage. We avoid sending the full 427-recipe payload to the browser.
 */
export async function POST(req: Request) {
  let body: { slugs?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const slugs = Array.isArray(body.slugs)
    ? (body.slugs.filter((s) => typeof s === 'string') as string[])
    : [];
  const lang: 'tr' | 'en' = body.lang === 'en' ? 'en' : 'tr';

  const all = getAllRecipes();
  const bySlug = new Map(all.map((r) => [r.slug, r]));

  const cards = slugs
    .map((s) => bySlug.get(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({
      slug: r.slug,
      title: localized(r.title, r.slug, lang),
      tagline: localized(r.tagline, '', lang),
      category: r.category as string,
      categoryLabel: CATEGORY_LABELS[r.category as string]?.[lang] ?? (r.category as string),
      hero_image: r.hero_image || '/recipes/placeholder.jpg',
      total_min: r.total_min,
      serves: r.serves,
      stepCount: r.steps?.length ?? 0,
      difficulty: r.difficulty as 'kolay' | 'orta' | 'zor' | undefined,
      mainIngredients: pickMainIngredients(r),
      storyHook: getStoryHook({
        slug: r.slug,
        period: r.period as string | undefined,
        realm: r.realm as string | undefined,
        lang,
      }),
    }));

  return NextResponse.json({ ok: true, cards });
}
