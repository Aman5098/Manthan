'use client';

import Link from 'next/link';
import { resolveImage } from '@/lib/api';
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton';

export function NewsEventCard({ item, theme = 'default', priority = false }) {
  const date = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (theme === 'playful') {
    return (
      <Link href={`/news-events/${item.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <ImageWithSkeleton
            src={resolveImage(item.image)}
            alt={item.title}
            fill
            priority={priority}
            {...(!priority && { loading: 'lazy' })}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#e4136f]">
            {item.category} &middot; {date}
          </p>
          <h3 className="font-display mt-2 text-lg leading-snug text-[#0f1b3d]">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {item.shortDescription}
          </p>
          <span className="mt-4 inline-block text-sm font-bold text-[#e4136f]">Read more &rarr;</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news-events/${item.slug}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-cream-dark)]">
        <ImageWithSkeleton
          src={resolveImage(item.image)}
          alt={item.title}
          fill
          priority={priority}
          {...(!priority && { loading: 'lazy' })}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <p className="eyebrow mt-5 text-[var(--color-gold)]">
        {item.category} &middot; {date}
      </p>
      <h3 className="font-display mt-2 text-xl leading-snug text-[var(--color-ink)]">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]/80 line-clamp-2">
        {item.shortDescription}
      </p>
      <span className="mt-4 inline-block border-b border-transparent text-sm text-[var(--color-ink)] transition group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]">
        Read more
      </span>
    </Link>
  );
}
