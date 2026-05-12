import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { categoryColor } from '@/lib/category-colors';
import { t, type Lang } from '@/lib/i18n';
import type { TodayReason } from '@/lib/today';

type Props = {
  recipe: {
    slug: string;
    title: string;
    categoryLabel: string;
    category: string;
    hero_image: string;
    total_min: number;
  };
  /** Why this recipe was selected — drives the eyebrow text. Omitted = generic. */
  reason?: TodayReason;
  lang: Lang;
};

/**
 * Floating "Today's pick" widget — bottom-right sticky bubble with the day's
 * featured recipe. Magenta accent ring, polaroid mini-thumb, snap link.
 * Visible on every viewport size; on mobile it sits at the bottom with a
 * slightly smaller footprint so it doesn't smother the alphabet index.
 *
 * Note: not actually `position: sticky` — that breaks on body scroll. We use
 * `fixed` and ensure it doesn't overlap the alphabet index by giving it a
 * generous bottom margin.
 */
export function TodayWidget({ recipe, reason, lang }: Props) {
  const accent = categoryColor(recipe.category);
  const href = lang === 'en' ? `/recipes/${recipe.slug}?lang=en` : `/recipes/${recipe.slug}`;
  const eyebrow = pickEyebrow(reason, lang);

  return (
    <Link
      href={href}
      aria-label={`${eyebrow}: ${recipe.title}`}
      className="group fixed bottom-4 right-4 z-30 flex max-w-[16rem] items-center gap-2.5 rounded-full border border-[var(--color-magenta-deep)]/30 bg-[var(--color-paper)] py-1.5 pr-4 pl-1.5 shadow-[0_8px_30px_-8px_rgba(60,4,40,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:max-w-[20rem] sm:gap-3 sm:py-2 sm:pr-5 sm:pl-2"
      style={{ animation: 'today-widget-pulse 4s ease-in-out infinite' }}
    >
      <span
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 sm:h-12 sm:w-12"
        style={{ ['--tw-ring-color' as string]: accent } as React.CSSProperties}
      >
        <Image
          src={recipe.hero_image}
          alt=""
          fill
          sizes="(max-width: 640px) 40px, 48px"
          className="object-cover"
          style={{ filter: 'sepia(0.16) saturate(0.95) contrast(1.04)' }}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-magenta-deep)]">
          <Sparkles className="h-3 w-3" aria-hidden />
          {eyebrow}
        </span>
        <span
          className="mt-0.5 block truncate text-[13px] leading-tight text-[#2a1810] sm:text-sm"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {recipe.title}
        </span>
      </span>
      <ArrowUpRight
        className="hidden h-4 w-4 shrink-0 text-[var(--color-magenta-deep)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
        aria-hidden
      />

      {/* Inline keyframes — soft pulse on the magenta border ring */}
      <style>{`
        @keyframes today-widget-pulse {
          0%, 100% { box-shadow: 0 8px 30px -8px rgba(60,4,40,0.35), inset 0 0 0 1px rgba(255,255,255,0.5); }
          50%      { box-shadow: 0 12px 40px -8px rgba(120,8,80,0.5),  inset 0 0 0 1px rgba(255,255,255,0.6); }
        }
      `}</style>
    </Link>
  );
}

function pickEyebrow(reason: TodayReason | undefined, lang: Lang): string {
  if (!reason) return t('today', lang);
  switch (reason.kind) {
    case 'exact-day':
      return reason.observance.name[lang];
    case 'ramazan':
      return t('today_ramazan', lang);
    case 'bayram':
      return t('today_bayram', lang);
    case 'season': {
      const key =
        reason.season === 'ilkbahar' ? 'today_season_bahar' :
        reason.season === 'yaz'      ? 'today_season_yaz'   :
        reason.season === 'sonbahar' ? 'today_season_guz'   :
        reason.season === 'kis'      ? 'today_season_kis'   :
        'today';
      return t(key, lang);
    }
    case 'fallback':
    default:
      return t('today', lang);
  }
}
