import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllRecipes } from '@/lib/recipes';
import { localized } from '@/lib/title';
import { REGIONS } from '@/data/taxonomies';
import { getLang, t, type Lang } from '@/lib/i18n';
import { SiteHeaderBar } from '@/components/site-header-bar';
import { HaritaMap, type RegionNode } from '@/components/harita-map';

export const metadata: Metadata = {
  title: 'Harita — OttomanTaste',
  description:
    'Osmanlı mutfağının coğrafi külliyatı — Anadolu, Rumeli, Şam ve daha fazlası bölge bölge tarif.',
};

const REGION_NAMES: Record<string, Record<Lang, string>> = {
  istanbul:  { tr: 'İstanbul',  en: 'Istanbul' },
  rumeli:    { tr: 'Rumeli',    en: 'Rumelia' },
  anadolu:   { tr: 'Anadolu',   en: 'Anatolia' },
  akdeniz:   { tr: 'Akdeniz',   en: 'Mediterranean' },
  karadeniz: { tr: 'Karadeniz', en: 'Black Sea' },
  guneydogu: { tr: 'Güneydoğu', en: 'Southeast' },
  misir:     { tr: 'Mısır',     en: 'Egypt' },
  sam:       { tr: 'Şam',       en: 'Levant' },
};

/**
 * Percent-of-map x/y for each region pin, calibrated against the
 * "Ottoman Empire and Vassal States, 16-17 centuries" satellite
 * backdrop (800×585). Both axes are 0-100 percentages of the image.
 */
const REGION_COORDS: Record<string, { x: number; y: number }> = {
  rumeli:    { x: 40, y: 20 },  // central Balkans (Belgrade / Wallachia)
  istanbul:  { x: 47, y: 25 },  // İstanbul (label visible on the map)
  karadeniz: { x: 67, y: 22 },  // Black Sea Anatolian coast (Trabzon)
  anadolu:   { x: 58, y: 30 },  // central Anatolia (Ankara / Konya)
  akdeniz:   { x: 53, y: 35 },  // S. Anatolian Mediterranean coast
  guneydogu: { x: 67, y: 38},  // SE Turkey (Antep / Urfa)
  sam:       { x: 74, y: 41 },  // Damaskus (label visible)
  misir:     { x: 50, y: 50 },  // Kairo (label visible — filtered when empty)
};

const CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  corba:  { tr: 'Çorba',  en: 'Soup' },
  et:     { tr: 'Et',     en: 'Meat' },
  kebap:  { tr: 'Kebap',  en: 'Kebab' },
  sarma:  { tr: 'Sarma',  en: 'Wraps' },
  pilav:  { tr: 'Pilav',  en: 'Pilaf' },
  meze:   { tr: 'Meze',   en: 'Meze' },
  borek:  { tr: 'Börek',  en: 'Pastry' },
  tatli:  { tr: 'Tatlı',  en: 'Dessert' },
  serbet: { tr: 'Şerbet', en: 'Sherbet' },
  helva:  { tr: 'Helva',  en: 'Halva' },
};

export default async function HaritaPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; cal?: string }>;
}) {
  const sp = await searchParams;
  const lang = getLang(sp.lang);
  const calibrate = sp.cal === '1';
  const all = getAllRecipes();

  // Normally only render regions that carry recipes (empty regions like
  // Mısır are dropped). In calibration mode we keep ALL 8 so they can be
  // dragged into position even when their corpus is empty.
  const regions: RegionNode[] = REGIONS
    .map((id): RegionNode | null => {
      const inRegion = all.filter((r) => r.region === id);
      if (inRegion.length === 0 && !calibrate) return null;
      const coords = REGION_COORDS[id] ?? { x: 50, y: 30 };
      return {
        id,
        name: REGION_NAMES[id]?.[lang] ?? id,
        x: coords.x,
        y: coords.y,
        recipes: inRegion.slice(0, 30).map((r) => ({
          slug: r.slug,
          title: localized(r.title, r.slug, lang),
          category: CATEGORY_LABELS[r.category as string]?.[lang] ?? (r.category as string),
          hero_image: r.hero_image,
        })),
      };
    })
    .filter((r): r is RegionNode => r !== null);

  return (
    <main>
      <SiteHeaderBar lang={lang} />

      <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-6">
        <Link
          href={lang === 'en' ? '/?lang=en' : '/'}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#2a1810]/65 transition-colors hover:text-[var(--color-magenta-deep)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t('back', lang)}
        </Link>

        <header className="mt-6 border-b-[3px] border-double border-[#2a1810] pb-6">
          {/* Eski h1 ("Mutfak, haritalanmış.") kaldırıldı — eyebrow artık
              ana başlık rolünü üstleniyor ve belirgin biçimde büyütüldü. */}
          <h1
            className="font-mono uppercase tracking-[0.22em] leading-[1.05] text-[var(--color-magenta-deep)]"
            style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.75rem)' }}
          >
            {lang === 'en' ? 'Empire · Geographic catalogue' : 'İmparatorluk · Coğrafi külliyat'}
          </h1>
          <p
            className="mt-4 text-base text-[#2a1810]/65 sm:text-lg"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            {lang === 'en'
              ? 'Tap a region — its recipes appear in a side panel. Each city carries its own kitchen.'
              : 'Bir bölgeye dokunun — tarifleri yandan açılan sahifede çıksın.'}
          </p>
        </header>
      </div>

      <HaritaMap regions={regions} lang={lang} calibrate={calibrate} />
    </main>
  );
}
