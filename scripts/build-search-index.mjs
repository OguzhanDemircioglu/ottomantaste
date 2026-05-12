#!/usr/bin/env node
/**
 * Pre-build step that emits public/search-index.json — a compact
 * client-side card directory. Runs after build-recipes-json.mjs.
 *
 * Beyond the original search-only use case (substring match for the
 * search bar), the index now also feeds the /favoriler page, which used
 * to round-trip every visit through /api/recipes-by-slugs. Carrying a
 * handful of extra fields here is a fair trade for killing the Worker
 * route and the 2.2 MB JSON re-import that came with it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'data', 'recipes.generated.json');
const OUT_FILE = path.join(ROOT, 'public', 'search-index.json');

if (!fs.existsSync(RECIPES_FILE)) {
  console.error(`[search-index] missing ${RECIPES_FILE} — run build-recipes-json.mjs first`);
  process.exit(1);
}

const recipes = JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf8'));

function pick(obj, slug, lang) {
  if (typeof obj === 'string') return obj;
  if (obj && typeof obj === 'object') {
    const v = obj[lang];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return lang === 'en' ? slug.replace(/-/g, ' ') : slug.replace(/-/g, ' ');
}

function pickMainIngredients(ingredients) {
  const list = Array.isArray(ingredients) ? ingredients : [];
  const filtered = list.filter((ing) => {
    const g = (ing.group ?? '').toLowerCase();
    return !g.includes('süsle') && !g.includes('garn');
  });
  const out = [];
  const seen = new Set();
  for (const ing of filtered) {
    const cleaned = (ing.name ?? '').replace(/\s*\([^)]*\)\s*/g, '').trim();
    const head = cleaned.split(/[,;·]/)[0]?.trim() ?? cleaned;
    if (head && !seen.has(head.toLowerCase())) {
      seen.add(head.toLowerCase());
      out.push(head);
    }
    if (out.length >= 4) break;
  }
  return out;
}

const index = recipes.map((r) => ({
  slug: r.slug,
  title_tr: pick(r.title, r.slug, 'tr'),
  title_en: pick(r.title, r.slug, 'en'),
  tagline_tr: pick(r.tagline, '', 'tr'),
  tagline_en: pick(r.tagline, '', 'en'),
  category: r.category,
  ingredients: (r.ingredients ?? [])
    .map((i) => (i.name ?? '').replace(/\s*\([^)]*\)\s*/g, '').trim())
    .filter(Boolean)
    .join(' · '),
  hero_image: r.hero_image ?? '/recipes/placeholder.jpg',
  // Card-essential fields (used by /favoriler and any other client-only
  // card renderer to avoid round-trips back to the Worker):
  total_min: r.total_min ?? null,
  serves: r.serves ?? null,
  step_count: Array.isArray(r.steps) ? r.steps.length : 0,
  difficulty: r.difficulty ?? null,
  main_ingredients: pickMainIngredients(r.ingredients),
  period: r.period ?? null,
  realm: r.realm ?? null,
}));

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(index));
const sizeKb = (fs.statSync(OUT_FILE).size / 1024).toFixed(1);
console.log(
  `[search-index] wrote ${index.length} entries → ${path.relative(ROOT, OUT_FILE)} (${sizeKb} KB)`,
);
