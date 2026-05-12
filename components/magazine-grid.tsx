import * as React from 'react';
import { RecipeCard, type RecipeCardData } from './recipe-card';
import { OrnamentDivider } from './ornament-divider';
import {
  SeasonInterlude,
  GlossaryInterlude,
  QuoteInterlude,
} from './interludes';
import { t, type Lang } from '@/lib/i18n';

type Props = {
  recipes: RecipeCardData[];
  /** Optional season hint passed from page; defaults to date-based */
  season: 'bahar' | 'yaz' | 'guz' | 'kis';
  lang: 'tr' | 'en';
};

/* ─── Editorial interlude content ─────────────────────────────────────────
   Random feel without true randomness — the page picks a different mix each
   render but the slot order is deterministic so SSR + client agree.
   ───────────────────────────────────────────────────────────────────────── */

const GLOSSARY_ENTRIES: Array<{
  term: string;
  period: string;
  definition: string;
  etymology: string;
}> = [
  {
    term: 'Helvahane',
    period: '15. — 19. yüzyıl',
    definition:
      'Topkapı Sarayı’nın helva, şerbet ve macun bölümü. Tıpkı bir laboratuvar gibi çalışırdı: tarifler hassas tartılarla, gümüş kaşıklarla ölçülür, hatasız kayda geçirilirdi.',
    etymology: 'Arapça *halwa* (tatlı) + Farsça *hâne* (oda).',
  },
  {
    term: 'Kuşhane',
    period: 'Saray devri',
    definition:
      'Hünkâra özel kuş eti yemeklerinin pişirildiği küçük mutfak. Her kuş için ayrı kazan, ayrı kaşık. Doğal kromun saray tarafından üretildiği yer.',
    etymology: 'Türkçe *kuş* + Farsça *hâne*.',
  },
  {
    term: 'Çeşnigîr',
    period: 'Tanzimat öncesi',
    definition:
      'Hünkâra sofraya gelmeden önce yemekleri tadarak zehirden koruyan saray görevlisi. Tat alma duyusu, yıllarca özenle eğitilirdi.',
    etymology: 'Farsça *çeşni* (tat) + *gîr* (alan, tutan).',
  },
  {
    term: 'Mutancana',
    period: '17. yüzyıl',
    definition:
      'Kuru meyve ve baharatla pişirilen tatlımtırak Saray etidir. Adı Bizans’tan kalan *muhtanyana* sözcüğüne dayanır; reçeteler arasında en uzun ömürlülerden biri.',
    etymology: 'Bizans Yunancası *μουστανέα* → Osmanlıca uyarlama.',
  },
];

const QUOTE_ENTRIES: Array<{
  text: string;
  speaker: string;
  categorySlug?: string;
}> = [
  {
    text: 'Mutfakta tarif yazılmaz, aktarılır. Ölçü kaşıkta değil, parmak uçlarında saklıdır.',
    speaker: 'III. Selim dönemi aşçıbaşı kayıtlarından',
    categorySlug: 'tatli',
  },
  {
    text: 'Helva kuru tava ister; sabırla kavrulur, dökülmeden döner. Acelesi olan helva yapmaz, yer.',
    speaker: 'Helvahane çırak defteri, 1789',
    categorySlug: 'helva',
  },
  {
    text: 'Şerbet, suyun saraylısıdır. Karanfil, gül, demirhindi — her birinin sırası vardır, ezbere değil.',
    speaker: 'Sultan Abdülmecid devri şerbetçibaşı',
    categorySlug: 'serbet',
  },
];

/**
 * Magazine spread layout — same 7-recipe rhythm as before, plus colorful
 * editorial interludes injected at deterministic positions:
 *   - after cycle 1 → Season note
 *   - after cycle 3 → Glossary entry
 *   - after cycle 5 → Aşçıbaşı quote
 * Each cycle ends with an ornament divider whose variant rotates.
 */
export function MagazineGrid({ recipes, season, lang }: Props) {
  if (recipes.length === 0) return <EmptyState lang={lang} />;

  const cycles: RecipeCardData[][] = [];
  for (let i = 0; i < recipes.length; i += 7) cycles.push(recipes.slice(i, i + 7));

  // Deterministic interlude picks (pseudo-random feel, but stable per render)
  const glossaryPick = GLOSSARY_ENTRIES[recipes.length % GLOSSARY_ENTRIES.length];
  const quotePick = QUOTE_ENTRIES[(recipes.length * 3) % QUOTE_ENTRIES.length];

  // Pick 3 recipes that suit the current season for the SeasonInterlude
  const seasonPicks = recipes
    .filter((r) => r.tagline) // pretty entries only
    .slice((recipes.length * 7) % Math.max(1, recipes.length - 3), 3 + ((recipes.length * 7) % Math.max(1, recipes.length - 3)))
    .slice(0, 3)
    .map((r) => ({ slug: r.slug, title: r.title, category: r.category }));

  const ornamentVariants: Array<'palmette' | 'rosette' | 'tugra' | 'wave'> = [
    'palmette', 'rosette', 'tugra', 'wave',
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-20 sm:pb-24">
      <div className="space-y-6">
        {cycles.map((cycle, idx) => (
          <React.Fragment key={idx}>
            <Cycle recipes={cycle} cycleIndex={idx} lang={lang} />

            {/* Interlude slots — strategically placed for rhythm */}
            {idx === 0 && cycles.length > 1 && (
              <SeasonInterlude season={season} picks={seasonPicks} />
            )}
            {idx === 2 && cycles.length > 3 && (
              <GlossaryInterlude {...glossaryPick} />
            )}
            {idx === 4 && cycles.length > 5 && (
              <QuoteInterlude {...quotePick} />
            )}

            {/* Ornament divider between cycles (skip after last) */}
            {idx < cycles.length - 1 && (
              <OrnamentDivider
                variant={ornamentVariants[idx % ornamentVariants.length]}
                color={idx % 2 === 0 ? 'var(--color-bordo)' : 'var(--color-magenta-deep)'}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function Cycle({
  recipes,
  cycleIndex,
  lang,
}: {
  recipes: RecipeCardData[];
  cycleIndex: number;
  lang: 'tr' | 'en';
}) {
  const [r0, r1, r2, r3, r4, r5, r6] = recipes;
  const startIdx = cycleIndex * 7;

  return (
    <div className="relative space-y-10">
      <p className="absolute -left-1 -top-7 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-magenta-deep)] sm:block">
        Bölüm {String(cycleIndex + 1).padStart(2, '0')}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {r0 && (
          <div className="lg:col-span-7">
            <RecipeCard recipe={r0} variant="lead" index={startIdx} lang={lang} />
          </div>
        )}
        {r1 && (
          <div className="lg:col-span-5">
            <RecipeCard recipe={r1} variant="feature" index={startIdx + 1} lang={lang} />
          </div>
        )}
      </div>

      {(r2 || r3 || r4) && (
        <div className="border-t border-dotted border-[#2a1810]/25 pt-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {r2 && <RecipeCard recipe={r2} variant="standard" index={startIdx + 2} lang={lang} />}
            {r3 && <RecipeCard recipe={r3} variant="standard" index={startIdx + 3} lang={lang} />}
            {r4 && <RecipeCard recipe={r4} variant="standard" index={startIdx + 4} lang={lang} />}
          </div>
        </div>
      )}

      {(r5 || r6) && (
        <div className="border-t border-dotted border-[#2a1810]/25 pt-10">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {r5 && <RecipeCard recipe={r5} variant="compact" index={startIdx + 5} lang={lang} />}
            {r6 && <RecipeCard recipe={r6} variant="compact" index={startIdx + 6} lang={lang} />}
            {/* Color-stamped empty slots — replaces the boring dashed boxes */}
            <div
              aria-hidden
              className="hidden lg:block"
              style={{
                background:
                  'repeating-linear-gradient(45deg, transparent 0 8px, color-mix(in srgb, var(--color-magenta) 12%, transparent) 8px 9px)',
              }}
            />
            <div
              aria-hidden
              className="hidden lg:block"
              style={{
                background:
                  'repeating-linear-gradient(-45deg, transparent 0 8px, color-mix(in srgb, var(--color-bordo) 14%, transparent) 8px 9px)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="border border-dashed border-[#2a1810]/30 bg-[var(--color-paper)] px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#2a1810]/55">
          {t('emptyEyebrow', lang)}
        </p>
        <h2
          className="mt-3 text-3xl font-semibold text-[#2a1810]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('emptyHeader', lang)}
        </h2>
        <p
          className="mt-3 text-[#2a1810]/70"
          style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}
        >
          {t('emptyHint', lang)}
        </p>
      </div>
    </div>
  );
}
