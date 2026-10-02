import fs from 'node:fs';
import path from 'node:path';
import NewsEvent from '../models/NewsEvent.js';
import { generateUniqueSlug } from '../utils/slug.js';

export async function list(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    NewsEvent.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    NewsEvent.countDocuments({}),
  ]);

  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getOne(req, res) {
  const item = await NewsEvent.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
}

export async function create(req, res) {
  const { title, category, date, shortDescription, content, published, imageUrl } = req.body;

  if (!title || !category || !date || !shortDescription || !content) {
    return res.status(422).json({ error: 'All fields are required' });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : imageUrl?.trim();
  if (!image) {
    return res.status(422).json({ error: 'An image file or image URL is required' });
  }

  const slug = await generateUniqueSlug(title);

  const item = await NewsEvent.create({
    title: title.trim(),
    slug,
    category,
    date,
    image,
    shortDescription: shortDescription.trim(),
    content,
    published: published === 'true' || published === true,
  });

  res.status(201).json({ item });
}

export async function update(req, res) {
  const existing = await NewsEvent.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { title, category, date, shortDescription, content, published, imageUrl } = req.body;

  if (title && title.trim() !== existing.title) {
    existing.slug = await generateUniqueSlug(title, existing._id);
    existing.title = title.trim();
  }
  if (category) existing.category = category;
  if (date) existing.date = date;
  if (shortDescription) existing.shortDescription = shortDescription.trim();
  if (content) existing.content = content;
  if (published !== undefined) existing.published = published === 'true' || published === true;

  if (req.file) {
    const oldPath = path.resolve('.' + existing.image);
    existing.image = `/uploads/${req.file.filename}`;
    fs.unlink(oldPath, () => {});
  } else if (imageUrl?.trim() && imageUrl.trim() !== existing.image) {
    existing.image = imageUrl.trim();
  }

  await existing.save();
  res.json({ item: existing });
}

export async function remove(req, res) {
  const item = await NewsEvent.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });

  const imgPath = path.resolve('.' + item.image);
  fs.unlink(imgPath, () => {});

  res.json({ message: 'Deleted' });
}
