import Link from 'next/link';

export function Pagination({ page, pages, basePath, theme = 'default' }) {
  if (pages <= 1) return null;

  const isPlayful = theme === 'playful';
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  if (isPlayful) {
    return (
      <nav className="mt-20 flex items-center justify-center gap-8">
        <Link
          href={`${basePath}?page=${Math.max(page - 1, 1)}`}
          aria-disabled={page === 1}
          className={`text-sm font-bold ${
            page === 1 ? 'pointer-events-none text-slate-300' : 'text-[#0f1b3d] hover:text-[#e4136f]'
          }`}
        >
          Prev
        </Link>

        <div className="flex items-center gap-2">
          {pageNumbers.map((n) => (
            <Link
              key={n}
              href={`${basePath}?page=${n}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                n === page
                  ? 'bg-[#e4136f] text-white'
                  : 'text-[#0f1b3d] hover:bg-[#e4136f]/10'
              }`}
            >
              {n}
            </Link>
          ))}
        </div>

        <Link
          href={`${basePath}?page=${Math.min(page + 1, pages)}`}
          aria-disabled={page === pages}
          className={`text-sm font-bold ${
            page === pages ? 'pointer-events-none text-slate-300' : 'text-[#0f1b3d] hover:text-[#e4136f]'
          }`}
        >
          Next
        </Link>
      </nav>
    );
  }

  return (
    <nav className="mt-20 flex items-center justify-center gap-8">
      <Link
        href={`${basePath}?page=${Math.max(page - 1, 1)}`}
        aria-disabled={page === 1}
        className={`eyebrow ${
          page === 1
            ? 'pointer-events-none text-[var(--color-ink-soft)]/30'
            : 'text-[var(--color-ink)] hover:text-[var(--color-gold)]'
        }`}
      >
        Prev
      </Link>

      <div className="flex items-center gap-4">
        {pageNumbers.map((n) => (
          <Link
            key={n}
            href={`${basePath}?page=${n}`}
            className={`font-display text-sm ${
              n === page
                ? 'text-[var(--color-gold)] underline underline-offset-4'
                : 'text-[var(--color-ink-soft)] hover:text-[var(--color-gold)]'
            }`}
          >
            {n}
          </Link>
        ))}
      </div>

      <Link
        href={`${basePath}?page=${Math.min(page + 1, pages)}`}
        aria-disabled={page === pages}
        className={`eyebrow ${
          page === pages
            ? 'pointer-events-none text-[var(--color-ink-soft)]/30'
            : 'text-[var(--color-ink)] hover:text-[var(--color-gold)]'
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
