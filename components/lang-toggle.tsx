'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

type Props = { lang: Lang };

/**
 * Pill-style segmented TR/EN toggle. Preserves the current pathname and all
 * other search params; only flips `?lang=`. Uses Next's router.push so URL
 * stays canonical and back/forward navigation works.
 */
export function LangToggle({ lang }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setLang = React.useCallback(
    (next: Lang) => {
      if (next === lang) return;
      const sp = new URLSearchParams(params.toString());
      if (next === 'tr') sp.delete('lang');
      else sp.set('lang', next);
      const qs = sp.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [lang, params, pathname, router],
  );

  return (
    <div
      role="group"
      aria-label="Language toggle"
      className="inline-flex overflow-hidden rounded-full border border-[#2a1810]/30 bg-[var(--color-paper)]"
    >
      <Button active={lang === 'tr'} onClick={() => setLang('tr')}>TR</Button>
      <span aria-hidden className="my-1 w-px bg-[#2a1810]/20" />
      <Button active={lang === 'en'} onClick={() => setLang('en')}>EN</Button>
    </div>
  );
}

function Button({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'cursor-pointer px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
        active ? 'text-[var(--color-paper)]' : 'text-[#2a1810]/55 hover:text-[#2a1810]',
      ].join(' ')}
      style={{
        background: active ? 'var(--color-magenta-deep)' : 'transparent',
        transition: 'background-color 240ms cubic-bezier(0.16,1,0.3,1), color 240ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </button>
  );
}
