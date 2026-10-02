'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { fetchAdminNewsEvents, deleteNewsEvent } from '@/lib/adminApi';
import { resolveImage } from '@/lib/api';
import { Drawer } from '@/components/Drawer';
import { NewsEventForm } from '@/components/NewsEventForm';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';
import { Skeleton } from '@/components/Skeleton';

const categoryColors = {
  News: 'bg-blue-100 text-blue-700',
  Event: 'bg-pink-100 text-pink-700',
  Achievement: 'bg-amber-100 text-amber-700',
};

export default function AdminNewsEventsPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [editingItem, setEditingItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = useCallback(async (p) => {
    const data = await fetchAdminNewsEvents(p, 9);
    setItems(data.items);
    setPagination(data.pagination);
    setLoading(false);
  }, []);

  useEffect(() => {
    // fetch on page change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void load(page);
  }, [page, load]);

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    await deleteNewsEvent(id);
    load(page);
  }

  function openCreate() {
    setEditingItem(null);
    setDrawerOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setDrawerOpen(true);
  }

  function handleSaved() {
    setDrawerOpen(false);
    load(page);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-ink)]">News &amp; Events</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]/70">
            Manage everything that appears in the public Journal.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-ink-soft)]"
        >
          <Plus size={16} strokeWidth={2} />
          Add new
        </button>
      </div>

      <div className="mt-6 flex items-center gap-1 rounded-lg bg-white p-1 ring-1 ring-black/5 w-fit">
        <button
          onClick={() => setView('grid')}
          aria-label="Card view"
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === 'grid' ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          <LayoutGrid size={16} strokeWidth={1.75} />
          Cards
        </button>
        <button
          onClick={() => setView('list')}
          aria-label="List view"
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === 'list' ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          <List size={16} strokeWidth={1.75} />
          List
        </button>
      </div>

      {loading ? (
        <NewsEventsSkeleton view={view} />
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No items yet.</p>
      ) : view === 'grid' ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsEventCard key={item._id} item={item} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <ImageWithSkeleton src={resolveImage(item.image)} alt={item.title} fill loading="lazy" className="object-cover" />
                      </div>
                      <span className="font-medium text-[var(--color-ink)] line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${categoryColors[item.category]}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(item.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <ActionIcons item={item} onEdit={openEdit} onDelete={handleDelete} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                n === page ? 'bg-[var(--color-gold)] text-white' : 'bg-white ring-1 ring-black/10'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingItem ? 'Edit News / Event' : 'Add News / Event'}
      >
        <NewsEventForm key={editingItem?._id || 'new'} item={editingItem} onSaved={handleSaved} />
      </Drawer>
    </div>
  );
}

function NewsEventsSkeleton({ view }) {
  if (view === 'list') {
    return (
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="ml-auto h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionIcons({ item, onEdit, onDelete }) {
  return (
    <>
      <Link
        href={`/news-events/${item.slug}`}
        target="_blank"
        aria-label="View on site"
        className="text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
      >
        <Eye size={17} strokeWidth={1.75} />
      </Link>
      <button
        onClick={() => onEdit(item)}
        aria-label="Edit"
        className="text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
      >
        <Pencil size={17} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => onDelete(item._id)}
        aria-label="Delete"
        className="text-[var(--color-ink-soft)] transition hover:text-red-600"
      >
        <Trash2 size={17} strokeWidth={1.75} />
      </button>
    </>
  );
}

function NewsEventCard({ item, onEdit, onDelete }) {
  const date = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <ImageWithSkeleton src={resolveImage(item.image)} alt={item.title} fill loading="lazy" className="object-cover" />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColors[item.category]}`}
        >
          {item.category}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {item.published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-[var(--color-ink-soft)]/60">{date}</p>
        <h3 className="mt-1 font-display text-base leading-snug text-[var(--color-ink)] line-clamp-1">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]/80 line-clamp-2">{item.shortDescription}</p>

        <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
          <ActionIcons item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
