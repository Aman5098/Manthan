'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, Link2, X } from 'lucide-react';
import { createNewsEvent, updateNewsEvent } from '@/lib/adminApi';
import { resolveImage } from '@/lib/api';

export function NewsEventForm({ item, onSaved }) {
  const [title, setTitle] = useState(item?.title || '');
  const [category, setCategory] = useState(item?.category || 'News');
  const [date, setDate] = useState(item ? item.date.slice(0, 10) : '');
  const [shortDescription, setShortDescription] = useState(item?.shortDescription || '');
  const [content, setContent] = useState(item?.content || '');
  const [published, setPublished] = useState(item?.published ?? false);

  const [imageMode, setImageMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const previewSrc = file
    ? URL.createObjectURL(file)
    : imageMode === 'url' && imageUrl
      ? imageUrl
      : item?.image
        ? resolveImage(item.image)
        : null;

  function handleFile(f) {
    if (!f) return;
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('date', date);
    formData.append('shortDescription', shortDescription);
    formData.append('content', content);
    formData.append('published', String(published));
    if (imageMode === 'upload' && file) formData.append('image', file);
    if (imageMode === 'url' && imageUrl.trim()) formData.append('imageUrl', imageUrl.trim());

    try {
      if (item) {
        await updateNewsEvent(item._id, formData);
      } else {
        await createNewsEvent(formData);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Field label="Title">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="field-input">
            <option value="News">News</option>
            <option value="Event">Event</option>
            <option value="Achievement">Achievement</option>
          </select>
        </Field>
        <Field label="Date">
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field-input"
          />
        </Field>
      </div>

      <Field label="Image">
        <div className="mb-3 flex gap-1 rounded-lg bg-black/5 p-1 w-fit">
          <button
            type="button"
            onClick={() => setImageMode('upload')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              imageMode === 'upload' ? 'bg-white text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-soft)]'
            }`}
          >
            <UploadCloud size={14} strokeWidth={2} />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setImageMode('url')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              imageMode === 'url' ? 'bg-white text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-soft)]'
            }`}
          >
            <Link2 size={14} strokeWidth={2} />
            Image URL
          </button>
        </div>

        {imageMode === 'upload' ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition ${
              dragOver ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-[var(--color-line)] hover:border-[var(--color-gold)]/60'
            }`}
          >
            <UploadCloud size={22} strokeWidth={1.5} className="text-[var(--color-ink-soft)]/50" />
            <p className="text-sm text-[var(--color-ink-soft)]">
              {file ? file.name : 'Drag an image here, or click to browse'}
            </p>
            <p className="text-xs text-[var(--color-ink-soft)]/50">JPG, PNG or WebP &middot; max 2MB</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        ) : (
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="field-input"
          />
        )}

        {previewSrc && (
          <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg bg-black/5">
            <Image src={previewSrc} alt="Preview" fill unoptimized className="object-cover" />
            {imageMode === 'upload' && file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        {item && !file && imageMode === 'upload' && (
          <p className="mt-2 text-xs text-[var(--color-ink-soft)]/60">Leave empty to keep the existing image.</p>
        )}
      </Field>

      <Field label="Short description">
        <textarea
          required
          maxLength={300}
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="field-input resize-none"
        />
      </Field>

      <Field label="Content">
        <textarea
          required
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="field-input resize-none"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)]">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-gold)]"
        />
        Published
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--color-ink)] py-3 text-sm font-semibold text-[var(--color-cream)] transition hover:bg-[var(--color-gold)] disabled:opacity-50"
      >
        {loading ? 'Saving...' : item ? 'Save changes' : 'Create'}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink-soft)]">{label}</label>
      {children}
    </div>
  );
}
