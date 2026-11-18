# le_moon

New website for Le Moon Rooftop Lounge (https://www.le-moon-rooftop.com/), moving from WordPress/Elementor on Cloudways to a static Astro site on Cloudflare Workers.

Preview: https://le-moon.franck-a71.workers.dev/ (never indexed, see below).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:4321 (pages only, no booking API) |
| `npm run build` | Build the static site into `dist/` (also writes `_redirects` and `_headers`) |
| `npx wrangler dev` | Serve `dist/` with the Worker, booking API included, at http://localhost:8787 |
| `npx wrangler deploy` | Deploy (Cloudflare Workers Builds runs this on every merge to main) |

## Where things live

| What | File |
|---|---|
| Phone, Telegram, address, hours, IDs, site-wide notice | `src/lib/site.ts` |
| Menu PDFs (fixed URLs `/menus/food.pdf`, `/menus/drinks.pdf`, `/menus/kids.webp`) | `public/menus/`, date in `src/lib/menus.ts` |
| Offers of the month | `src/data/offers.ts`, posters in `src/assets/offers/` |
| Gallery | drop photos in `src/assets/gallery/`, alt text in `src/data/gallery.ts` |
| Booking forms | `src/components/BookingForm.astro`, rules in `src/lib/booking.ts` |
| Booking API and 410s | `worker/index.ts`, see [docs/booking.md](docs/booking.md) |
| Old URL → new URL (301) and removed pages (410) | `redirects.mjs` |
| Meta, Open Graph, JSON-LD | `src/layouts/BaseLayout.astro`, `src/lib/structured-data.ts` |
| Interface text (for future languages) | `src/i18n/en.ts` |

### Monthly update

1. Menus: replace `public/menus/food.pdf` and `drinks.pdf` (same names), change `updated` in `src/lib/menus.ts`.
2. Offers: add the posters to `src/assets/offers/`, edit the list in `src/data/offers.ts` (each offer needs a short text).
3. Commit to a branch, open a PR, check the preview, merge.

### Booking closed / special notice

Set `notice` in `src/lib/site.ts`, for example
`{ text: 'Fully booked on 31 December, walk-ins only', until: '2026-12-31' }`.
It shows as a bar on every page and hides itself after the date.

## Indexing switch

`PUBLIC_ALLOW_INDEXING` decides whether search engines may index a build. Unset (previews): every page gets `noindex, nofollow`, every response an `X-Robots-Tag: noindex` header, and robots.txt says `Disallow: /`. Set it to `true` **only** in the production build variables.

## Build variables and secrets

See [.env.example](.env.example) and [docs/booking.md](docs/booking.md). GTM (`PUBLIC_GTM_ID=GTM-NZ9MLHT`) only loads when set, after the first interaction or 3 seconds.
