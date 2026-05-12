'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Map } from 'lucide-react';
import { LangToggle } from './lang-toggle';
import { useFavorites } from '@/lib/use-favorites';
import { t, type Lang } from '@/lib/i18n';

/**
 * Top utility bar that sits above the masthead. Search lives inline above
 * the category tabs as <SearchBar />; this bar only carries Favoriler,
 * Harita, and the language toggle now.
 */
type Props = { lang: Lang };

export function SiteHeaderBar({ lang }: Props) {
  const { count, mounted } = useFavorites();

  return (
    <div className="border-b border-[#2a1810]/15 bg-[var(--color-paper)]/60 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-1 px-6 py-2 sm:gap-2">
        <Link
          href={lang === 'en' ? '/favoriler?lang=en' : '/favoriler'}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#2a1810]/65 transition-colors hover:bg-[#2a1810]/8 hover:text-[#2a1810]"
        >
          <Heart
            className={[
              'h-3.5 w-3.5 transition-[color,fill]',
              mounted && count > 0
                ? 'fill-[var(--color-magenta-deep)] text-[var(--color-magenta-deep)]'
                : '',
            ].join(' ')}
            aria-hidden
          />
          <span className="hidden sm:inline">{t('nav_favs', lang)}</span>
          {mounted && count > 0 && (
            <span className="rounded-full bg-[var(--color-magenta-deep)] px-1.5 py-px font-mono text-[10px] text-[var(--color-paper)]">
              {count}
            </span>
          )}
        </Link>

        <Link
          href={lang === 'en' ? '/harita?lang=en' : '/harita'}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#2a1810]/65 transition-colors hover:bg-[#2a1810]/8 hover:text-[#2a1810]"
        >
          <Map className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">{t('nav_map', lang)}</span>
        </Link>

        <span aria-hidden className="mx-1 h-4 w-px bg-[#2a1810]/20" />

        <LangToggle lang={lang} />
      </div>
    </div>
  );
}
