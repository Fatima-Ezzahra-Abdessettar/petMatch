// app/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Helper to set/remove Authorization header
export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Initialize from localStorage if present
try {
  let token = localStorage.getItem('token');

  // One-time migration: if `token` is missing but legacy `auth_token` exists,
  // copy it to the new `token` key so existing sessions remain valid.
  if (!token) {
    const legacy = localStorage.getItem('auth_token');
    if (legacy) {
      try {
        localStorage.setItem('token', legacy);
        localStorage.removeItem('auth_token');
      } catch (e) {
        // Ignore storage errors
      }
      token = legacy;
    }
  }

  if (token) setAuthToken(token);
} catch (e) {
  // localStorage may be unavailable in some contexts (SSR/tests)
}

export default api;