'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/use-favorites';

type Props = {
  slug: string;
  /** Inline accessible label for screen readers. */
  labelOn: string;
  labelOff: string;
};

/**
 * Heart toggle that floats over a recipe card's photo. Stops link navigation
 * with `preventDefault` so the parent <Link> isn't followed; the only state
 * change is localStorage via useFavorites.
 *
 * Memoized to avoid re-rendering 427 buttons on unrelated state changes.
 */
function FavoriteToggleImpl({ slug, labelOn, labelOff }: Props) {
  const { isFavorite, toggle, mounted } = useFavorites();
  const active = mounted && isFavorite(slug);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(slug);
    },
    [slug, toggle],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? labelOff : labelOn}
      className="group/fav absolute right-3 top-3 z-20 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-[var(--color-paper)]/85 backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-magenta-deep)]"
      style={{
        boxShadow: '0 2px 8px -2px rgba(42,24,16,0.25), inset 0 0 0 1px rgba(255,255,255,0.7)',
      }}
    >
      <Heart
        className={[
          'h-4 w-4 transition-[color,fill] duration-200',
          active
            ? 'fill-[var(--color-magenta-deep)] text-[var(--color-magenta-deep)]'
            : 'text-[#2a1810]/55 group-hover/fav:text-[var(--color-magenta-deep)]',
        ].join(' ')}
        aria-hidden
      />
    </button>
  );
}

export const FavoriteToggle = React.memo(FavoriteToggleImpl);
