# OttomanTaste

> **Seven centuries, one table.**
> Saraydan halka uzanan mutfak külliyatı — **427 tarif, yedi yüzyıl.**

OttomanTaste, Osmanlı mutfağının saray, halk ve taşra yemeklerini tek bir
dijital arşivde toplayan iki dilli (Türkçe / İngilizce) tarif kitaplığıdır.
Tarihî kaynaklara dayanan tarifler; dönem, hane, mevsim ve bölge eksenlerinde
sınıflanır, modern ölçülerle yeniden yazılır ve nutrition (kcal, makro)
değerleri statik olarak hesaplanmış halde sunulur.

🌐 **Production:** [ottomantaste.com](https://ottomantaste.com)

---

## Özellikler

- **427 tarif** — `data/recipes/*.mdx` içinde frontmatter + Markdown gövde
- **TR / EN** içerik — `?lang=en` query parametresi veya navigasyon ile geçiş
- **Magazine grid** — kategoriye, mevsime ve harf indexine göre dolaşım
- **Today widget** — günün tarifi (deterministik, gün-bazlı seçim)
- **Harita sayfası** (`/harita`) — bölgesel köken görselleştirme
- **Favoriler** (`/favoriler`) — `localStorage` tabanlı, sunucusuz
- **Arama** — JSON tabanlı client-side index (`/api/search-index`)
- **Geri bildirim** — `/api/feedback` Telegram bot üzerinden iletilir
- **Tarihî kaynak referansları** — her tarifin `sources` alanı
- **A11y & SEO** — semantic HTML, `next/font`, parchment grain noise overlay

---

## Teknoloji yığını

| Katman      | Seçim                                                  |
| ----------- | ------------------------------------------------------ |
| Framework   | **Next.js 16.2.6** (App Router, RSC, Turbopack)        |
| Runtime     | **React 19**                                           |
| Dil         | **TypeScript 5**                                       |
| Stil        | **Tailwind CSS v4** (PostCSS plugin)                   |
| İçerik      | **MDX** + `gray-matter` (frontmatter parsing)          |
| Tipografi   | Cormorant SC, Cormorant Italic, Plus Jakarta Sans      |
| İkon        | `lucide-react`                                         |
| Lint        | `eslint` + `eslint-config-next`                        |
| Hosting     | **Cloudflare Workers** (via `@opennextjs/cloudflare`)  |
| Bildirim    | Telegram Bot API (feedback)                            |

---

## Hızlı başlangıç

```bash
# 1) Bağımlılıkları yükle
npm install

# 2) Environment dosyasını hazırla
cp .env.local.example .env.local
# TELEGRAM_BOT_TOKEN ve TELEGRAM_CHAT_ID alanlarını doldur

# 3) Geliştirme sunucusunu başlat
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinde projeyi görebilirsin.

### Telegram chat_id'yi bulmak

1. Telegram'da `@DriverMesh_bot`'a `/start` mesajı gönder.
2. Dev server açıkken [`/api/telegram-init`](http://localhost:3000/api/telegram-init)
   adresini ziyaret et — JSON yanıttan `chat_id` değerini al.
3. `.env.local` içine yapıştır, `npm run dev`'i yeniden başlat.

---

## Proje yapısı

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Kök layout — fontlar, parchment overlay
│   ├── page.tsx              # Ana sayfa: masthead + grid + index + today
│   ├── recipes/[slug]/       # Tek tarif sayfası
│   ├── favoriler/            # Kullanıcı favorileri (localStorage)
│   ├── harita/               # Bölgesel köken haritası
│   └── api/
│       ├── feedback/         # POST → Telegram bot
│       ├── telegram-init/    # chat_id keşfi (dev only)
│       ├── search-index/     # Client-side arama için JSON index
│       └── recipes-by-slugs/ # Toplu tarif sorgulaması
├── components/               # UI bileşenleri
│   ├── masthead.tsx
│   ├── magazine-grid.tsx
│   ├── recipe-card.tsx
│   ├── filter-tabs.tsx
│   ├── alphabet-index.tsx
│   ├── today-widget.tsx
│   ├── feedback-section.tsx
│   ├── harita-map.tsx
│   ├── search-bar.tsx / search-modal.tsx
│   └── ...
├── lib/                      # Saf TS yardımcıları
│   ├── recipes.ts            # MDX okuyucu + filter helpers
│   ├── i18n.ts               # TR/EN string tablosu, dil tespiti
│   ├── title.ts              # Çift dilli başlık seçici
│   ├── story-hooks.ts        # Tarif kartlarına anekdot atayıcı
│   ├── category-colors.ts    # Kategori renk paleti
│   ├── use-favorites.ts      # localStorage hook
│   └── utils.ts              # clsx + tailwind-merge
├── data/
│   ├── recipes/*.mdx         # 427 tarif (frontmatter + Markdown)
│   ├── schema.ts             # Recipe TypeScript şeması
│   ├── taxonomies.ts         # Kategori / dönem / hane / mevsim / bölge
│   ├── subcategories.ts      # Alt sınıflandırma
│   └── image-attributions.json
├── public/recipes/           # Tarif hero görselleri
├── next.config.ts
├── wrangler.jsonc            # Cloudflare Workers config
├── open-next.config.ts       # @opennextjs/cloudflare adapter config
└── package.json
```

---

## Tarif eklemek

Her tarif tek bir `data/recipes/<slug>.mdx` dosyasıdır. Frontmatter şeması
`data/schema.ts` içindeki `RecipeFrontmatter` arayüzüyle aynıdır.

Asgari frontmatter örneği:

```yaml
---
slug: ornek-tarif
title:
  tr: Örnek Tarif
  en: Sample Recipe
tagline:
  tr: Kısa bir tanım
  en: Short tagline
category: ana-yemek         # data/taxonomies.ts
period: klasik              # data/taxonomies.ts
realm: saray                # data/taxonomies.ts
season: yaz                 # bahar | yaz | guz | kis
difficulty: orta            # kolay | orta | zor
prep_min: 20
cook_min: 40
total_min: 60
serves: 4
nutrition:
  kcal: 380
  protein_g: 18
  carbs_g: 32
  fat_g: 17
ingredients:
  - { name: "...", qty: 2, unit: "adet" }
steps:
  - { n: 1, text: "..." }
sources:
  - { title: "Kitâbü't-Tabbâhîn", year: 1844 }
hero_image: /recipes/ornek-tarif.jpg
published_at: 2026-05-12
---

Markdown gövde — anekdot, tarihçe, sunum notları…
```

---

## Komutlar

| Komut              | Açıklama                                              |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`      | Geliştirme sunucusu — `http://localhost:3000`         |
| `npm run build`    | Üretim build — `.next/`                               |
| `npm run start`    | Üretim sunucusu (Node.js)                             |
| `npm run lint`     | ESLint                                                |
| `npm run preview`  | OpenNext build + lokal Workers preview                |
| `npm run deploy`   | Cloudflare Workers'a deploy                           |

---

## Deployment — Cloudflare Workers

Proje [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adaptörüyle
Cloudflare Workers üzerinde çalışır. Statik varlıklar Workers Assets ile,
SSR & API rotaları aynı Worker üzerinde sunulur.

```bash
# Önce wrangler ile auth
npx wrangler login

# Build + deploy
npm run deploy
```

`wrangler.jsonc` içinde:

- `name`: `ottomantaste`
- `compatibility_date`: 2025-09-23
- `compatibility_flags`: `nodejs_compat`
- `main`: `.open-next/worker.js`
- `assets.directory`: `.open-next/assets`

Custom domain (`ottomantaste.com`) Cloudflare DNS + Workers Routes üzerinden
otomatik yönlendirilir.

---

## Environment

| Değişken              | Zorunlu | Açıklama                                          |
| --------------------- | ------- | ------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`  | Evet    | Geri bildirim botunun token'ı                     |
| `TELEGRAM_CHAT_ID`    | Evet    | Mesajların gönderileceği chat                     |

Cloudflare Workers tarafında `npx wrangler secret put TELEGRAM_BOT_TOKEN`
komutu ile encrypted olarak eklenir.

---

## Lisans

İçerik (tarifler, görseller) telif hakları ilgili kaynaklara aittir; bu repo
yalnızca derleme / sunum katmanını barındırır.

Kod © 2026 OttomanTaste.
