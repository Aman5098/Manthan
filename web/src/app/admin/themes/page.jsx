'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { fetchAdminTheme, updateAdminTheme } from '@/lib/adminApi';
import { Skeleton } from '@/components/Skeleton';

const THEMES = [
  {
    id: 'default',
    name: 'Classic',
    description: 'The original ink & gold editorial look.',
    swatches: ['#11151c', '#b08d57', '#faf7f2'],
  },
  {
    id: 'playful',
    name: 'Manthan Playful',
    description: 'Bright pink admissions section with a friendly, rounded look.',
    swatches: ['#e4136f', '#ffffff', '#0f1b3d'],
  },
];

export default function ThemesPage() {
  const [activeTheme, setActiveTheme] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminTheme().then((data) => setActiveTheme(data.theme));
  }, []);

  async function handleActivate(themeId) {
    setSaving(true);
    setMessage('');
    try {
      await updateAdminTheme(themeId);
      setActiveTheme(themeId);
      setMessage('Theme updated. The public site now reflects your change.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--color-ink)]">Themes</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]/70">
        Choose how the admissions section of the public site looks.
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
          {message}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {activeTheme === null
          ? Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-2/3" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="mt-5 h-10 w-full" />
              </div>
            ))
          : THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <div
              key={theme.id}
              className={`rounded-2xl bg-white p-6 shadow-sm ring-1 transition ${
                isActive ? 'ring-2 ring-[#e4136f]' : 'ring-black/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-[var(--color-ink)]">{theme.name}</h2>
                {isActive && (
                  <span className="flex items-center gap-1 rounded-full bg-[#e4136f]/10 px-2.5 py-1 text-xs font-semibold text-[#e4136f]">
                    <Check size={14} /> Active
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]/70">{theme.description}</p>

              <div className="mt-4 flex gap-2">
                {theme.swatches.map((color) => (
                  <span
                    key={color}
                    className="h-8 w-8 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <button
                onClick={() => handleActivate(theme.id)}
                disabled={isActive || saving || activeTheme === null}
                className="mt-5 w-full rounded-lg bg-[var(--color-ink)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isActive ? 'Currently Active' : 'Activate'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
