const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setToken(token) {
  localStorage.setItem('admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('admin_token');
}

async function authedFetch(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    // clears stale state
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/admin/login';
    }
  }

  return res;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchAdminStats() {
  const res = await authedFetch('/admin/stats');
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

export async function fetchAdminNewsEvents(page = 1, limit = 10) {
  const res = await authedFetch(`/admin/news-events?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load items');
  return res.json();
}

export async function fetchAdminNewsEvent(id) {
  const res = await authedFetch(`/admin/news-events/${id}`);
  if (!res.ok) throw new Error('Failed to load item');
  return res.json();
}

export async function createNewsEvent(formData) {
  const res = await authedFetch('/admin/news-events', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create item');
  return data;
}

export async function updateNewsEvent(id, formData) {
  const res = await authedFetch(`/admin/news-events/${id}`, { method: 'PUT', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update item');
  return data;
}

export async function deleteNewsEvent(id) {
  const res = await authedFetch(`/admin/news-events/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
  return res.json();
}

export async function fetchAdminEnquiries(page = 1, limit = 10, status) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);
  const res = await authedFetch(`/admin/enquiries?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load enquiries');
  return res.json();
}

export async function fetchAdminTheme() {
  const res = await authedFetch('/admin/theme');
  if (!res.ok) throw new Error('Failed to load theme');
  return res.json();
}

export async function updateAdminTheme(theme) {
  const res = await authedFetch('/admin/theme', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update theme');
  return data;
}

export async function updateEnquiryStatus(id, status) {
  const res = await authedFetch(`/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update status');
  return data;
}
