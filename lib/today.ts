import type { Recipe } from './recipes';
import type { Season } from '@/data/taxonomies';
import {
  EXACT_DAYS,
  RAMADAN_PERIODS,
  BAYRAM_PERIODS,
  type ExactDay,
  type DateRange,
} from '@/data/observances';

/**
 * Türkiye Cumhuriyeti permanent UTC+3 since 2016 (no DST). Cloudflare
 * Workers' `Date` is UTC, so we shift before reading calendar fields.
 * This shift is a one-liner instead of a full timezone library because
 * the offset is fixed and we never need historical timezone math.
 */
const TR_OFFSET_MS = 3 * 60 * 60 * 1000;

/** A Date whose `getUTC*` accessors return values in Europe/Istanbul. */
export function trNow(reference?: Date | number): Date {
  const ms = reference instanceof Date ? reference.getTime() : reference ?? Date.now();
  return new Date(ms + TR_OFFSET_MS);
}

/** ISO-style `YYYY-MM-DD` for the current TR calendar day. */
export function trDateKey(reference?: Date | number): string {
  const d = trNow(reference);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 0-based day of year in TR. Increments at TR midnight. */
export function trDayOfYear(reference?: Date | number): number {
  const d = trNow(reference);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.floor((d.getTime() - start) / 86_400_000);
}

// ─────────────────────────────────────────────────────────────────────────
//  Season helpers
// ─────────────────────────────────────────────────────────────────────────
//  We keep two surface forms because:
//   - the SeasonInterlude chip is keyed by short labels (bahar / guz)
//   - the recipe `season` frontmatter uses full taxonomy (ilkbahar / sonbahar)
// ─────────────────────────────────────────────────────────────────────────

export type SeasonShort = 'bahar' | 'yaz' | 'guz' | 'kis';

/** Display-side current season (for the season-chip interlude). */
export function currentSeasonShort(reference?: Date | number): SeasonShort {
  const m = trNow(reference).getUTCMonth();
  if (m === 11 || m <= 1) return 'kis';
  if (m <= 4) return 'bahar';
  if (m <= 7) return 'yaz';
  return 'guz';
}

const TAX_BY_SHORT: Record<SeasonShort, Season> = {
  bahar: 'ilkbahar',
  yaz:   'yaz',
  guz:   'sonbahar',
  kis:   'kis',
};

/** Taxonomy-form current season — matches `Recipe.season` literals. */
export function currentSeasonTax(reference?: Date | number): Season {
  return TAX_BY_SHORT[currentSeasonShort(reference)];
}

function inRange(date: string, ranges: ReadonlyArray<DateRange>): boolean {
  for (const { start, end } of ranges) {
    if (date >= start && date <= end) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────
//  Today's recipe selection
// ─────────────────────────────────────────────────────────────────────────

/** Why this particular recipe was chosen — drives the widget's eyebrow text. */
export type TodayReason =
  | { kind: 'exact-day'; observance: ExactDay }
  | { kind: 'ramazan' }
  | { kind: 'bayram' }
  | { kind: 'season'; season: Season }
  | { kind: 'fallback' };

export interface TodayPick {
  recipe: Recipe;
  reason: TodayReason;
}

/**
 * Pick today's recipe. Priority, highest → lowest:
 *   1. Exact-date override (Aşure, Mevlid, Nevruz, Yılbaşı…)
 *   2. Inside a Ramazan period → recipes tagged season=ramazan
 *   3. Inside a Bayram period → recipes tagged season=bayram
 *   4. Current astronomical season → season-matched + tum-mevsim
 *   5. Fallback → full pool (cycles deterministically by day-of-year)
 *
 * Pool is restricted to recipes with a local hero image so the floating
 * widget always has something nice to render.
 */
export function pickToday(
  recipes: readonly Recipe[],
  reference?: Date | number,
): TodayPick | null {
  if (recipes.length === 0) return null;

  const withImage = recipes.filter((r) => r.hero_image?.startsWith('/recipes/'));
  const basePool = withImage.length ? withImage : recipes;

  const today = trDateKey(reference);
  const day = trDayOfYear(reference);

  // 1) Exact-date override
  const exact = EXACT_DAYS[today];
  if (exact) {
    const hit = basePool.find((r) => r.slug === exact.slug);
    if (hit) return { recipe: hit, reason: { kind: 'exact-day', observance: exact } };
    // Slug missing — fall through to other rules so we never show nothing.
  }

  // 2) Ramazan ayı
  if (inRange(today, RAMADAN_PERIODS)) {
    const pool = basePool.filter((r) => r.season === 'ramazan');
    if (pool.length) {
      return { recipe: pool[day % pool.length]!, reason: { kind: 'ramazan' } };
    }
  }

  // 3) Bayram günleri
  if (inRange(today, BAYRAM_PERIODS)) {
    const pool = basePool.filter((r) => r.season === 'bayram');
    if (pool.length) {
      return { recipe: pool[day % pool.length]!, reason: { kind: 'bayram' } };
    }
  }

  // 4) Astronomical season (+ tüm-mevsim filler)
  const tax = currentSeasonTax(reference);
  const seasonal = basePool.filter(
    (r) => r.season === tax || r.season === 'tum-mevsim',
  );
  if (seasonal.length >= 12) {
    return { recipe: seasonal[day % seasonal.length]!, reason: { kind: 'season', season: tax } };
  }

  // 5) Final fallback — full pool
  return { recipe: basePool[day % basePool.length]!, reason: { kind: 'fallback' } };
}
