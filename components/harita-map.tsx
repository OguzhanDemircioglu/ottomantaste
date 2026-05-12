'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy, RotateCcw, X } from 'lucide-react';
import { type Lang } from '@/lib/i18n';

export type RegionRecipe = {
  slug: string;
  title: string;
  category: string;
  hero_image: string;
};

export type RegionNode = {
  id: string;
  /** Localized region name shown on the pin. */
  name: string;
  /** Percent of map width (0-100), calibrated to the satellite backdrop. */
  x: number;
  /** Percent of map height (0-100), calibrated to the satellite backdrop. */
  y: number;
  recipes: RegionRecipe[];
};

/**
 * One-line character note rendered inside the region drawer. Hand-curated;
 * keeps the editorial voice consistent and avoids leaking taxonomy slugs
 * into the UI copy.
 */
const REGION_NOTES: Record<string, Record<Lang, string>> = {
  istanbul: {
    tr: 'Saray ve liman — imparatorluğun damak merkezi.',
    en: 'Palace and port — the heart of imperial taste.',
  },
  rumeli: {
    tr: 'Balkanların ağır börekleri, et yemekleri, hamur tatlıları.',
    en: 'The heavy pastries, meats and dough sweets of the Balkans.',
  },
  anadolu: {
    tr: 'Tarla, sürü, ot — sade ama derin.',
    en: 'Field, herd, herb — simple yet deep.',
  },
  karadeniz: {
    tr: 'Hamsi, mısır, fındık — kuzey iklimin lezzetleri.',
    en: 'Anchovy, corn, hazelnut — flavours of the north.',
  },
  akdeniz: {
    tr: 'Zeytin, narenciye, balık — güneşin kuşağı.',
    en: 'Olive, citrus and fish — the sunlit belt.',
  },
  guneydogu: {
    tr: 'Ateş, baharat, kebap — Antep ve Urfa.',
    en: 'Fire, spice and kebab — Antep and Urfa.',
  },
  sam: {
    tr: 'Şam ve Halep — Levant’ın incelmiş tabağı.',
    en: 'Damascus and Aleppo — the refined Levantine plate.',
  },
  misir: {
    tr: 'Nil ile baharat yolunun kesişimi.',
    en: 'Where the Nile meets the spice route.',
  },
};

type Props = {
  regions: RegionNode[];
  lang: Lang;
  /**
   * When true, the existing pins become draggable. Drag any pin to move
   * it; the panel below the map shows live coordinates and a Copy button
   * that emits a ready-to-paste REGION_COORDS block. Toggled via
   * `/harita?cal=1` — used as a one-shot dev tool.
   */
  calibrate?: boolean;
};

type Coords = { x: number; y: number };

/**
 * Editorial empire-atlas. The cartography is a satellite-style map of
 * the Ottoman Empire and its vassal states at the 16-17th century peak,
 * placed inside an editorial parchment frame. Region pins float above
 * it as a pure HTML overlay so labels stay crisp and legible.
 *
 * Click a pin → drawer slides in with a regional note + recipes from
 * that region. In calibration mode (?cal=1) clicks become drags so the
 * developer can adjust pin positions visually.
 */
export function HaritaMap({ regions, lang, calibrate = false }: Props) {
  const [active, setActive] = React.useState<RegionNode | null>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);

  // Calibration tool state — only used when calibrate=true. Live overrides
  // for each region's (x, y) percentage. While dragging, only the active
  // region's entry is updated; the rest fall back to the regions[].x/y.
  const [calCoords, setCalCoords] = React.useState<Record<string, Coords>>(
    () => {
      if (!calibrate) return {};
      return Object.fromEntries(regions.map((r) => [r.id, { x: r.x, y: r.y }]));
    },
  );
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const draggedRef = React.useRef(false);
  const initialCoordsRef = React.useRef<Record<string, Coords>>({});
  const mapRef = React.useRef<HTMLDivElement>(null);

  // Snapshot the initial coords on first calibrate mount — used by Reset.
  React.useEffect(() => {
    if (!calibrate) return;
    if (Object.keys(initialCoordsRef.current).length === 0) {
      initialCoordsRef.current = Object.fromEntries(
        regions.map((r) => [r.id, { x: r.x, y: r.y }]),
      );
    }
  }, [calibrate, regions]);

  React.useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Live coords for a given region — uses calCoords override in cal mode,
  // otherwise the static regions[].x/y the page passed in.
  const liveCoords = (r: RegionNode): Coords =>
    calibrate ? (calCoords[r.id] ?? { x: r.x, y: r.y }) : { x: r.x, y: r.y };

  const handlePointerDown = (
    id: string,
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!calibrate) return;
    e.preventDefault();
    e.stopPropagation();
    draggedRef.current = false;
    setDragging(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (
    id: string,
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!calibrate || dragging !== id || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const xRaw = ((e.clientX - rect.left) / rect.width) * 100;
    const yRaw = ((e.clientY - rect.top) / rect.height) * 100;
    const x = Math.max(0, Math.min(100, xRaw));
    const y = Math.max(0, Math.min(100, yRaw));
    draggedRef.current = true;
    setCalCoords((prev) => ({
      ...prev,
      [id]: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 },
    }));
  };

  const handlePointerUp = (
    id: string,
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!calibrate) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(null);
  };

  const handleReset = () => {
    setCalCoords({ ...initialCoordsRef.current });
    setCopied(false);
  };

  const calOutput = React.useMemo(() => {
    const lines = regions
      .map((r) => {
        const c = calCoords[r.id] ?? { x: r.x, y: r.y };
        return `  ${r.id.padEnd(10)}: { x: ${c.x.toFixed(1).padStart(5)}, y: ${c.y
          .toFixed(1)
          .padStart(5)} },  // ${r.name}`;
      })
      .join('\n');
    return `const REGION_COORDS: Record<string, { x: number; y: number }> = {\n${lines}\n};`;
  }, [calCoords, regions]);

  const handleCopy = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(calOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const totalRecipes = regions.reduce((n, r) => n + r.recipes.length, 0);

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <article
          className="relative overflow-hidden rounded-3xl border border-[#2a1810]/15 bg-[var(--color-paper)] shadow-[0_30px_80px_-30px_rgba(42,24,16,0.35),0_2px_0_rgba(255,255,255,0.6)_inset]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 30%, oklch(94% 0.018 65) 0%, oklch(91% 0.025 60) 60%, oklch(88% 0.028 55) 100%)',
          }}
        >
          {/* Double-ruled inner frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-2xl border border-[#2a1810]/12"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[18px] rounded-xl border border-[#2a1810]/6"
          />

          {/* Plate header */}
          <header className="relative flex items-end justify-between gap-4 border-b border-[#2a1810]/15 px-6 py-5 sm:px-10 sm:py-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-magenta-deep)]">
                {calibrate
                  ? lang === 'en'
                    ? 'Calibration · Drag pins to position'
                    : 'Kalibrasyon · Pin sürükle'
                  : lang === 'en'
                    ? 'Plate I · Cartography'
                    : 'Levha I · Kartografya'}
              </p>
              <h2
                className="mt-1 text-2xl text-[#2a1810] sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {lang === 'en' ? 'The Ottoman Empire' : 'Osmanlı İmparatorluğu'}
              </h2>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-bordo)]/70">
                {lang === 'en'
                  ? '16th–17th centuries · with vassal states'
                  : 'XVI–XVII. yüzyıl · vâsıl devletler dahil'}
              </p>
            </div>
            <p
              className="hidden text-right text-xs italic text-[var(--color-bordo)]/85 sm:block"
              style={{ fontFamily: 'var(--font-italic)' }}
            >
              {calibrate
                ? lang === 'en'
                  ? 'Live coordinates'
                  : 'Canlı koordinat'
                : lang === 'en'
                  ? `${regions.length} regions · ${totalRecipes} recipes`
                  : `${regions.length} bölge · ${totalRecipes} tarif`}
            </p>
          </header>

          {/* Map area */}
          <div className="relative px-2 py-6 sm:px-8 sm:py-10">
            <div
              ref={mapRef}
              className="relative mx-auto w-[650px] max-w-full overflow-hidden rounded-lg shadow-[0_8px_28px_-10px_rgba(42,24,16,0.55),0_0_0_1px_rgba(42,24,16,0.12)]"
              style={{ aspectRatio: '650 / 480' }}
            >
              <Image
                src="/maps/ottoman-empire-vassals.jpg"
                alt={
                  lang === 'en'
                    ? 'Map of the Ottoman Empire and its vassal states, 16-17th centuries'
                    : 'Osmanlı İmparatorluğu ve vâsıl devletler haritası — XVI-XVII. yüzyıl'
                }
                fill
                sizes="(max-width: 650px) 100vw, 650px"
                priority
                className="object-cover"
              />

              {/* Pin overlay */}
              <div className="pointer-events-none absolute inset-0">
                {regions.map((r) => {
                  const isActive = active?.id === r.id;
                  const isHovered = hovered === r.id;
                  const isDragging = dragging === r.id;
                  const lift = isActive || isHovered || isDragging;
                  const c = liveCoords(r);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        if (calibrate) {
                          // After a real drag, pointerup synthesises a click —
                          // swallow it so the drawer doesn't open.
                          if (draggedRef.current) {
                            draggedRef.current = false;
                            return;
                          }
                          return;
                        }
                        setActive(r);
                      }}
                      onPointerDown={(e) => handlePointerDown(r.id, e)}
                      onPointerMove={(e) => handlePointerMove(r.id, e)}
                      onPointerUp={(e) => handlePointerUp(r.id, e)}
                      onMouseEnter={() => setHovered(r.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(r.id)}
                      onBlur={() => setHovered(null)}
                      aria-label={`${r.name} — ${r.recipes.length} ${
                        lang === 'en' ? 'recipes' : 'tarif'
                      }`}
                      className={[
                        'group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-magenta-deep)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] touch-none select-none',
                        calibrate
                          ? isDragging
                            ? 'cursor-grabbing'
                            : 'cursor-grab'
                          : 'cursor-pointer',
                      ].join(' ')}
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    >
                      {/* Pulse on active (normal mode only) */}
                      {!calibrate && isActive && (
                        <span
                          aria-hidden
                          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[var(--color-magenta-deep)]/40"
                        />
                      )}

                      {/* Label above pin — "Name (count)" in normal mode, just
                          name in calibrate mode (count distracts from drag UX) */}
                      <span
                        className={[
                          'absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border px-2 py-0.5 text-[13px] sm:text-[15px] leading-tight backdrop-blur-[2px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          lift ? 'mb-3 sm:mb-3.5' : 'mb-2 sm:mb-2.5',
                          isActive || isDragging
                            ? 'border-[var(--color-magenta-deep)]/55 bg-[var(--color-paper)] text-[var(--color-magenta-deep)] shadow-[0_4px_14px_-4px_rgba(149,30,55,0.45)]'
                            : 'border-[#2a1810]/15 bg-[var(--color-paper)]/95 text-[#2a1810] shadow-[0_2px_6px_-1px_rgba(42,24,16,0.35)]',
                        ].join(' ')}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {calibrate ? r.name : `${r.name} (${r.recipes.length})`}
                      </span>

                      {/* Pin: ring + dot */}
                      <span
                        aria-hidden
                        className={[
                          'relative grid place-items-center rounded-full border-[1.5px] bg-[var(--color-paper)] shadow-[0_4px_12px_-3px_rgba(42,24,16,0.6),0_1px_0_rgba(255,255,255,0.6)_inset] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          lift ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-5 w-5 sm:h-6 sm:w-6',
                          isActive || isDragging
                            ? 'border-[var(--color-magenta-deep)]'
                            : 'border-[var(--color-bordo)]/85 group-hover:border-[var(--color-magenta-deep)]',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'rounded-full transition-all duration-300',
                            lift ? 'h-2.5 w-2.5 sm:h-3 sm:w-3' : 'h-2 w-2 sm:h-2.5 sm:w-2.5',
                            isActive || isDragging
                              ? 'bg-[var(--color-magenta-deep)]'
                              : 'bg-[var(--color-bordo)] group-hover:bg-[var(--color-magenta-deep)]',
                          ].join(' ')}
                        />
                      </span>

                      {/* Bottom badge: live coords during calibration only.
                          In normal mode the count moved up into the label as
                          "Name (N)", so this badge is suppressed. */}
                      {calibrate && (
                        <span
                          className={[
                            'absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-[2px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            lift ? 'mt-3 sm:mt-3.5' : 'mt-2 sm:mt-2.5',
                            isDragging
                              ? 'border-[var(--color-magenta-deep)] bg-[var(--color-magenta-deep)] text-[var(--color-paper)]'
                              : 'border-[var(--color-bordo)]/55 bg-[var(--color-paper)]/95 text-[var(--color-bordo)]',
                          ].join(' ')}
                        >
                          {c.x.toFixed(1)}, {c.y.toFixed(1)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer caption */}
          <footer className="border-t border-[#2a1810]/15 px-6 py-4 sm:px-10">
            <p
              className="text-center text-sm italic text-[var(--color-bordo)]/85 sm:text-left"
              style={{ fontFamily: 'var(--font-italic)' }}
            >
              {calibrate
                ? lang === 'en'
                  ? 'Grab any pin and drag it to the correct city. Coordinates update live below.'
                  : 'Herhangi bir pin’i tut ve doğru şehrin üstüne sürükle. Aşağıda canlı koordinat görünür.'
                : active
                  ? lang === 'en'
                    ? `${active.name} — ${active.recipes.length} recipes opened in the side panel.`
                    : `${active.name} — ${active.recipes.length} tarif yandaki sahifede.`
                  : lang === 'en'
                    ? 'Touch a region — its kitchen opens to the right.'
                    : 'Bir bölgeye dokun — sofrası yandan açılsın.'}
            </p>
          </footer>
        </article>

        {/* Calibration panel — only shown in cal mode */}
        {calibrate && (
          <aside className="mt-6 overflow-hidden rounded-2xl border border-[#2a1810]/15 bg-[var(--color-paper)] shadow-[0_8px_24px_-12px_rgba(42,24,16,0.25)]">
            <header className="flex items-center justify-between gap-3 border-b border-[#2a1810]/15 px-5 py-4 sm:px-7">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-magenta-deep)]">
                  {lang === 'en' ? 'Calibration' : 'Kalibrasyon'}
                </p>
                <h3
                  className="mt-1 text-lg text-[#2a1810] sm:text-xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {lang === 'en'
                    ? 'Drag pins · live coordinates'
                    : 'Pin sürükle · canlı koordinat'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#2a1810]/25 bg-[var(--color-paper)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2a1810] transition-colors hover:border-[var(--color-magenta-deep)] hover:text-[var(--color-magenta-deep)]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                {lang === 'en' ? 'Reset' : 'Sıfırla'}
              </button>
            </header>

            <ul className="grid gap-2 p-5 sm:grid-cols-2 sm:p-7">
              {regions.map((r) => {
                const c = calCoords[r.id] ?? { x: r.x, y: r.y };
                const isDragging = dragging === r.id;
                return (
                  <li
                    key={r.id}
                    className={[
                      'flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                      isDragging
                        ? 'border-[var(--color-magenta-deep)] bg-[var(--color-magenta-deep)]/8'
                        : 'border-[#2a1810]/15',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={[
                          'h-2 w-2 shrink-0 rounded-full',
                          isDragging ? 'bg-[var(--color-magenta-deep)]' : 'bg-[var(--color-bordo)]',
                        ].join(' ')}
                      />
                      <span className="font-medium text-[#2a1810]">{r.name}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-bordo)]/85">
                      {c.x.toFixed(1)}, {c.y.toFixed(1)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-[#2a1810]/15 px-5 py-5 sm:px-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-bordo)]/85">
                  {lang === 'en'
                    ? 'Output · paste into app/harita/page.tsx'
                    : 'Çıktı · app/harita/page.tsx içine yapıştır'}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={[
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors',
                    copied
                      ? 'border-[var(--color-magenta-deep)] bg-[var(--color-magenta-deep)] text-[var(--color-paper)]'
                      : 'border-[#2a1810]/25 bg-[var(--color-paper)] text-[#2a1810] hover:border-[var(--color-magenta-deep)] hover:text-[var(--color-magenta-deep)]',
                  ].join(' ')}
                >
                  {copied ? (
                    <Check className="h-3 w-3" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden />
                  )}
                  {copied
                    ? lang === 'en'
                      ? 'Copied'
                      : 'Kopyalandı'
                    : lang === 'en'
                      ? 'Copy'
                      : 'Kopyala'}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-[#2a1810]/12 bg-[#2a1810]/4 p-4 font-mono text-[11px] leading-relaxed text-[#2a1810]">
{calOutput}
              </pre>
            </div>
          </aside>
        )}
      </div>

      {/* Drawer + backdrop — disabled in calibration mode */}
      {!calibrate && active && (
        <>
          <button
            type="button"
            aria-label={lang === 'en' ? 'Close panel' : 'Sahifeyi kapat'}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-40 cursor-pointer bg-[#2a1810]/40 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-label={active.name}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-[var(--color-paper)] shadow-[0_30px_80px_-20px_rgba(42,24,16,0.5)] sm:max-w-md md:max-w-lg"
            style={{ animation: 'drawer-in 380ms cubic-bezier(0.16,1,0.3,1)' }}
          >
            <header className="flex items-start justify-between gap-3 border-b-[3px] border-double border-[#2a1810]/35 px-6 py-6 sm:px-8">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-magenta-deep)]">
                  {lang === 'en' ? 'Region · Plate' : 'Bölge · Levha'}
                </p>
                <h2
                  className="mt-2 text-3xl leading-tight text-[#2a1810] sm:text-4xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {active.name}
                </h2>
                {REGION_NOTES[active.id]?.[lang] && (
                  <p
                    className="mt-3 text-sm italic text-[var(--color-bordo)]"
                    style={{ fontFamily: 'var(--font-italic)' }}
                  >
                    {REGION_NOTES[active.id][lang]}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-magenta-deep)]/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-magenta-deep)]">
                  {active.recipes.length} {lang === 'en' ? 'recipes' : 'tarif'}
                </span>
              </div>
              <button
                type="button"
                aria-label={lang === 'en' ? 'Close' : 'Kapat'}
                onClick={() => setActive(null)}
                className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[#2a1810]/20 text-[#2a1810]/70 transition-colors hover:bg-[#2a1810]/8 hover:text-[#2a1810]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              {active.recipes.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#2a1810]/55">
                  {lang === 'en'
                    ? 'No recipes yet for this region.'
                    : 'Bu bölgede tarif henüz yok.'}
                </p>
              ) : (
                <ul className="grid gap-2.5">
                  {active.recipes.map((r, i) => (
                    <li key={r.slug}>
                      <Link
                        href={lang === 'en' ? `/recipes/${r.slug}?lang=en` : `/recipes/${r.slug}`}
                        className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[#2a1810]/12 bg-[var(--color-paper)] p-2.5 transition-[border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--color-magenta-deep)]/45 hover:shadow-[0_8px_24px_-8px_rgba(42,24,16,0.25)]"
                      >
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#1a0f08]">
                          <Image
                            src={r.hero_image}
                            alt={r.title}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ filter: 'sepia(0.16) saturate(0.92)' }}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--color-magenta-deep)]">
                            {String(i + 1).padStart(2, '0')} · {r.category}
                          </span>
                          <span
                            className="mt-1 block truncate text-base leading-snug text-[#2a1810]"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {r.title}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-[#2a1810]/35 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-magenta-deep)]"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <style>{`
              @keyframes drawer-in {
                from { transform: translateX(100%); opacity: 0.5; }
                to   { transform: translateX(0);    opacity: 1;   }
              }
            `}</style>
          </aside>
        </>
      )}
    </div>
  );
}
