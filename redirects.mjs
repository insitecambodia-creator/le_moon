// Old WordPress addresses → new pages. Every entry becomes a 301 in dist/_redirects,
// written with and without the trailing slash. Add any old URL that still gets
// traffic (Search Console → Pages, Analytics → landing pages) before launch.
export const redirects = {
  '/the-menu-le-moon-rooftop/': '/menu/',
  '/special-offer-of-the-month/': '/offers/',
  '/special-offers-for-this-month/': '/offers/',
  '/special-offers-for-this-month/confirm-your-booking/': '/booking/',
  '/le-moon-birthday-party/': '/birthday/',
  '/le-moon-birthday-party/thank-you-birthday-booking/': '/birthday/',
  '/thank-you-birthday-booking-vip/': '/birthday/',
  '/booking-a-table-at-le-moon/': '/booking/',
  '/table-reservations-le-moon/': '/booking/',
  '/thank-you-booking/': '/booking/',
  '/social-gathering-phnom-penh/': '/groups/',
  '/le-moon-image-gallery/': '/gallery/',
  '/contact-le-moon/': '/contact/',
  '/terms-services/': '/terms/',
  '/privacy-policy-2/': '/privacy/',
  '/author/avy/': '/',
  '/author/franck/': '/',
  '/feed/': '/',
  '/comments/feed/': '/',
  // Old WordPress sitemaps → the new one
  '/wp-sitemap.xml': '/sitemap-index.xml',
  '/sitemap.xml': '/sitemap-index.xml',
  '/sitemap_index.xml': '/sitemap-index.xml',
  '/wp-sitemap-posts-page-1.xml': '/sitemap-index.xml',
  '/wp-sitemap-posts-e-landing-page-1.xml': '/sitemap-index.xml',
  '/wp-sitemap-users-1.xml': '/sitemap-index.xml',
  // Menu PDFs and images linked from the old site, QR codes and social posts
  '/wp-content/uploads/2024/05/DRINK-MENU-web.pdf': '/menus/drinks.pdf',
  '/wp-content/uploads/2026/10/LMN-Drink-Menu-01112026.pdf': '/menus/drinks.pdf',
  '/wp-content/uploads/2026/10/LMN-Food-Menu-01112026.pdf': '/menus/food.pdf',
  '/wp-content/uploads/2024/06/Kid_menu-2024-scaled.webp': '/menu/',
};

// Past event pages, removed on purpose (Franck, 18 Nov 2026). The Worker answers
// 410 Gone for these so search engines drop them quickly. Keep in sync with
// run_worker_first in wrangler.jsonc (scripts/check-config.mjs checks this).
export const gone = [
  '/countdown-2025/',
  '/davidwazo-renaissance-tour-2025/',
  '/le-moon-xmas-with-heineken/',
  '/blue-souls-event/',
  '/miss-sarawan-and-friends/',
  '/international-womens-day/',
  '/phnom-penh-funketeers/',
];
