const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  let response;
  const savedUser = JSON.parse(localStorage.getItem('owlpi_user') || 'null');
  const token = savedUser?.token;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json', 
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}) 
      },
      ...options,
    });
  } catch (err) {
    const msg = err?.message || '';
    const offline =
      err?.name === 'TypeError' ||
      /failed to fetch|network|load failed|aborted/i.test(msg);
    throw new Error(
      offline
        ? 'Cannot reach the API. Start the backend and set client/.env.development VITE_API_PROXY_PORT to the same port (or set VITE_API_BASE_URL to the API origin).'
        : msg || 'Network error',
      { cause: err },
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success) {
    const err = new Error(payload.message || 'Request failed');
    err.status = response.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

export function canViewDashboard(profile) {
  if (!profile) return false;
  if (profile.role === 'super_admin' || profile.role === 'system_admin' || profile.role === 'GUEST') return true;
  return Boolean(profile.permissions?.canViewAnalytics);
}
