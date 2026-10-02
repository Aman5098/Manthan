const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function resolveImage(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.replace(/\/api\/?$/, '');
  return `${base}${path}`;
}

export async function getLatestNewsEvents() {
  const res = await fetch(`${API_URL}/news-events/latest`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to load latest news & events');
  const data = await res.json();
  return data.items;
}

export async function getNewsEvents(page = 1, limit = 9, category) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set('category', category);

  const res = await fetch(`${API_URL}/news-events?${params.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to load news & events');
  return res.json();
}

export async function getNewsEventBySlug(slug) {
  const res = await fetch(`${API_URL}/news-events/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load item');
  const data = await res.json();
  return data.item;
}

export async function getActiveTheme() {
  try {
    const res = await fetch(`${API_URL}/theme`, { next: { revalidate: 30 } });
    if (!res.ok) return 'default';
    const data = await res.json();
    return data.theme || 'default';
  } catch {
    return 'default';
  }
}

export async function submitEnquiry(payload) {
  const res = await fetch(`${API_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.errors) return { ok: false, errors: data.errors };
    return { ok: false, error: data.error || 'Something went wrong. Please try again.' };
  }

  return { ok: true, message: data.message };
}
