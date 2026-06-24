const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const fieldMessage = data?.fields && Object.values(data.fields)[0];
    throw new Error(fieldMessage || data?.message || 'No fue posible conectar con BorderSync');
  }
  return data;
}

export function login(credentials) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export function register(user) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(user) });
}

export function getCurrentUser(token) {
  return request('/api/auth/me', { token });
}

export function getUsers(token) {
  return request('/api/admin/users', { token });
}

export function updateUserAccess(token, id, changes) {
  return request(`/api/admin/users/${id}/access`, {
    method: 'PATCH', token, body: JSON.stringify(changes),
  });
}
