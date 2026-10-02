'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, FileCheck, FilePen, MessageSquare, AlertTriangle } from 'lucide-react';
import { fetchAdminStats } from '@/lib/adminApi';
import { Skeleton } from '@/components/Skeleton';

const statCards = [
  { key: 'totalNewsEvents', label: 'News & Events', icon: Newspaper, href: '/admin/news-events' },
  { key: 'published', label: 'Published', icon: FileCheck, href: '/admin/news-events' },
  { key: 'draft', label: 'Drafts', icon: FilePen, href: '/admin/news-events' },
  { key: 'totalEnquiries', label: 'Enquiries', icon: MessageSquare, href: '/admin/enquiries' },
  { key: 'newEnquiries', label: 'New Enquiries', icon: MessageSquare, href: '/admin/enquiries' },
  { key: 'crmFailed', label: 'CRM Failed', icon: AlertTriangle, href: '/admin/enquiries' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdminStats().then(setStats);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--color-ink)]">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]/70">
        A quick look at news, events and admissions enquiries.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats
          ? statCards.map(({ key, label, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
              >
                <Icon size={20} strokeWidth={1.75} className="text-[var(--color-gold)]" />
                <p className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">{stats[key]}</p>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]/70">{label}</p>
              </Link>
            ))
          : Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="mt-3 h-7 w-12" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-[var(--color-ink)]">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-[var(--color-gold)] hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {!stats &&
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  </tr>
                ))}
              {stats?.recentEnquiries?.map((e) => (
                <tr key={e._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{e.parentName}</td>
                  <td className="px-4 py-3">{e.studentName}</td>
                  <td className="px-4 py-3">{e.classAppliedFor}</td>
                  <td className="px-4 py-3">{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">{e.status}</td>
                </tr>
              ))}
              {stats && stats.recentEnquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
