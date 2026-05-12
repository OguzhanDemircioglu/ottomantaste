import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { RecipeFrontmatter } from '@/data/schema';

const RECIPES_DIR = path.join(process.cwd(), 'data', 'recipes');

export interface Recipe extends RecipeFrontmatter {
  /** Markdown body content (everything below frontmatter) */
  body: string;
}

/**
 * Read all recipe MDX files from data/recipes/.
 * Build-time only — uses fs synchronously.
 * Returns recipes sorted by published_at desc, drafts excluded by default.
 */
export function getAllRecipes(opts: { includeDrafts?: boolean } = {}): Recipe[] {
  if (!fs.existsSync(RECIPES_DIR)) return [];

  const files = fs
    .readdirSync(RECIPES_DIR)
    .filter((f) => f.endsWith('.mdx'));

  const recipes = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const fullPath = path.join(RECIPES_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    return { ...(data as RecipeFrontmatter), slug, body: content } as Recipe;
  });

  return recipes
    .filter((r) => opts.includeDrafts || !r.draft)
    .sort((a, b) => {
      if (!a.published_at) return 1;
      if (!b.published_at) return -1;
      return b.published_at.localeCompare(a.published_at);
    });
}

/**
 * Find a single recipe by slug.
 */
export function getRecipeBySlug(slug: string): Recipe | null {
  const all = getAllRecipes({ includeDrafts: true });
  return all.find((r) => r.slug === slug) ?? null;
}

/**
 * Filter helpers — all run at build-time.
 */
export function filterRecipes(
  recipes: Recipe[],
  filter: {
    category?: string;
    period?: string;
    realm?: string;
    season?: string;
    region?: string;
  },
): Recipe[] {
  return recipes.filter((r) => {
    if (filter.category && r.category !== filter.category) return false;
    if (filter.period && r.period !== filter.period) return false;
    if (filter.realm && r.realm !== filter.realm) return false;
    if (filter.season && r.season !== filter.season) return false;
    if (filter.region && r.region !== filter.region) return false;
    return true;
  });
}
