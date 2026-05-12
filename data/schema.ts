import type {
  Category,
  Period,
  Realm,
  Season,
  Difficulty,
  Region,
} from './taxonomies';

/**
 * Full TypeScript schema for a recipe.
 * MDX frontmatter is parsed and validated against this shape.
 */

export interface RecipeSource {
  /** Title of the cookbook or document */
  title: string;
  /** Author (if known) */
  author?: string;
  /** Year of publication */
  year?: number;
  /** Page or chapter reference */
  reference?: string;
  /** URL if digitised */
  url?: string;
}

export interface Nutrition {
  /** Per portion. Pre-calculated once, stored statically. */
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  sodium_mg?: number;
}

export interface Ingredient {
  name: string;
  /** Numeric quantity (e.g. 4, 0.5) */
  qty: number | null;
  /** Unit (g, ml, adet, çay kaşığı, yemek kaşığı, tutam, küçük, büyük…) */
  unit: string | null;
  /** Notes — "iri doğranmış", "oda sıcaklığında" vb. */
  note?: string;
  /** If this is part of a sub-recipe (e.g. "Beğendi", "Üst kısım") */
  group?: string;
}

export interface Step {
  /** Step number, 1-indexed */
  n: number;
  /** Optional sub-recipe heading */
  group?: string;
  /** Text of the step */
  text: string;
  /** Estimated time in minutes (sum of all gives total cook time) */
  minutes?: number;
  /** Optional temperature reference (oven, etc.) */
  temp?: string;
}

export interface RecipeFrontmatter {
  slug: string;
  title: { tr: string; en: string };
  /** Names from old sources (Osmanlıca etc.) */
  alt_names?: string[];
  /** Optional name in Arabic script */
  arabic?: string;

  /** Brief tagline / one-liner */
  tagline?: { tr: string; en: string };

  category: Category;
  period: Period;
  realm: Realm;
  season: Season;
  region?: Region;
  difficulty: Difficulty;

  /** Times in minutes */
  prep_min: number;
  cook_min: number;
  total_min: number;

  /** Number of servings the modern recipe yields */
  serves: number;

  /** Pre-calculated, stored statically. */
  nutrition: Nutrition;

  ingredients: Ingredient[];
  steps: Step[];

  tips?: string[];
  storage?: string;

  sources: RecipeSource[];

  /** Hero image — local path or remote URL */
  hero_image: string;
  /** Original scraped URL — kept for AI-vs-original comparison. Set automatically by sync-hero-paths.mjs. */
  original_image?: string;
  /** Optional hero video (MP4). When present, the cinemagraph plays it instead of animating the photo. */
  hero_video?: string;
  hero_alt?: { tr: string; en: string };

  /** Publishing meta */
  draft?: boolean;
  published_at?: string; // ISO date
}
