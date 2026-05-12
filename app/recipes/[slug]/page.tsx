import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Users, Flame, BookOpen } from 'lucide-react';
import { getAllRecipes, getRecipeBySlug } from '@/lib/recipes';
import { localized } from '@/lib/title';
import { getLang, t, categoryLabel as catLabel, type Lang } from '@/lib/i18n';
import { SiteHeaderBar } from '@/components/site-header-bar';

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { lang: rawLang } = await searchParams;
  const lang = getLang(rawLang);
  const r = getRecipeBySlug(slug);
  if (!r) return { title: 'Recipe not found' };
  const title = localized(r.title, slug, lang);
  // Root layout's metadata.title.template appends " — OttomanTaste".
  return {
    title,
    description: localized(r.tagline, '', lang) || title,
  };
}

export default async function RecipeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang: rawLang } = await searchParams;
  const lang: Lang = getLang(rawLang);

  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const title = localized(recipe.title, slug, lang);
  const tagline = localized(recipe.tagline, '', lang);
  const categoryLabel = catLabel(recipe.category as string, lang);
  const homeHref = lang === 'en' ? '/?lang=en' : '/';

  const ingredientGroups = new Map<string, typeof recipe.ingredients>();
  for (const ing of recipe.ingredients ?? []) {
    const k = ing.group ?? '';
    if (!ingredientGroups.has(k)) ingredientGroups.set(k, []);
    ingredientGroups.get(k)!.push(ing);
  }

  return (
    <main className="pb-32">
      <SiteHeaderBar lang={lang} />

      {/* Back link aligned with detail content max-width */}
      <div className="mx-auto w-full max-w-4xl px-6 pt-12">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#2a1810]/65 transition-colors hover:text-[var(--color-magenta-deep)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t('back', lang)}
        </Link>
      </div>

      <header className="mx-auto w-full max-w-4xl px-6 pt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-magenta-deep)]">
          {categoryLabel}
        </p>
        <h1
          className="mt-4 leading-[0.95] tracking-[-0.02em] text-[#2a1810]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5.25rem)',
          }}
        >
          {title}
        </h1>
        {tagline && (
          <p
            className="mt-5 text-xl text-[var(--color-bordo)] sm:text-2xl"
            style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
          >
            — {tagline}
          </p>
        )}

        <dl className="mt-10 grid grid-cols-3 gap-6 border-y-[2px] border-double border-[#2a1810] py-5 sm:gap-12">
          <Stat icon={Clock} label={lang === 'en' ? 'Time' : 'Süre'} value={`${recipe.total_min ?? '—'} ${t('minutes', lang)}`} />
          <Stat icon={Users} label={lang === 'en' ? 'Serves' : 'Kişi'} value={String(recipe.serves ?? '—')} />
          <Stat icon={Flame} label={lang === 'en' ? 'Calories' : 'Kalori'} value={`${recipe.nutrition?.kcal ?? '—'} ${t('kcal', lang)}`} />
        </dl>
      </header>

      <figure className="mx-auto mt-12 w-full max-w-5xl px-6">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1a0f08]">
          <Image
            src={recipe.hero_image}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            style={{ filter: 'sepia(0.18) saturate(0.92) contrast(1.04)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 0 6px rgba(251,246,236,0.6), inset 0 0 0 7px rgba(42,24,16,0.25)',
            }}
          />
        </div>
      </figure>

      <div className="mx-auto mt-16 w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
          <aside className="lg:col-span-4 lg:sticky lg:top-12 lg:self-start">
            <h2
              className="border-b-[2px] border-double border-[#2a1810] pb-3 text-2xl font-semibold text-[#2a1810]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('ingredients', lang)}
            </h2>

            <div className="mt-6 space-y-7 text-[15px] leading-relaxed">
              {Array.from(ingredientGroups.entries()).map(([group, items]) => (
                <div key={group}>
                  {group && (
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-magenta-deep)]">
                      {group}
                    </p>
                  )}
                  <ul className="space-y-1.5 text-[#2a1810]/85">
                    {items?.map((ing, i) => (
                      <li
                        key={i}
                        className="flex gap-2 border-b border-dotted border-[#2a1810]/15 pb-1.5"
                      >
                        <span className="font-mono text-[13px] tabular-nums text-[#2a1810]/70">
                          {ing.qty} {ing.unit}
                        </span>
                        <span className="flex-1">
                          {ing.name}
                          {ing.note && (
                            <span
                              className="ml-1 text-[#2a1810]/55"
                              style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
                            >
                              · {ing.note}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-8">
            <h2
              className="border-b-[2px] border-double border-[#2a1810] pb-3 text-2xl font-semibold text-[#2a1810]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('method', lang)}
            </h2>

            <ol className="mt-6 space-y-9">
              {(recipe.steps ?? []).map((step) => (
                <li key={step.n} className="grid grid-cols-[auto_1fr] gap-x-6">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full bg-[#2a1810] text-2xl font-semibold text-[var(--color-paper)]"
                    style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
                  >
                    {step.n}
                  </span>
                  <div className="pt-1">
                    {step.group && (
                      <p
                        className="text-base font-semibold text-[var(--color-magenta-deep)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {step.group}
                        {typeof step.minutes === 'number' && (
                          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2a1810]/55">
                            ~{step.minutes} {t('minutes', lang)}
                          </span>
                        )}
                      </p>
                    )}
                    <p className="mt-2 text-[16px] leading-[1.65] text-[#2a1810]/90">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {recipe.tips && recipe.tips.length > 0 && (
              <div className="mt-14 border-y-[2px] border-double border-[#2a1810] py-7">
                <h3
                  className="text-xl font-semibold text-[var(--color-magenta-deep)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('tips', lang)}
                </h3>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-[#2a1810]/85">
                  {recipe.tips.map((tip, i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-magenta-deep)]" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.storage && (
              <div className="mt-10">
                <h3
                  className="text-xl font-semibold text-[var(--color-magenta-deep)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('storage', lang)}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#2a1810]/85">
                  {recipe.storage}
                </p>
              </div>
            )}

            {recipe.sources && recipe.sources.length > 0 && (
              <div className="mt-12 border-t border-[#2a1810]/30 pt-8">
                <h3
                  className="flex items-center gap-2 text-xl font-semibold text-[#2a1810]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <BookOpen className="h-4 w-4" aria-hidden />
                  {t('sources', lang)}
                </h3>
                <ol className="mt-4 space-y-3 text-sm text-[#2a1810]/75">
                  {recipe.sources.map((src, i) => (
                    <li key={i} className="border-l-2 border-[var(--color-magenta-deep)]/40 pl-4">
                      <p className="font-semibold text-[#2a1810]">
                        {src.title}
                        {src.year && (
                          <span className="ml-2 font-mono text-[11px] tabular-nums text-[#2a1810]/55">
                            ({src.year})
                          </span>
                        )}
                      </p>
                      {src.author && (
                        <p
                          className="text-[#2a1810]/65"
                          style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
                        >
                          {src.author}
                        </p>
                      )}
                      {src.reference && (
                        <p className="mt-1 text-[13px] leading-relaxed text-[#2a1810]/65">
                          {src.reference}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#2a1810]/55">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <p
        className="mt-1.5 text-2xl font-semibold tabular-nums text-[#2a1810] sm:text-3xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </p>
    </div>
  );
}
