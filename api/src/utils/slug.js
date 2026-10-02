import slugify from 'slugify';
import NewsEvent from '../models/NewsEvent.js';

export async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await NewsEvent.findOne(query);
    if (!existing) return slug;
    slug = `${base}-${++counter}`;
  }
}
