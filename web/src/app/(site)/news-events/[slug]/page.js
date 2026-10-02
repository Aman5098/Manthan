import { notFound } from 'next/navigation';
import { getNewsEventBySlug, resolveImage, getActiveTheme } from '@/lib/api';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getNewsEventBySlug(slug);

  if (!item) return { title: 'Not found' };

  return {
    title: item.title,
    description: item.shortDescription,
  };
}

export default async function NewsEventDetailPage({ params }) {
  const { slug } = await params;
  const [item, theme] = await Promise.all([getNewsEventBySlug(slug), getActiveTheme()]);

  if (!item) notFound();

  const date = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (theme === 'playful') {
    return (
      <main className="theme-playful bg-[#fdf0f6] px-6 py-24 sm:px-10">
        <article className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e4136f]">
              {item.category} &middot; {date}
            </p>
            <h1 className="font-display mt-4 text-4xl leading-tight text-[#0f1b3d] sm:text-5xl" style={{ fontWeight: 800 }}>
              {item.title}
            </h1>
          </div>

          <div className="relative mt-14 aspect-video w-full overflow-hidden rounded-2xl bg-white shadow-sm">
            <ImageWithSkeleton src={resolveImage(item.image)} alt={item.title} fill loading="lazy" className="object-cover" />
          </div>

          <div className="prose prose-neutral mx-auto mt-14 max-w-none whitespace-pre-wrap text-slate-700 prose-p:leading-relaxed">
            {item.content}
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
      <article className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-gold)]">
            {item.category} &middot; {date}
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
            {item.title}
          </h1>
          <div className="gold-rule mx-auto mt-8" />
        </div>

        <div className="relative mt-14 aspect-video w-full overflow-hidden bg-[var(--color-cream-dark)]">
          <ImageWithSkeleton src={resolveImage(item.image)} alt={item.title} fill loading="lazy" className="object-cover" />
        </div>

        <div className="prose prose-neutral mx-auto mt-14 max-w-none whitespace-pre-wrap text-[var(--color-ink-soft)] prose-p:leading-relaxed">
          {item.content}
        </div>
      </article>
    </main>
  );
}
