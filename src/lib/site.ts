// One place for Le Moon's contact details, hours and IDs.
// Items marked CONFIRM still need a final answer from Le Moon.

export const site = {
  name: 'Le Moon Rooftop Lounge',
  shortName: 'Le Moon',
  tagline: "Phnom Penh's favourite rooftop lounge",
  url: (import.meta.env.PUBLIC_SITE_URL || 'https://www.le-moon-rooftop.com').replace(/\/$/, ''),
  allowIndexing: import.meta.env.PUBLIC_ALLOW_INDEXING === 'true',
  gtmId: import.meta.env.PUBLIC_GTM_ID || '',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',

  // CONFIRM: three numbers appear on the old site (087 600 236 home, 087 600 163
  // bookings, 087 600 867 manager). This one is used everywhere for now.
  phone: { display: '087 600 236', e164: '+85587600236' },
  telegram: { handle: 'le_moon_rooftop', url: 'https://t.me/le_moon_rooftop' },
  email: '', // CONFIRM: no public email on the old site

  // CONFIRM: street address and map pin.
  address: {
    venue: 'Amanjaya Pancam Hotel, rooftop',
    street: '#1 Street 154, Sisowath Quay',
    locality: 'Phnom Penh',
    country: 'KH',
  },
  geo: { lat: 11.5713, lng: 104.9282 },
  mapEmbed: 'https://maps.google.com/maps?q=Le%20Moon%20Rooftop%20Phnom%20Penh&t=m&z=16&output=embed',
  mapLink: 'https://maps.google.com/?q=Le+Moon+Rooftop+Phnom+Penh',

  // Open daily from 5pm. CONFIRM closing time.
  hours: { days: 'Every day', opens: '17:00', closes: '00:00', label: 'Open daily from 5pm' },

  // Filled from the old site's footer once it is reachable again.
  social: [] as { name: string; url: string }[],

  facebookAppId: '456412858255270',
  facebookDomainVerification: '', // copy the content value from the old site's <meta>
  googleSiteVerification: '', // only if Search Console uses a meta tag
};

export const nav = [
  { href: '/menu/', label: 'Menu' },
  { href: '/offers/', label: 'Offers' },
  { href: '/birthday/', label: 'Birthdays' },
  { href: '/groups/', label: 'Groups' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/contact/', label: 'Contact' },
];

/**
 * Site-wide notice (replaces the old "booking closed" popup). Set to null to hide.
 * It disappears by itself after `until` (a date in Phnom Penh time), both at build
 * time and in the browser, so a stale notice never lingers.
 */
export const notice: { text: string; until: string; href?: string } | null = null;
