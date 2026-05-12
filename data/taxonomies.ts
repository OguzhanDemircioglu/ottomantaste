/**
 * Recipe taxonomies — single source of truth for filtering,
 * navigation and i18n labels. Imported everywhere; recipe
 * frontmatter validates against these unions at build time.
 */

// ──────────────────────────────────────────────────────────
// Categories — what kind of dish
// ──────────────────────────────────────────────────────────
export const CATEGORIES = [
  'corba',     // Soup
  'et',        // Meat dish
  'sarma',     // Wraps & stuffed (dolma, sarma)
  'pilav',     // Pilaf / rice
  'kebap',     // Kebab
  'meze',      // Meze / appetizer
  'borek',     // Pastry / börek
  'tatli',     // Dessert (general)
  'serbet',    // Sherbet / drink
  'helva',     // Halva
] as const;

export type Category = (typeof CATEGORIES)[number];

// ──────────────────────────────────────────────────────────
// Period — historical era
// ──────────────────────────────────────────────────────────
export const PERIODS = [
  'erken',     // Early Ottoman (XIII-XV. yy)
  'klasik',    // Classical (XV-XVI. yy, Fatih → Kanuni)
  'lale',      // Tulip Era (1718-1730)
  'tanzimat',  // Tanzimat (1839-1876)
  'gec',       // Late Ottoman (1876-1923)
] as const;

export type Period = (typeof PERIODS)[number];

// ──────────────────────────────────────────────────────────
// Realm — social class / origin
// ──────────────────────────────────────────────────────────
export const REALMS = [
  'saray',     // Palace cuisine
  'halk',      // Common folk cuisine
  'tekke',     // Lodge / dervish kitchens
] as const;

export type Realm = (typeof REALMS)[number];

// ──────────────────────────────────────────────────────────
// Season — when traditionally served
// ──────────────────────────────────────────────────────────
export const SEASONS = [
  'tum-mevsim', // All seasons
  'ilkbahar',   // Spring
  'yaz',        // Summer
  'sonbahar',   // Autumn
  'kis',        // Winter
  'ramazan',    // Ramadan
  'dugun',      // Wedding / celebration
  'bayram',     // Religious holiday
] as const;

export type Season = (typeof SEASONS)[number];

// ──────────────────────────────────────────────────────────
// Difficulty
// ──────────────────────────────────────────────────────────
export const DIFFICULTIES = ['kolay', 'orta', 'zor'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

// ──────────────────────────────────────────────────────────
// Region — origin region within Ottoman geography
// ──────────────────────────────────────────────────────────
export const REGIONS = [
  'istanbul',
  'rumeli',     // Balkans
  'anadolu',    // Anatolia
  'akdeniz',    // Mediterranean coast
  'karadeniz',  // Black Sea
  'guneydogu',  // Southeast (Antep, Urfa, Maraş)
  'misir',      // Egyptian / North African Ottoman
  'sam',        // Damascus / Levant
] as const;

export type Region = (typeof REGIONS)[number];
