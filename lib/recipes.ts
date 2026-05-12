import type { RecipeFrontmatter } from '@/data/schema';
import generated from '@/data/recipes.generated.json';

export interface Recipe extends RecipeFrontmatter {
  /** Markdown body content (everything below frontmatter) */
  body: string;
}

/**
 * Recipes are bundled into the build output by scripts/build-recipes-json.mjs
 * (run via the `prebuild` npm hook). This lets the app run on edge runtimes
 * like Cloudflare Workers where data/recipes/ is not available on disk.
 */
const ALL: Recipe[] = generated as unknown as Recipe[];

/**
 * Return all recipes, sorted by published_at desc, drafts excluded by default.
 */
export function getAllRecipes(opts: { includeDrafts?: boolean } = {}): Recipe[] {
  return ALL
    .filter((r) => opts.includeDrafts || !r.draft)
    .slice()
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
  return ALL.find((r) => r.slug === slug) ?? null;
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
