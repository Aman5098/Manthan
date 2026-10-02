'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Drawer } from '@/components/Drawer';

export function SiteHeader({ theme = 'default' }) {
  const [open, setOpen] = useState(false);
  const isPlayful = theme === 'playful';

  if (isPlayful) {
    return (
      <header className="theme-playful sticky top-0 z-30 bg-[#0f1b3d]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="font-display text-base font-extrabold tracking-wide text-white sm:text-lg">
            The Manthan School
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/news-events" className="text-sm font-semibold text-white/80 transition hover:text-white">
              News &amp; Events
            </Link>
            <Link href="/#enquiry" className="text-sm font-semibold text-white/80 transition hover:text-white">
              Admissions
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#enquiry"
              className="hidden rounded-full bg-[#e4136f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c71062] sm:inline-block"
            >
              Book a Visit
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-white transition hover:bg-white/10 md:hidden"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <Drawer open={open} onClose={() => setOpen(false)} title="Menu">
          <nav className="flex flex-col gap-6">
            <Link href="/news-events" onClick={() => setOpen(false)} className="text-sm font-semibold text-[#0f1b3d]">
              News &amp; Events
            </Link>
            <Link href="/#enquiry" onClick={() => setOpen(false)} className="text-sm font-semibold text-[#0f1b3d]">
              Admissions
            </Link>
            <Link
              href="/#enquiry"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-[#e4136f] px-5 py-3 text-center text-sm font-bold text-white"
            >
              Book a Visit
            </Link>
          </nav>
        </Drawer>
      </header>
    );
  }

  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-cream)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        <Link href="/" className="font-display text-base tracking-wide text-[var(--color-ink)] sm:text-lg">
          The Manthan School
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/news-events"
            className="eyebrow text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
          >
            News &amp; Events
          </Link>
          <Link
            href="/#enquiry"
            className="eyebrow text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
          >
            Admissions
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#enquiry"
            className="eyebrow hidden border border-[var(--color-ink)] px-5 py-2.5 text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] sm:inline-block"
          >
            Enquire
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2 text-[var(--color-ink)] transition hover:bg-black/5 md:hidden"
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} title="Menu">
        <nav className="flex flex-col gap-6">
          <Link
            href="/news-events"
            onClick={() => setOpen(false)}
            className="eyebrow text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
          >
            News &amp; Events
          </Link>
          <Link
            href="/#enquiry"
            onClick={() => setOpen(false)}
            className="eyebrow text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
          >
            Admissions
          </Link>
          <Link
            href="/#enquiry"
            onClick={() => setOpen(false)}
            className="eyebrow mt-4 border border-[var(--color-ink)] px-5 py-3 text-center text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
          >
            Enquire
          </Link>
        </nav>
      </Drawer>
    </header>
  );
}
