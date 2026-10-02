'use client';

import { useEffect, useState, useCallback } from 'react';
import { RotateCw, Eye } from 'lucide-react';
import { fetchAdminEnquiries, updateEnquiryStatus, retryEnquiryCRM } from '@/lib/adminApi';
import { Skeleton } from '@/components/Skeleton';
import { Modal } from '@/components/Modal';

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
  const [retryingId, setRetryingId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

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

  async function handleRetryCRM(id) {
    setRetryingId(id);
    try {
      await retryEnquiryCRM(id);
      await load(page, status);
    } finally {
      setRetryingId(null);
    }
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
                <th className="px-4 py-3 text-right">Details</th>
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
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${crmColors[e.crmStatus]}`}>
                        {e.crmStatus}
                      </span>
                      {e.crmStatus === 'Failed' && (
                        <button
                          onClick={() => handleRetryCRM(e._id)}
                          disabled={retryingId === e._id}
                          aria-label="Retry CRM push"
                          className="text-gray-400 transition hover:text-[var(--color-gold)] disabled:opacity-40"
                        >
                          <RotateCw size={14} strokeWidth={2} className={retryingId === e._id ? 'animate-spin' : ''} />
                        </button>
                      )}
                    </div>
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
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedEnquiry(e)}
                      aria-label="View details"
                      className="text-[var(--color-ink-soft)] transition hover:text-[var(--color-gold)]"
                    >
                      <Eye size={17} strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
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

      <Modal
        open={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title="Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="space-y-4 text-sm">
            <DetailRow label="Parent Name" value={selectedEnquiry.parentName} />
            <DetailRow label="Student Name" value={selectedEnquiry.studentName} />
            <DetailRow label="Class Applied For" value={selectedEnquiry.classAppliedFor} />
            <DetailRow label="Mobile" value={selectedEnquiry.mobile} />
            <DetailRow label="Email" value={selectedEnquiry.email || '—'} />
            <DetailRow
              label="Message"
              value={selectedEnquiry.message || '—'}
              multiline
            />
            <DetailRow
              label="Received"
              value={new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
            />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">CRM Status</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${crmColors[selectedEnquiry.crmStatus]}`}
                >
                  {selectedEnquiry.crmStatus}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Status</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[selectedEnquiry.status]}`}
                >
                  {selectedEnquiry.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value, multiline = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
      <p className={`mt-1 text-[var(--color-ink)] ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
    </div>
  );
}
