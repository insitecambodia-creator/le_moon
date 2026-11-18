# le_moon

Migration of Le Moon Rooftop (https://www.le-moon-rooftop.com/) from WordPress/Elementor on Cloudways to a static Astro site hosted on Cloudflare.

## Commands

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Local dev server at http://localhost:4321      |
| `npm run build`   | Build the static site into `dist/`             |
| `npm run preview` | Preview the built site locally                 |
| `npx wrangler deploy` | Deploy `dist/` to Cloudflare (Workers static assets) |

## Cloudflare

`wrangler.jsonc` serves `dist/` as static assets, with `src/pages/404.astro` as the not-found page.
To deploy from Git, connect this repository in the Cloudflare dashboard (Workers & Pages → Create → Import a repository) with build command `npm run build` and deploy command `npx wrangler deploy`.
