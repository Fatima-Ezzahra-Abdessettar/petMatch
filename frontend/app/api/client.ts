// ✅ This is better
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
  const token = localStorage.getItem('token');
  if (token) setAuthToken(token);
} catch (e) {
  // localStorage may be unavailable in some contexts (SSR/tests)
}

export default api;