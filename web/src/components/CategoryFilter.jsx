'use client';

import Link from 'next/link';

const CATEGORIES = ['News', 'Event', 'Achievement'];

export function CategoryFilter({ active, theme = 'default' }) {
  const isPlayful = theme === 'playful';

  const items = [{ label: 'All', value: undefined }, ...CATEGORIES.map((c) => ({ label: c, value: c }))];

  if (isPlayful) {
    return (
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {items.map(({ label, value }) => {
          const isActive = active === value;
          const href = value ? `/news-events?category=${value}` : '/news-events';
          return (
            <Link
              key={label}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? 'bg-[#e4136f] text-white' : 'bg-white text-[#0f1b3d] ring-1 ring-black/10 hover:bg-[#e4136f]/10'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-6">
      {items.map(({ label, value }) => {
        const isActive = active === value;
        const href = value ? `/news-events?category=${value}` : '/news-events';
        return (
          <Link
            key={label}
            href={href}
            className={`eyebrow border-b pb-1 transition ${
              isActive
                ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                : 'border-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-gold)]'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
