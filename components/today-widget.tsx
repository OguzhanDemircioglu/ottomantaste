import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { categoryColor } from '@/lib/category-colors';
import { t, type Lang } from '@/lib/i18n';

type Props = {
  recipe: {
    slug: string;
    title: string;
    categoryLabel: string;
    category: string;
    hero_image: string;
    total_min: number;
  };
  lang: Lang;
};

/**
 * Floating "Today's pick" widget — bottom-right sticky bubble with the day's
 * featured recipe. Magenta accent ring, polaroid mini-thumb, snap link.
 *
 * Note: not actually `position: sticky` — that breaks on body scroll. We use
 * `fixed` and ensure it doesn't overlap the alphabet index by giving it a
 * generous bottom margin.
 */
export function TodayWidget({ recipe, lang }: Props) {
  const accent = categoryColor(recipe.category);
  const href = lang === 'en' ? `/recipes/${recipe.slug}?lang=en` : `/recipes/${recipe.slug}`;
  return (
    <Link
      href={href}
      aria-label={`${t('today', lang)}: ${recipe.title}`}
      className="group fixed bottom-6 right-6 z-30 hidden max-w-[20rem] items-center gap-3 rounded-full border border-[var(--color-magenta-deep)]/30 bg-[var(--color-paper)] py-2 pr-5 pl-2 shadow-[0_8px_30px_-8px_rgba(60,4,40,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 sm:flex"
      style={{ animation: 'today-widget-pulse 4s ease-in-out infinite' }}
    >
      <span
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2"
        style={{ ['--tw-ring-color' as string]: accent } as React.CSSProperties}
      >
        <Image
          src={recipe.hero_image}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
          style={{ filter: 'sepia(0.16) saturate(0.95) contrast(1.04)' }}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-magenta-deep)]">
          <Sparkles className="h-3 w-3" aria-hidden />
          {t('today', lang)}
        </span>
        <span
          className="mt-0.5 block truncate text-sm leading-tight text-[#2a1810]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {recipe.title}
        </span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-[var(--color-magenta-deep)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
