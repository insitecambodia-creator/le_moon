// Offer of the month. Each offer has a real text caption so Google (and people
// on slow connections) can read it, not just the poster.
// Monthly update: put the poster in src/assets/offers/, edit this list, commit.
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/offers/*.{jpg,jpeg,png,webp}', { eager: true });
const img = (file: string) => images[`../assets/offers/${file}`]?.default;

export interface Offer {
  title: string;
  when: string;
  text: string;
  image?: ImageMetadata;
  imageAlt: string;
  /** Hidden automatically after this date (YYYY-MM-DD, Phnom Penh time). */
  until?: string;
}

export const offersMonth = 'November 2026';

const all: Offer[] = [
  {
    title: '2+1 on selected wines',
    when: 'Every day',
    text: 'Buy two glasses or bottles of our selected wines and get the third free.',
    image: img('daily-wine.jpg'),
    imageAlt: 'Red and white wine bottles and glasses on the terrace',
  },
  {
    title: 'Free Anchor White draft with fried rice',
    when: 'Every day',
    text: 'Get one free Anchor White draft with any fried rice order.',
    image: img('anchor-fried-rice.jpg'),
    imageAlt: 'Fried rice clay pots and a draft beer above the riverside',
  },
  {
    title: 'Free glass of wine with On the Grill',
    when: 'Every Tuesday',
    text: 'Order from our On the Grill menu and enjoy a free glass of wine from our selection.',
    image: img('tuesday-wine.jpg'),
    imageAlt: 'Grilled steak, calamari, corn and fries',
  },
  {
    title: '2+1 cocktails',
    when: 'Every Friday',
    text: 'Buy two and get the third free on three selected cocktails and one mocktail.',
    image: img('friday-cocktails.jpg'),
    imageAlt: 'Four colourful cocktails with the river behind',
  },
  {
    title: '2+1 mocktails',
    when: 'Every Saturday',
    text: 'Buy two and get the third free on all mocktails.',
    image: img('saturday-mocktails.jpg'),
    imageAlt: 'Mocktails in front of a pagoda roof',
  },
  {
    title: 'Buy 1 get 1 free on all pizzas',
    when: 'Every Sunday, 5pm to 8pm',
    text: 'Order any pizza and get a second one free.',
    image: img('sunday-pizza.jpg'),
    imageAlt: 'Close-up of freshly baked pizzas',
  },
  {
    title: 'Friends Set',
    when: 'Sharing set',
    text: 'A Hawaii pizza, chicken karaage, a steak and fries salad and a pitcher of Tiger draft to share.',
    image: img('friends-set.jpg'),
    imageAlt: 'Pizza, chicken karaage, steak salad and a pitcher of beer',
  },
  {
    title: 'Family Set',
    when: 'Sharing set',
    text: 'Surf and turf, a chicken and sausage pizza, a Niçoise salad and six bottles of Tiger Crystal.',
    image: img('family-set.jpg'),
    imageAlt: 'Surf and turf platter, pizza, salad and a bucket of beer',
  },
];

export const offers = all.filter((o) => !o.until || new Date(`${o.until}T23:59:59+07:00`) > new Date());
