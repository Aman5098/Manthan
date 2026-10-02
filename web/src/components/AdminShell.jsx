'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Newspaper, MessageSquare, Palette, LogOut, Menu, X } from 'lucide-react';
import { getToken, clearToken } from '@/lib/adminApi';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/news-events', label: 'News & Events', icon: Newspaper },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/themes', label: 'Themes', icon: Palette },
];

export function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const hasToken = typeof window !== 'undefined' && !!getToken();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoginPage && !hasToken) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, hasToken, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) return <>{children}</>;

  if (!hasToken) return null;

  function handleLogout() {
    clearToken();
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-cream-dark)]">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[var(--color-ink)] px-4 py-4 text-white lg:hidden">
        <p className="font-display text-base">The Manthan School</p>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-1.5 hover:bg-white/10"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
      </header>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-[var(--color-ink)] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-7">
          <div>
            <p className="font-display text-lg">The Manthan School</p>
            <p className="mt-0.5 text-xs text-white/50">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden px-4 py-8 pt-20 sm:px-6 sm:py-10 lg:px-8 lg:pt-10">
        {children}
      </main>
    </div>
  );
}
