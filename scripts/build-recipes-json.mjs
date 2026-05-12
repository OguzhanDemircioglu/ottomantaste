#!/usr/bin/env node
/**
 * Build-time recipe bundler.
 *
 * Reads every data/recipes/*.mdx file at build time and emits a single
 * data/recipes.generated.json that lib/recipes.ts statically imports.
 *
 * Why: at runtime on Cloudflare Workers the data/recipes/ directory does
 * not exist on disk, so fs.readFileSync() returns nothing and pages 404.
 * A static JSON import is bundled into the Worker by the compiler, so the
 * data ships with the deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RECIPES_DIR = path.join(ROOT, 'data', 'recipes');
const OUT_FILE = path.join(ROOT, 'data', 'recipes.generated.json');

if (!fs.existsSync(RECIPES_DIR)) {
  console.warn(`[recipes] ${RECIPES_DIR} does not exist — writing empty bundle`);
  fs.writeFileSync(OUT_FILE, '[]\n');
  process.exit(0);
}

const files = fs.readdirSync(RECIPES_DIR).filter((f) => f.endsWith('.mdx'));

const recipes = files.map((file) => {
  const slug = file.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(RECIPES_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  return { ...data, slug, body: content };
});

fs.writeFileSync(OUT_FILE, JSON.stringify(recipes) + '\n');
console.log(
  `[recipes] wrote ${recipes.length} recipes → ${path.relative(ROOT, OUT_FILE)}`,
);
