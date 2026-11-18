// @ts-check
import { defineConfig } from 'astro/config';

// Static output, deployed to Cloudflare (Workers static assets).
export default defineConfig({
  site: 'https://www.le-moon-rooftop.com',
  output: 'static',
});
