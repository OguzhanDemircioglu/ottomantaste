import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Clock, Users, Flame, ArrowRight } from 'lucide-react';
import { categoryColor } from '@/lib/category-colors';
import { t, type Lang } from '@/lib/i18n';
import { FavoriteToggle } from './favorite-toggle';

export type RecipeCardData = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  categoryLabel: string;
  hero_image: string;
  total_min: number;
  serves: number;
  /** Recipe-site signal: number of step entries — small badge when present. */
  stepCount?: number;
  /** Difficulty key from MDX: kolay / orta / zor */
  difficulty?: 'kolay' | 'orta' | 'zor';
  /** First 3 main ingredient names (raw, no qty) — recipe-site signal. */
  mainIngredients?: string[];
  /** Optional one-liner about the dish's history — surfaced under tagline. */
  storyHook?: string | null;
};

type Variant = 'lead' | 'feature' | 'standard' | 'compact';

type Props = {
  recipe: RecipeCardData;
  variant?: Variant;
  /** Card index — used as a deterministic seed for tilt + tape rotation. */
  index?: number;
  /** Carried over to the recipe detail page so the toggle state survives navigation. */
  lang?: Lang;
};

const DIFF_LABEL = {
  kolay: 'diff_kolay' as const,
  orta:  'diff_orta'  as const,
  zor:   'diff_zor'   as const,
};

/**
 * Recipe card — tilted polaroid with a clear "this IS a recipe" stack:
 *   1. Photo
 *   2. Category pill (color-coded)
 *   3. Title (Cormorant SC)
 *   4. Tagline (italic, descriptive)
 *   5. Story hook (small, sparkles icon, historical attribution)
 *   6. Main-ingredient row — "Patlıcan · Kuzu · Tereyağı"
 *   7. Meta strip — ⏱ 75 dk · 👥 4 · 🔥 Orta · 12 adım
 *   8. "Tarife git →" CTA
 *
 * Compact variant skips story hook + ingredients; lead/feature get the full stack.
 */
export function RecipeCard({ recipe, variant = 'standard', index = 0, lang = 'tr' }: Props) {
  const sizes = {
    lead:     { photo: 'aspect-[5/4]', title: 'clamp(2.25rem, 4.5vw, 3.5rem)', frame: 'p-3.5 sm:p-4' },
    feature:  { photo: 'aspect-[4/5]', title: 'clamp(1.5rem, 2.4vw, 2.25rem)', frame: 'p-3 sm:p-3.5' },
    standard: { photo: 'aspect-[4/3]', title: '1.5rem',                       frame: 'p-3' },
    compact:  { photo: 'aspect-[1/1]', title: '1.125rem',                     frame: 'p-2.5' },
  } as const;
  const v = sizes[variant];

  const accent = categoryColor(recipe.category);

  const tiltCycle = [-0.6, -0.3, 0, 0.3, 0.6, -0.4, 0.4];
  const tilt = tiltCycle[index % tiltCycle.length];

  const showTape = variant === 'lead' || variant === 'feature';
  const showFullDetails = variant !== 'compact';

  const href = lang === 'en' ? `/recipes/${recipe.slug}?lang=en` : `/recipes/${recipe.slug}`;

  return (
    <Link
      href={href}
      className={[
        'group relative isolate flex w-full flex-col',
        'shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_2px_4px_-1px_rgba(42,24,16,0.10),0_18px_30px_-18px_rgba(42,24,16,0.30)]',
        'hover:-translate-y-1 hover:rotate-0',
        v.frame,
      ].join(' ')}
      style={{
        background: 'var(--color-paper)',
        transform: `rotate(${tilt}deg)`,
        transition: 'transform 380ms cubic-bezier(0.16,1,0.3,1), box-shadow 380ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10"
        style={{
          height: variant === 'lead' ? 6 : variant === 'feature' ? 5 : 4,
          background: accent,
        }}
      />

      {showTape && (
        <span
          aria-hidden
          className="absolute -top-2 left-6 z-20 h-5 w-16 rotate-[-6deg]"
          style={{
            background: `linear-gradient(135deg, ${accent} 0%, ${accent} 50%, transparent 50.1%)`,
            opacity: 0.65,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      <figure className={`relative w-full overflow-hidden bg-[#1a0f08] ${v.photo}`}>
        <FavoriteToggle
          slug={recipe.slug}
          labelOn={lang === 'en' ? 'Save to favorites' : 'Favorilere ekle'}
          labelOff={lang === 'en' ? 'Remove from favorites' : 'Favorilerden çıkar'}
        />
        <Image
          src={recipe.hero_image}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // First three cards are likely above the fold on most viewports —
          // their hero image is the LCP candidate, so we preload it. Cards
          // further down are explicitly lazy with a low fetch priority so
          // the browser can spend bandwidth on what matters first.
          {...(index < 3
            ? { priority: true, fetchPriority: 'high' as const }
            : { loading: 'lazy' as const, fetchPriority: 'low' as const })}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          style={{
            filter: 'sepia(0.16) saturate(0.95) contrast(1.04) brightness(0.97)',
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-40 mix-blend-multiply"
          style={{
            background: `linear-gradient(to top, ${accent}, transparent)`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(42,24,16,0.18), inset 0 -40px 60px -30px rgba(42,24,16,0.30)',
          }}
        />
      </figure>

      <div className="flex flex-1 flex-col pt-3.5 pb-1">
        <p>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-paper)]"
            style={{ background: accent }}
          >
            {recipe.categoryLabel}
          </span>
        </p>

        <h3
          className="mt-2 leading-[1.05] tracking-[-0.005em] text-[#2a1810]"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: v.title,
          }}
        >
          {recipe.title}
        </h3>

        {showFullDetails && recipe.tagline && (
          <p
            className="mt-2 text-[#2a1810]/70"
            style={{
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              fontSize: variant === 'lead' ? '1.125rem' : '0.95rem',
              lineHeight: 1.45,
            }}
          >
            — {recipe.tagline}
          </p>
        )}

        {showFullDetails && recipe.storyHook && (
          <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-snug text-[var(--color-bordo)]/85">
            <Sparkles className="mt-[3px] h-3 w-3 shrink-0 text-[var(--color-magenta-deep)]" aria-hidden />
            <span>{recipe.storyHook}</span>
          </p>
        )}

        {/* ── Main ingredients chip row — instant "this is a recipe" signal ── */}
        {showFullDetails && recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
          <ul
            aria-label={t('ingredients_label', lang)}
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {recipe.mainIngredients.slice(0, 3).map((name) => (
              <li
                key={name}
                className="rounded-full border px-2 py-0.5 text-[11px] leading-none text-[#2a1810]/85"
                style={{
                  borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
                  background: `color-mix(in srgb, ${accent} 8%, transparent)`,
                }}
              >
                {name}
              </li>
            ))}
            {recipe.mainIngredients.length > 3 && (
              <li
                className="rounded-full px-2 py-0.5 text-[11px] leading-none text-[#2a1810]/55"
                style={{ background: 'color-mix(in srgb, var(--color-foreground) 8%, transparent)' }}
              >
                +{recipe.mainIngredients.length - 3}
              </li>
            )}
          </ul>
        )}

        {/* ── Meta strip — clock / serves / difficulty / step count ── */}
        <div className="mt-auto pt-4">
          <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#2a1810]/15 pt-3 text-[11px] text-[#2a1810]/75">
            <Meta icon={Clock} value={`${recipe.total_min} ${t('minutes', lang)}`} />
            <Meta icon={Users} value={`${recipe.serves}`} />
            {recipe.difficulty && (
              <Meta
                icon={Flame}
                value={t(DIFF_LABEL[recipe.difficulty], lang)}
                /* tint the icon by category accent so it doesn't look pasted */
                accent={accent}
              />
            )}
            {typeof recipe.stepCount === 'number' && recipe.stepCount > 0 && (
              <Meta
                badge={`${recipe.stepCount} ${t('steps', lang)}`}
              />
            )}
          </dl>

          {/* ── Clear CTA — color-anchored "Open recipe" arrow link ── */}
          {showFullDetails && (
            <p
              className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              {t('goRecipe', lang)}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                aria-hidden
              />
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function Meta({
  icon: Icon,
  value,
  badge,
  accent,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value?: string;
  badge?: string;
  accent?: string;
}) {
  if (badge) {
    return (
      <div className="rounded-full bg-[#2a1810]/8 px-2 py-0.5 font-mono text-[10px] tabular-nums text-[#2a1810]/75">
        {badge}
      </div>
    );
  }
  if (!Icon || !value) return null;
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        className="h-3.5 w-3.5 shrink-0"
        style={accent ? { color: accent } : undefined}
        aria-hidden
      />
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
