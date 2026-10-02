export function SiteFooter({ theme = 'default' }) {
  if (theme === 'playful') {
    return (
      <footer className="theme-playful bg-[#0f1b3d] px-6 py-14 text-center text-white sm:px-10">
        <p className="font-display text-xl font-extrabold">The Manthan School</p>
        <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#e4136f]" />
        <p className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} The Manthan School &middot; All rights reserved
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-[var(--color-ink)] px-6 py-14 text-center text-[var(--color-cream)] sm:px-10">
      <p className="font-display text-xl">The Manthan School</p>
      <div className="gold-rule mx-auto my-5" />
      <p className="eyebrow text-white/50">
        &copy; {new Date().getFullYear()} The Manthan School &middot; All rights reserved
      </p>
    </footer>
  );
}
