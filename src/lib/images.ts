import type { ImageMetadata } from 'astro';

// Photos are picked up from src/assets by file name, so adding a photo is just
// dropping a file in the folder. Astro resizes and converts them at build time.
const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });
const gallery = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp}', { eager: true });

const byName = (mods: Record<string, { default: ImageMetadata }>) =>
  Object.fromEntries(Object.entries(mods).map(([path, mod]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), mod.default]));

const photoMap = byName(photos);

/** A named photo from src/assets/photos (e.g. photo('hero')), or undefined if missing. */
export const photo = (name: string): ImageMetadata | undefined => photoMap[name];

/** Every gallery photo, sorted by file name. */
export const galleryImages = Object.entries(byName(gallery))
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([name, src]) => ({ name, src }));
