#!/usr/bin/env node
/**
 * Pre-build step that emits public/search-index.json — a compact
 * client-side substring search index. Run after build-recipes-json.mjs
 * (which it reads from).
 *
 * Why this is a static file rather than an API route:
 * - The index only changes when recipes change (deploy boundary).
 * - Serving it from public/ lets Cloudflare's edge cache it with
 *   `Cache-Control: immutable` indefinitely — no Worker invocation.
 * - It also avoids re-bundling the full 2.2 MB recipes JSON into the
 *   Worker just to ship a ~150 kB search payload.
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

const index = recipes.map((r) => ({
  slug: r.slug,
  title_tr: pick(r.title, r.slug, 'tr'),
  title_en: pick(r.title, r.slug, 'en'),
  tagline:
    pick(r.tagline, '', 'tr') || pick(r.tagline, '', 'en') || '',
  category: r.category,
  ingredients: (r.ingredients ?? [])
    .map((i) => (i.name ?? '').replace(/\s*\([^)]*\)\s*/g, '').trim())
    .filter(Boolean)
    .join(' · '),
  hero_image: r.hero_image,
}));

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(index));
console.log(
  `[search-index] wrote ${index.length} entries → ${path.relative(ROOT, OUT_FILE)} (${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} KB)`,
);
