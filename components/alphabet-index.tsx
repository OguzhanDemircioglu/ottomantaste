import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n';

type Props = {
  groups: Array<{ letter: string; recipes: Array<{ slug: string; title: string }> }>;
  lang: Lang;
};

/**
 * Alphabetical index — like the back-page index of an almanac.
 */
export function AlphabetIndex({ groups, lang }: Props) {
  if (groups.length === 0) return null;

  return (
    <section
      aria-label={t('indexHeader', lang)}
      className="border-t-[3px] border-double border-[#2a1810] bg-[var(--color-paper-warm)] py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <header className="mb-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2a1810]/60">
            {t('indexEyebrow', lang)}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold text-[#2a1810] sm:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('indexHeader', lang)}
          </h2>
          <p
            className="mt-3 text-[#2a1810]/70"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            {t('indexLede', lang)}
          </p>
        </header>

        <div className="columns-2 gap-x-12 sm:columns-3 lg:columns-4 [&>div]:break-inside-avoid">
          {groups.map((g) => (
            <div key={g.letter} className="mb-7">
              <p
                className="mb-2 border-b border-[#2a1810]/35 pb-1 text-2xl font-semibold text-[var(--color-magenta-deep)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {g.letter}
              </p>
              <ul className="space-y-0.5">
                {g.recipes.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={lang === 'en' ? `/recipes/${r.slug}?lang=en` : `/recipes/${r.slug}`}
                      className="text-sm leading-tight text-[#2a1810]/85 underline-offset-4 transition-colors hover:text-[var(--color-magenta-deep)] hover:underline"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
