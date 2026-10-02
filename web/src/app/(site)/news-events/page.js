import { getNewsEvents, getActiveTheme } from '@/lib/api';
import { NewsEventCard } from '@/components/NewsEventCard';
import { Pagination } from '@/components/Pagination';
import { CategoryFilter } from '@/components/CategoryFilter';

export const metadata = {
  title: 'News & Events',
  description: 'Latest news, events and achievements from The Manthan School.',
};

export const dynamic = 'force-dynamic';

const CATEGORIES = ['News', 'Event', 'Achievement'];

export default async function NewsEventsPage({ searchParams }) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const page = Math.max(parseInt(pageParam || '1', 10) || 1, 1);
  const category = CATEGORIES.includes(categoryParam) ? categoryParam : undefined;
  const [{ items, pagination }, theme] = await Promise.all([
    getNewsEvents(page, 9, category),
    getActiveTheme(),
  ]);
  const isPlayful = theme === 'playful';
  const extraParams = category ? `&category=${category}` : '';

  if (isPlayful) {
    return (
      <main className="theme-playful bg-[#fdf0f6] px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e4136f]">The Event Diary</p>
            <h1 className="font-display mt-3 text-4xl text-[#0f1b3d] sm:text-5xl" style={{ fontWeight: 800 }}>
              News &amp; Events
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-slate-600">
              Catch up on everything happening at The Manthan School.
            </p>
          </div>

          <CategoryFilter active={category} theme={theme} />

          {items.length === 0 ? (
            <p className="mt-20 text-center text-slate-400">No items found.</p>
          ) : (
            <>
              <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <NewsEventCard key={item._id} item={item} theme={theme} priority={page === 1 && index === 0} />
                ))}
              </div>
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                basePath="/news-events"
                theme={theme}
                extraParams={extraParams}
              />
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-gold)]">The Journal</p>
          <h1 className="font-display mt-3 text-4xl text-[var(--color-ink)] sm:text-5xl">
            News &amp; Events
          </h1>
          <div className="gold-rule mx-auto mt-6" />
          <p className="mx-auto mt-6 max-w-xl text-[var(--color-ink-soft)]/80">
            Catch up on everything happening at The Manthan School.
          </p>
        </div>

        <CategoryFilter active={category} theme={theme} />

        {items.length === 0 ? (
          <p className="mt-20 text-center text-[var(--color-ink-soft)]/60">No items found.</p>
        ) : (
          <>
            <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <NewsEventCard key={item._id} item={item} priority={page === 1 && index === 0} />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              basePath="/news-events"
              extraParams={extraParams}
            />
          </>
        )}
      </div>
    </main>
  );
}
