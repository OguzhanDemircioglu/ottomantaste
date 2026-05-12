/**
 * Calendar of Ottoman / Turkish observances used by `lib/today.ts`
 * to override the "Bugünün tarifi" pick on special days and periods.
 *
 * The Hijri calendar drifts ~11 days a year against the Gregorian one,
 * so every relevant date is precomputed per year. Dates are based on
 * Diyanet's published calendar for Türkiye; moon-sighting may shift a
 * day in some places — we accept that drift.
 *
 * Slugs reference `data/recipes/<slug>.mdx`. If a referenced slug is
 * missing at runtime the override is silently skipped — see lib/today.ts.
 */

/** A named single-day observance with a recipe pairing. */
export interface ExactDay {
  /** Recipe slug to show that day. Must exist in data/recipes/ for the
   *  override to apply; otherwise the regular selection runs. */
  slug: string;
  /** Display name shown in the today-widget eyebrow. */
  name: { tr: string; en: string };
}

/** YYYY-MM-DD (TR calendar) → exact recipe override. */
export const EXACT_DAYS: Readonly<Record<string, ExactDay>> = {
  // ─── Aşure günü (10 Muharrem) ──────────────────────────────────────────
  '2025-07-06': { slug: 'asure', name: { tr: 'Aşure günü',  en: 'Day of Ashura' } },
  '2026-06-26': { slug: 'asure', name: { tr: 'Aşure günü',  en: 'Day of Ashura' } },
  '2027-06-15': { slug: 'asure', name: { tr: 'Aşure günü',  en: 'Day of Ashura' } },
  '2028-06-04': { slug: 'asure', name: { tr: 'Aşure günü',  en: 'Day of Ashura' } },
  '2029-05-24': { slug: 'asure', name: { tr: 'Aşure günü',  en: 'Day of Ashura' } },
  '2030-05-13': { slug: 'asure', name: { tr: 'Aşure günü',  en: 'Day of Ashura' } },

  // ─── Mevlid Kandili (12 Rabi al-Awwal) ─────────────────────────────────
  '2025-09-05': { slug: 'mevlid-serbeti', name: { tr: 'Mevlid Kandili', en: 'Mawlid an-Nabi' } },
  '2026-08-26': { slug: 'mevlid-serbeti', name: { tr: 'Mevlid Kandili', en: 'Mawlid an-Nabi' } },
  '2027-08-15': { slug: 'mevlid-serbeti', name: { tr: 'Mevlid Kandili', en: 'Mawlid an-Nabi' } },
  '2028-08-04': { slug: 'mevlid-serbeti', name: { tr: 'Mevlid Kandili', en: 'Mawlid an-Nabi' } },

  // ─── Arefe — bir gün sonra Ramazan/Kurban Bayramı başlar ──────────────
  // Ramazan Bayramı arefesi
  '2025-03-30': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  '2026-03-19': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  '2027-03-09': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  '2028-02-26': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  // Kurban Bayramı arefesi
  '2025-06-05': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  '2026-05-26': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  '2027-05-15': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },
  '2028-05-04': { slug: 'arefe-koftesi', name: { tr: 'Arefe günü', en: 'Eve of the Feast' } },

  // ─── Nevruz (21 Mart) — Türk/İran baharı ───────────────────────────────
  '2025-03-21': { slug: 'acem-pilavi', name: { tr: 'Nevruz',  en: 'Nowruz' } },
  '2026-03-21': { slug: 'acem-pilavi', name: { tr: 'Nevruz',  en: 'Nowruz' } },
  '2027-03-21': { slug: 'acem-pilavi', name: { tr: 'Nevruz',  en: 'Nowruz' } },
  '2028-03-21': { slug: 'acem-pilavi', name: { tr: 'Nevruz',  en: 'Nowruz' } },
  '2029-03-21': { slug: 'acem-pilavi', name: { tr: 'Nevruz',  en: 'Nowruz' } },
  '2030-03-21': { slug: 'acem-pilavi', name: { tr: 'Nevruz',  en: 'Nowruz' } },

  // ─── Hıdırellez (6 Mayıs) — bahar şenliği ──────────────────────────────
  '2025-05-06': { slug: 'dugun-pilavi', name: { tr: 'Hıdırellez', en: 'Hıdırellez' } },
  '2026-05-06': { slug: 'dugun-pilavi', name: { tr: 'Hıdırellez', en: 'Hıdırellez' } },
  '2027-05-06': { slug: 'dugun-pilavi', name: { tr: 'Hıdırellez', en: 'Hıdırellez' } },
  '2028-05-06': { slug: 'dugun-pilavi', name: { tr: 'Hıdırellez', en: 'Hıdırellez' } },

  // ─── Yılbaşı — kutlama yemeği ──────────────────────────────────────────
  '2026-01-01': { slug: 'dugun-pilavi', name: { tr: 'Yılbaşı', en: 'New Year' } },
  '2027-01-01': { slug: 'dugun-pilavi', name: { tr: 'Yılbaşı', en: 'New Year' } },
  '2028-01-01': { slug: 'dugun-pilavi', name: { tr: 'Yılbaşı', en: 'New Year' } },
  '2029-01-01': { slug: 'dugun-pilavi', name: { tr: 'Yılbaşı', en: 'New Year' } },
};

/** Date range, inclusive, YYYY-MM-DD (TR). */
export interface DateRange {
  start: string;
  end: string;
}

/** Ramazan ayı (Diyanet) — bu aralıkta season=ramazan tarifleri öncelikli. */
export const RAMADAN_PERIODS: ReadonlyArray<DateRange> = [
  { start: '2025-03-01', end: '2025-03-30' },
  { start: '2026-02-18', end: '2026-03-19' },
  { start: '2027-02-08', end: '2027-03-09' },
  { start: '2028-01-28', end: '2028-02-26' },
  { start: '2029-01-16', end: '2029-02-14' },
  { start: '2030-01-06', end: '2030-02-04' },
];

/** Ramazan + Kurban Bayramı aralıkları — season=bayram tarifleri öncelikli. */
export const BAYRAM_PERIODS: ReadonlyArray<DateRange> = [
  // Ramazan Bayramı (1–3 Şevval)
  { start: '2025-03-31', end: '2025-04-02' },
  { start: '2026-03-20', end: '2026-03-22' },
  { start: '2027-03-10', end: '2027-03-12' },
  { start: '2028-02-27', end: '2028-02-29' },
  { start: '2029-02-15', end: '2029-02-17' },
  { start: '2030-02-04', end: '2030-02-06' },

  // Kurban Bayramı (10–13 Zilhicce)
  { start: '2025-06-06', end: '2025-06-09' },
  { start: '2026-05-27', end: '2026-05-30' },
  { start: '2027-05-16', end: '2027-05-19' },
  { start: '2028-05-05', end: '2028-05-08' },
  { start: '2029-04-24', end: '2029-04-27' },
  { start: '2030-04-13', end: '2030-04-16' },
];
