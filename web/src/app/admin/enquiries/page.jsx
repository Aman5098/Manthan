'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchAdminEnquiries, updateEnquiryStatus } from '@/lib/adminApi';
import { Skeleton } from '@/components/Skeleton';

function EnquiriesSkeleton() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const statusColors = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Closed: 'bg-gray-100 text-gray-600',
};

const crmColors = {
  Pending: 'bg-gray-100 text-gray-500',
  Sent: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
};

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p, s) => {
    const data = await fetchAdminEnquiries(p, 10, s || undefined);
    setItems(data.items);
    setPagination(data.pagination);
    setLoading(false);
  }, []);

  useEffect(() => {
    // fetch on page or filter change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void load(page, status);
  }, [page, status, load]);

  async function handleStatusChange(id, newStatus) {
    await updateEnquiryStatus(id, newStatus);
    load(page, status);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Enquiries</h1>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <EnquiriesSkeleton />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">CRM</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{e.parentName}</td>
                  <td className="px-4 py-3">{e.studentName}</td>
                  <td className="px-4 py-3">{e.classAppliedFor}</td>
                  <td className="px-4 py-3">{e.mobile}</td>
                  <td className="px-4 py-3">{new Date(e.createdAt).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${crmColors[e.crmStatus]}`}>
                      {e.crmStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={e.status}
                      onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[e.status]}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                n === page ? 'bg-[var(--color-gold)] text-white' : 'bg-white ring-1 ring-black/10'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
