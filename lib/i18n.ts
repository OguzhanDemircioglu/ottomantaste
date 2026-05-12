/**
 * Minimal i18n table for chrome strings (page UI, not recipe content).
 * Recipe titles / taglines / ingredients are localized via `localized()` from
 * lib/title.ts using the recipe's own bilingual fields.
 *
 * Reading flow:
 *   - URL search param `?lang=en` → English; otherwise Turkish (default).
 *   - Server pages await searchParams, call `getLang(sp.lang)`, then pass it
 *     down to client components as a prop. No dynamic imports, no provider.
 */

export type Lang = 'tr' | 'en';

export function getLang(value: unknown): Lang {
  return value === 'en' ? 'en' : 'tr';
}

const STRINGS = {
  // Filter tabs
  all:           { tr: 'Tümü',       en: 'All' },
  // Result strip / counters (kept here in case future surfaces use them)
  showing:       { tr: 'Görüntülenen', en: 'Showing' },
  recipes:       { tr: 'tarif',      en: 'recipes' },

  // Recipe meta
  minutes:       { tr: 'dk',         en: 'min' },
  servesPeople:  { tr: 'kişi',       en: 'people' },
  kcal:          { tr: 'kcal',       en: 'kcal' },

  // Detail page section headers
  ingredients:   { tr: 'Malzeme',     en: 'Ingredients' },
  method:        { tr: 'Hazırlanışı', en: 'Method' },
  tips:          { tr: 'İncelikleri', en: 'Notes' },
  storage:       { tr: 'Saklama',     en: 'Storage' },
  sources:       { tr: 'Kaynaklar',   en: 'Sources' },
  back:          { tr: 'Sahifeye dön', en: 'Back to index' },

  // Index footer
  indexHeader:   { tr: 'Fihrist-i Tarifler', en: 'Index of Recipes' },
  indexEyebrow:  { tr: 'Sahifenin sonu · Dizin', en: 'End of page · Index' },
  indexLede:     { tr: 'Alfabetik sırayla — el altında.', en: 'In alphabetical order — within reach.' },

  // Empty state
  emptyHeader:   { tr: 'Bu süzgeç altında tarif yok.', en: 'No recipes match this filter.' },
  emptyEyebrow:  { tr: 'Sahife boş', en: 'Empty page' },
  emptyHint:     { tr: 'Farklı bir bölüm seçin veya tüm külliyâta dönün.', en: 'Pick a different section or return to the full collection.' },

  // Today widget
  today:         { tr: 'Bugünün tarifi', en: 'Today’s recipe' },

  // Navigation chrome
  nav_search:    { tr: 'Ara',          en: 'Search' },
  nav_favs:      { tr: 'Favoriler',    en: 'Favorites' },
  nav_map:       { tr: 'Harita',       en: 'Map' },
  loadMore:      { tr: 'Daha fazla göster', en: 'Show more' },
  noFavs:        { tr: 'Henüz favoriniz yok. Bir tarifin sağ üstündeki kalbe basın.', en: 'No favorites yet. Tap the heart on any recipe.' },
  searchPh:      { tr: 'Tarif ara — başlık, etiket, malzeme…', en: 'Search recipes — title, tagline, ingredient…' },
  searchEmpty:   { tr: 'Eşleşen tarif yok.', en: 'No matching recipes.' },
  searchHint:    { tr: 'Yazmaya başlayın.',  en: 'Start typing.' },
  closeLabel:    { tr: 'Kapat', en: 'Close' },

  // Feedback section
  fb_eyebrow:      { tr: 'Bize yazın',                              en: 'Write to us' },
  fb_title:        { tr: 'Öneri ve görüşlerinizi bize bildirin.',   en: 'Send us your suggestions and feedback.' },
  fb_lede:         { tr: 'Eksik bulduğunuz bir tarif, bir kaynak önerisi veya yalın bir teşekkür — hepsi bize ulaşır.', en: 'A missing recipe, a source you’d add, or simply a thank-you — all of it reaches us.' },
  fb_email_label:  { tr: 'E-posta',  en: 'Email' },
  fb_email_ph:     { tr: 'sizin@adresiniz.com', en: 'you@example.com' },
  fb_message_label:{ tr: 'Mesajınız', en: 'Your message' },
  fb_message_ph:   { tr: 'Düşüncelerinizi yazın…', en: 'Type your message…' },
  fb_send:         { tr: 'Gönder',     en: 'Send' },
  fb_sending:      { tr: 'Gönderiliyor…', en: 'Sending…' },
  fb_success:      { tr: 'Mesajınız bize ulaştı, teşekkürler.', en: 'Your message reached us, thank you.' },
  fb_err_email:    { tr: 'Geçerli bir e-posta giriniz.', en: 'Please enter a valid email.' },
  fb_err_msg:      { tr: 'Mesajınız çok kısa.', en: 'Your message is too short.' },
  fb_err_server:   { tr: 'Şu an gönderilemedi, biraz sonra deneyin.', en: 'Couldn’t send right now, please try again shortly.' },

  // Recipe-card meta + CTA
  goRecipe:      { tr: 'Tarife git', en: 'Open recipe' },
  steps:         { tr: 'adım', en: 'steps' },
  difficulty:    { tr: 'Zorluk', en: 'Difficulty' },
  diff_kolay:    { tr: 'Kolay', en: 'Easy' },
  diff_orta:     { tr: 'Orta',  en: 'Medium' },
  diff_zor:      { tr: 'Zor',   en: 'Hard' },
  ingredients_label: { tr: 'Ana malzemeler', en: 'Main ingredients' },

  // Categories — chrome label + label per slug
  cat_corba:     { tr: 'Çorbalar', en: 'Soups' },
  cat_et:        { tr: 'Et',       en: 'Meat' },
  cat_kebap:     { tr: 'Kebap',    en: 'Kebabs' },
  cat_sarma:     { tr: 'Sarma',    en: 'Wraps' },
  cat_pilav:     { tr: 'Pilav',    en: 'Pilaf' },
  cat_meze:      { tr: 'Meze',     en: 'Meze' },
  cat_borek:     { tr: 'Börek',    en: 'Pastries' },
  cat_tatli:     { tr: 'Tatlı',    en: 'Desserts' },
  cat_serbet:    { tr: 'Şerbet',   en: 'Sherbets' },
  cat_helva:     { tr: 'Helva',    en: 'Halva' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}

/** Convenience helper for category labels. */
export function categoryLabel(slug: string, lang: Lang): string {
  const key = `cat_${slug}` as StringKey;
  return key in STRINGS ? STRINGS[key][lang] : slug;
}
