/**
 * Recipe title formatter.
 *
 * Rules:
 *  - TR locale → use Turkish title only.
 *  - EN locale → keep Turkish title, append English in parentheses.
 *    Example: "Hünkâr Beğendi (Sultan's Delight)"
 *  - If Turkish & English are identical (proper noun like "Mutancana"), no parens.
 */

type TitleField = string | { tr?: string; en?: string } | undefined;

export function formatRecipeTitle(
  title: TitleField,
  fallback: string,
  locale: string,
): string {
  if (!title) return fallback;

  // Plain string title
  if (typeof title === 'string') return title;

  const tr = title.tr?.trim();
  let en = title.en?.trim();

  // Always anchor on the Turkish title (the "real" name).
  const turkish = tr || en || fallback;

  // Normalise title.en if author wrote "Aşure (Noah's Pudding)" — extract the parens content.
  if (en && tr) {
    const prefix = tr + ' (';
    if (en.startsWith(prefix) && en.endsWith(')')) {
      en = en.slice(prefix.length, -1).trim();
    }
  }

  if (locale === 'en' && en && en !== tr) {
    return `${turkish} (${en})`;
  }
  return turkish;
}

/**
 * Same logic for taglines / hero alt etc.
 * For these, we DO swap to the locale's preferred language (no parens).
 */
export function localized(
  field: TitleField,
  fallback: string | undefined,
  locale: string,
): string {
  if (!field) return fallback ?? '';
  if (typeof field === 'string') return field;
  return field[locale === 'en' ? 'en' : 'tr'] ?? field.tr ?? field.en ?? fallback ?? '';
}
