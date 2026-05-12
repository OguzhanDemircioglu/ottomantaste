import { AnimatedCounter } from './animated-counter';
import { t, type Lang } from '@/lib/i18n';

type MastheadProps = {
  total: number;
  lang: Lang;
};

/**
 * Wordmark masthead. The title swaps with language —
 * "OttomanTaste" / "Osmanlı Lezzetleri" — and a small em-ruled kicker
 * underneath labels it as the recipe magazine that it is.
 */
export function Masthead({ total, lang }: MastheadProps) {
  return (
    <header className="border-b-[3px] border-double border-[#2a1810] pt-12 pb-6">
      <div className="mx-auto w-full max-w-7xl px-6 text-center">
        <h1
          className="font-semibold leading-[0.95] tracking-[-0.02em] text-[#2a1810]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 7rem)',
          }}
        >
          {lang === 'en' ? 'OttomanTaste' : 'Osmanlı Lezzetleri'}
        </h1>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-8 bg-[var(--color-magenta-deep)]/45 sm:w-12" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-magenta-deep)] sm:text-[11px]">
            {lang === 'en' ? 'ottoman recipes' : 'yemek tarifleri'}
          </span>
          <span aria-hidden className="h-px w-8 bg-[var(--color-magenta-deep)]/45 sm:w-12" />
        </div>

        <p
          className="mt-4 text-[var(--color-bordo)]"
          style={{
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)',
          }}
        >
          {lang === 'en' ? (
            <>
              Seven centuries, one table —{' '}
              <span className="text-[var(--color-magenta-deep)] font-medium">
                <AnimatedCounter to={total} />
              </span>{' '}
              {t('recipes', lang)}.
            </>
          ) : (
            <>
              Yedi yüzyıl, tek bir sofra —{' '}
              <span className="text-[var(--color-magenta-deep)] font-medium">
                <AnimatedCounter to={total} />
              </span>{' '}
              {t('recipes', lang)}.
            </>
          )}
        </p>
      </div>
    </header>
  );
}
