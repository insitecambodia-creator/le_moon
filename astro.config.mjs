// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { redirects } from './redirects.mjs';

const site = process.env.PUBLIC_SITE_URL || 'https://www.le-moon-rooftop.com';
const allowIndexing = process.env.PUBLIC_ALLOW_INDEXING === 'true';

// Pages that never go in the sitemap (confirmations, legal drafts handled per page).
// Privacy and terms are drafts until Le Moon approves them; remove them from
// this list (and the noindex prop on those pages) once they do.
const notInSitemap = ['/booking/thank-you/', '/birthday/thank-you/', '/groups/thank-you/', '/404/', '/privacy/', '/terms/'];

/** Writes dist/_redirects (301s) and dist/_headers after the build. */
function cloudflareFiles() {
  return {
    name: 'le-moon-cloudflare-files',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const lines = [];
        for (const [from, to] of Object.entries(redirects)) {
          lines.push(`${from} ${to} 301`);
          if (from.endsWith('/')) lines.push(`${from.slice(0, -1)} ${to} 301`);
        }
        writeFileSync(fileURLToPath(new URL('_redirects', dir)), lines.join('\n') + '\n');

        const headers = [
          '/*',
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
        ];
        // Second guard for previews: no indexing header on every response.
        if (!allowIndexing) headers.push('  X-Robots-Tag: noindex, nofollow');
        headers.push('', '/_astro/*', '  Cache-Control: public, max-age=31536000, immutable');
        headers.push('', '/menus/*', '  Cache-Control: public, max-age=3600');
        writeFileSync(fileURLToPath(new URL('_headers', dir)), headers.join('\n') + '\n');
      },
    },
  };
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    // English only at launch. Add 'fr', 'km' or 'zh' here later: they get a
    // prefix (/fr/menu/) and English URLs never change.
    locales: ['en'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !notInSitemap.some((p) => new URL(page).pathname === p),
    }),
    cloudflareFiles(),
  ],
});
