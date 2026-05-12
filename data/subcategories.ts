/**
 * Sub-category mapping — derived from slug + frontmatter at runtime.
 * Avoids editing 427 MDX files. Add finer rules over time.
 */

import type { Recipe } from '@/lib/recipes';

export interface SubcategoryDef {
  slug: string;
  /** Display labels */
  label: { tr: string; en: string };
  /** Category this sub belongs to */
  category: string;
  /** Optional emoji / glyph for the bento grid */
  glyph: string;
}

/** Map (parent category) → sub-categories */
export const SUBCATEGORIES: SubcategoryDef[] = [
  // ─────────── ET ───────────
  { slug: 'kebap', label: { tr: 'Kebap', en: 'Kebab' }, category: 'et', glyph: '🍖' },
  { slug: 'kofte', label: { tr: 'Köfte', en: 'Meatball' }, category: 'et', glyph: '🥩' },
  { slug: 'yahni', label: { tr: 'Yahni', en: 'Stew' }, category: 'et', glyph: '🍲' },
  { slug: 'kulbasti', label: { tr: 'Külbastı', en: 'Grill' }, category: 'et', glyph: '🔥' },
  { slug: 'yumurta', label: { tr: 'Yumurta', en: 'Eggs' }, category: 'et', glyph: '🥚' },
  { slug: 'saraylι-et', label: { tr: 'Saraylı Et', en: 'Palace Meat' }, category: 'et', glyph: '👑' },

  // ─────────── ÇORBA ───────────
  { slug: 'terbiyeli-corba', label: { tr: 'Terbiyeli', en: 'Egg-Lemon Soup' }, category: 'corba', glyph: '🥣' },
  { slug: 'bakliyat-corbasi', label: { tr: 'Bakliyat', en: 'Legume Soup' }, category: 'corba', glyph: '🌱' },
  { slug: 'sebze-corbasi', label: { tr: 'Sebze', en: 'Vegetable Soup' }, category: 'corba', glyph: '🥬' },
  { slug: 'saray-corbasi', label: { tr: 'Saray Çorbası', en: 'Palace Soup' }, category: 'corba', glyph: '✨' },

  // ─────────── BÖREK / HAMUR ───────────
  { slug: 'borek-cesidi', label: { tr: 'Börek', en: 'Pastry' }, category: 'borek', glyph: '🥟' },
  { slug: 'manti', label: { tr: 'Mantı', en: 'Dumplings' }, category: 'borek', glyph: '🥟' },
  { slug: 'pide', label: { tr: 'Pide', en: 'Flatbread' }, category: 'borek', glyph: '🍞' },
  { slug: 'ekmek', label: { tr: 'Ekmek', en: 'Bread' }, category: 'borek', glyph: '🍞' },
  { slug: 'kurabiye', label: { tr: 'Kurabiye', en: 'Cookie' }, category: 'borek', glyph: '🍪' },

  // ─────────── PİLAV ───────────
  { slug: 'sade-pilav', label: { tr: 'Sade Pilav', en: 'Plain Pilaf' }, category: 'pilav', glyph: '🍚' },
  { slug: 'etli-pilav', label: { tr: 'Etli Pilav', en: 'Meat Pilaf' }, category: 'pilav', glyph: '🥘' },
  { slug: 'sebzeli-pilav', label: { tr: 'Sebzeli', en: 'Vegetable Pilaf' }, category: 'pilav', glyph: '🌿' },
  { slug: 'tatlimsi-pilav', label: { tr: 'Tatlımsı', en: 'Sweet Pilaf' }, category: 'pilav', glyph: '🍯' },

  // ─────────── SARMA / DOLMA ───────────
  { slug: 'yaprak-sarma', label: { tr: 'Yaprak', en: 'Vine Leaf' }, category: 'sarma', glyph: '🍃' },
  { slug: 'sebze-dolma', label: { tr: 'Sebze Dolma', en: 'Stuffed Veg' }, category: 'sarma', glyph: '🍆' },
  { slug: 'meyve-dolma', label: { tr: 'Meyve Dolma', en: 'Stuffed Fruit' }, category: 'sarma', glyph: '🍑' },
  { slug: 'etsiz-dolma', label: { tr: 'Etsiz', en: 'Vegan Stuffed' }, category: 'sarma', glyph: '🌱' },

  // ─────────── TATLI ───────────
  { slug: 'serbetli-tatli', label: { tr: 'Şerbetli', en: 'Syrup Soaked' }, category: 'tatli', glyph: '💧' },
  { slug: 'sutlu-tatli', label: { tr: 'Sütlü', en: 'Milky' }, category: 'tatli', glyph: '🥛' },
  { slug: 'meyveli-tatli', label: { tr: 'Meyveli', en: 'Fruit' }, category: 'tatli', glyph: '🍓' },
  { slug: 'lokum-akide', label: { tr: 'Lokum & Akide', en: 'Confectionery' }, category: 'tatli', glyph: '🍬' },
  { slug: 'dondurma', label: { tr: 'Dondurma', en: 'Ice Cream' }, category: 'tatli', glyph: '🍨' },

  // ─────────── HELVA ───────────
  { slug: 'saray-helvasi', label: { tr: 'Saray Helvası', en: 'Palace Halva' }, category: 'helva', glyph: '👑' },
  { slug: 'sokak-helvasi', label: { tr: 'Sokak Helvası', en: 'Street Halva' }, category: 'helva', glyph: '🛍' },
  { slug: 'yoresel-helva', label: { tr: 'Yöresel', en: 'Regional' }, category: 'helva', glyph: '📍' },

  // ─────────── ŞERBET ───────────
  { slug: 'meyve-serbeti', label: { tr: 'Meyveli', en: 'Fruit' }, category: 'serbet', glyph: '🍒' },
  { slug: 'cicek-serbeti', label: { tr: 'Çiçekli', en: 'Floral' }, category: 'serbet', glyph: '🌸' },
  { slug: 'sifa-serbeti', label: { tr: 'Şifa', en: 'Healing' }, category: 'serbet', glyph: '🌿' },
  { slug: 'ramazan-serbeti', label: { tr: 'Ramazan', en: 'Ramadan' }, category: 'serbet', glyph: '🌙' },

  // ─────────── MEZE ───────────
  { slug: 'zeytinyagli', label: { tr: 'Zeytinyağlı', en: 'Olive Oil' }, category: 'meze', glyph: '🫒' },
  { slug: 'soguk-meze', label: { tr: 'Soğuk Meze', en: 'Cold Meze' }, category: 'meze', glyph: '🥗' },
  { slug: 'recel-tursu', label: { tr: 'Reçel & Turşu', en: 'Jam & Pickle' }, category: 'meze', glyph: '🫙' },
];

/**
 * Derive sub-category for a recipe by slug pattern.
 * Returns slug of subcategory or null if no match.
 */
export function getSubcategory(recipe: Pick<Recipe, 'slug' | 'category'>): string | null {
  const s = recipe.slug;
  const c = recipe.category;

  if (c === 'et') {
    if (/-yahnisi$|-yahni$/.test(s)) return 'yahni';
    if (/-koftesi?$|-kofte$/.test(s)) return 'kofte';
    if (/-kulbastisi?$/.test(s)) return 'kulbasti';
    if (/yumurta|cilbir/.test(s)) return 'yumurta';
    if (/-kebabi$|-kebap$|kavurma|sis-/.test(s)) return 'kebap';
    return 'saraylι-et';
  }
  if (c === 'kebap') return 'kebap';

  if (c === 'corba') {
    if (/terbiyeli|eksili|lebeniye|cesm-i/.test(s)) return 'terbiyeli-corba';
    if (/mercimek|nohut|mas-|bulgur|toyga|tarhana/.test(s)) return 'bakliyat-corbasi';
    if (/patlican|kavata|ispanak|karalahana|sebze/.test(s)) return 'sebze-corbasi';
    return 'saray-corbasi';
  }

  if (c === 'borek') {
    if (/manti|piruhi|tatar/.test(s)) return 'manti';
    if (/-pidesi?$|pide-/.test(s)) return 'pide';
    if (/^pide$|simit|fodla|ekmek|bazlama|gevrek|yufka|girde-nan|nohut-ekme|mirahor|has-/.test(s))
      return 'ekmek';
    if (/-boregi$|-borek$|saray-boregi|talas|sigara|kol|puf|tepsi|muska|tatar|kapak|kenarli|sut|nemse|paca-bor|karadeniz/.test(s))
      return 'borek-cesidi';
    return 'borek-cesidi';
  }

  if (c === 'pilav') {
    if (/^etli|kavurmali|luhum|kuzu|kazi|sigir/.test(s)) return 'etli-pilav';
    if (/patlican|sebze|enginar|ic-pilav|baklali/.test(s)) return 'sebzeli-pilav';
    if (/dutlu|tatlim|safran|muzaffer/.test(s)) return 'tatlimsi-pilav';
    return 'sade-pilav';
  }

  if (c === 'sarma') {
    if (/yaprak|asma/.test(s)) return 'yaprak-sarma';
    if (/kavun|ayva|elma|kayisi|erik|karpuz/.test(s)) return 'meyve-dolma';
    if (/yalanci|zeytinyagli|patlican|kabak|biber|salgam|lahana/.test(s) && !/etli/.test(s))
      return 'etsiz-dolma';
    return 'sebze-dolma';
  }

  if (c === 'tatli') {
    if (/baklava|kunefe|tulumba|sekerpare|lokma|kalbur|halka|sambaba|kemalpasa|sobiyet|sarayli|kaymak-baklavasi|bulbul|sarigi|hanim|dilber|nuriye|samsa|dolangel|nevzine|oklava|oturma|kadayif|revani|vezir|ekmek-kadayifi/.test(s))
      return 'serbetli-tatli';
    if (/sutlac|muhallebi|keskul|tavuk-gogsu|kazandibi|paluze|memuniye|frenk-arpa|visneli-ekmek/.test(s))
      return 'sutlu-tatli';
    if (/asure|gullac|zerde|ayva-tatli|erik-dolmasi-tatli|mandalina|cezerye|laz-bor|nazli/.test(s))
      return 'meyveli-tatli';
    if (/lokum|akanes|gulbeseker|gulkand|kofter|pestil/.test(s)) return 'lokum-akide';
    if (/dondurma|kar-dondurmasi|sutsuz/.test(s)) return 'dondurma';
    return 'serbetli-tatli';
  }

  if (c === 'helva') {
    if (/saray|hakani|sabuniye|hosmerim/.test(s)) return 'saray-helvasi';
    if (/tahin|gaziler|gil|hus[üu]m|senir|ninem/.test(s)) return 'yoresel-helva';
    return 'sokak-helvasi';
  }

  if (c === 'serbet') {
    if (/-hosafi|hosaf|fuka|bal-|pekmez|sira/.test(s)) return 'sifa-serbeti';
    if (/menekse|fulya|yasemin|gul-|amber/.test(s)) return 'cicek-serbeti';
    if (/ramazan|mevlid|demirhindi|sirkencubin|salep|boza/.test(s)) return 'ramazan-serbeti';
    return 'meyve-serbeti';
  }

  if (c === 'meze') {
    if (/-receli|-tursusu|-tursu|-eksisi|nardenk|pekmez|macunu/.test(s)) return 'recel-tursu';
    if (/zeytinyagli|enginar|salma|fava|pilaki|imam-bayildi/.test(s)) return 'zeytinyagli';
    return 'soguk-meze';
  }

  return null;
}

/**
 * Get all subcategories belonging to a given parent category.
 */
export function subcategoriesOf(category: string): SubcategoryDef[] {
  return SUBCATEGORIES.filter((s) => s.category === category);
}

/**
 * Find a subcategory definition by slug.
 */
export function getSubcategoryDef(slug: string): SubcategoryDef | undefined {
  return SUBCATEGORIES.find((s) => s.slug === slug);
}
