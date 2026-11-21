import { site } from './site';

const abs = (path: string) => new URL(path, site.url + '/').toString();

export function businessSchema() {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    '@id': abs('/#business'),
    name: site.name,
    alternateName: 'Le Moon Rooftop',
    description:
      'Rooftop lounge bar and restaurant on top of the Amanjaya Pancam Hotel, overlooking the Tonle Sap and Mekong rivers in Phnom Penh. Cocktails, food and live music, open daily from 5pm.',
    url: abs('/'),
    telephone: site.phone.e164,
    ...(site.email ? { email: site.email } : {}),
    image: [abs('/og/default.jpg')],
    logo: abs('/brand/logo-on-white.png'),
    priceRange: '$$',
    servesCuisine: ['Cocktails', 'Khmer', 'International'],
    acceptsReservations: abs('/booking/'),
    hasMenu: abs('/menu/'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.venue}, ${site.address.street}`,
      addressLocality: site.address.locality,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayNames,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    name: site.name,
    url: abs('/'),
    inLanguage: 'en',
    publisher: { '@id': abs('/#business') },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
