import NewsEvent from '../models/NewsEvent.js';

export async function listPublished(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    NewsEvent.find(filter).sort({ date: -1 }).skip(skip).limit(limit).select('-content'),
    NewsEvent.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function latestPublished(req, res) {
  const items = await NewsEvent.find({ published: true }).sort({ date: -1 }).limit(3).select('-content');
  res.json({ items });
}

export async function getBySlug(req, res) {
  const item = await NewsEvent.findOne({ slug: req.params.slug, published: true });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json({ item });
}
