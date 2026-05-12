/**
 * Per-category accent colors — references the OKLCH tokens defined in
 * globals.css. Returns the var() name; consumers spread it into inline styles
 * or class attributes.
 *
 * Why a function: keeps the truth-source in CSS (one place), but lets us pick
 * a fallback for unknown / future categories.
 */
export type CategorySlug =
  | 'corba' | 'et' | 'kebap' | 'sarma' | 'pilav'
  | 'meze' | 'borek' | 'tatli' | 'serbet' | 'helva';

const VAR_BY_CAT: Record<string, string> = {
  corba:  '--cat-corba',
  et:     '--cat-et',
  kebap:  '--cat-kebap',
  sarma:  '--cat-sarma',
  pilav:  '--cat-pilav',
  meze:   '--cat-meze',
  borek:  '--cat-borek',
  tatli:  '--cat-tatli',
  serbet: '--cat-serbet',
  helva:  '--cat-helva',
};

export function categoryColor(slug: string): string {
  return `var(${VAR_BY_CAT[slug] ?? '--color-magenta'})`;
}
