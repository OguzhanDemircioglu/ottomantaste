/**
 * Interlude cards — colorful editorial breaks slipped between recipe cycles
 * to keep the magazine spread feeling alive. Three flavors:
 *   - SeasonInterlude   : a chip of the current season + 2 recipe suggestions
 *   - GlossaryInterlude : an Ottoman cooking term + period definition
 *   - QuoteInterlude    : a head-cook (aşçıbaşı) era quote
 *
 * Each draws a distinct accent color so the spread has rhythm, not monotony.
 */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categoryColor } from '@/lib/category-colors';

// ─── Season ──────────────────────────────────────────────────────────────
type SeasonProps = {
  /** Current season — derived server-side from `new Date().getMonth()` */
  season: 'bahar' | 'yaz' | 'guz' | 'kis';
  picks: Array<{ slug: string; title: string; category: string }>;
};

const SEASON_META: Record<
  SeasonProps['season'],
  { label: string; subtitle: string; var: string }
> = {
  bahar: { label: 'Bahar', subtitle: 'Mart — Mayıs', var: '--season-bahar' },
  yaz:   { label: 'Yaz',   subtitle: 'Haziran — Ağustos', var: '--season-yaz' },
  guz:   { label: 'Güz',   subtitle: 'Eylül — Kasım',     var: '--season-guz' },
  kis:   { label: 'Kış',   subtitle: 'Aralık — Şubat',    var: '--season-kis' },
};

export function SeasonInterlude({ season, picks }: SeasonProps) {
  const meta = SEASON_META[season];
  const accent = `var(${meta.var})`;
  return (
    <aside
      aria-label={`${meta.label} mevsimi notu`}
      className="relative overflow-hidden border-y-[2px] border-double border-[#2a1810]/30 px-6 py-10 sm:px-12 sm:py-14"
      style={{
        background: `linear-gradient(120deg, ${accent} 0%, transparent 70%)`,
        // Soft veil so text stays legible
        backgroundColor: 'color-mix(in srgb, var(--color-paper) 88%, transparent)',
      }}
    >
      {/* Big season letter as decoration */}
      <span
        aria-hidden
        className="absolute -right-4 -top-6 select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(8rem, 18vw, 18rem)',
          color: accent,
          opacity: 0.18,
          lineHeight: 1,
        }}
      >
        {meta.label[0]}
      </span>

      <div className="relative grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Mevsim notu · {meta.subtitle}
          </p>
          <h3
            className="mt-3 leading-[1] tracking-[-0.02em] text-[#2a1810]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {meta.label}, sofranın renklerini değiştirir.
          </h3>
        </div>
        <ul className="space-y-2 lg:col-span-5">
          {picks.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/recipes/${p.slug}`}
                className="group flex items-center justify-between gap-4 border-b border-[#2a1810]/20 pb-2 text-[#2a1810] transition-colors hover:border-[#2a1810]"
              >
                <span
                  className="text-xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {p.title}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// ─── Glossary ────────────────────────────────────────────────────────────
type GlossaryProps = { term: string; period: string; definition: string; etymology?: string };

export function GlossaryInterlude({ term, period, definition, etymology }: GlossaryProps) {
  return (
    <aside
      aria-label={`Sözlük: ${term}`}
      className="border-y-[2px] border-double border-[var(--color-magenta-deep)] px-6 py-10 sm:px-12 sm:py-12"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-magenta) 10%, var(--color-paper)) 0%, var(--color-paper) 100%)',
      }}
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-magenta-deep)]"
        >
          Sözlük · {period}
        </p>
        <p className="mt-4 flex items-baseline gap-3">
          <span
            className="text-[#2a1810]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {term}
          </span>
          <span
            className="text-base text-[var(--color-magenta-deep)]"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            (isim)
          </span>
        </p>
        <p
          className="mt-4 text-lg leading-[1.6] text-[#2a1810]/85"
        >
          {definition}
        </p>
        {etymology && (
          <p
            className="mt-3 text-sm text-[#2a1810]/55"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            Köken: {etymology}
          </p>
        )}
      </div>
    </aside>
  );
}

// ─── Quote ───────────────────────────────────────────────────────────────
type QuoteProps = {
  text: string;
  speaker: string;
  /** Optional category — tints the accent. */
  categorySlug?: string;
};

export function QuoteInterlude({ text, speaker, categorySlug }: QuoteProps) {
  const accent = categorySlug ? categoryColor(categorySlug) : 'var(--color-bordo)';
  return (
    <aside
      aria-label="Aşçıbaşı sözü"
      className="relative overflow-hidden bg-[#2a1810] px-6 py-14 text-[var(--color-paper)] sm:px-12 sm:py-20"
    >
      {/* Decorative giant quotation mark */}
      <span
        aria-hidden
        className="absolute -left-6 -top-2 select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(10rem, 20vw, 22rem)',
          color: accent,
          opacity: 0.4,
          lineHeight: 0.7,
        }}
      >
        “
      </span>
      {/* Color sweep on top */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: accent }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p
          className="leading-[1.15] tracking-[-0.01em]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontStyle: 'italic',
          }}
        >
          {text}
        </p>
        <p
          className="mt-6 text-sm uppercase tracking-[0.28em]"
          style={{ color: accent, opacity: 0.9 }}
        >
          — {speaker}
        </p>
      </div>
    </aside>
  );
}
