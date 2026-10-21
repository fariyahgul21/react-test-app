import { api } from './client';
import { USE_MOCK } from '@/utils/constants';
import { sleep } from '@/utils/helpers';

// One file per backend resource: auth.api.js, users.api.js, orders.api.js ...
// Mock branches let the template run without a backend. Delete them when your API is ready.

export async function login(credentials) {
  if (USE_MOCK) {
    await sleep(500);
    if (!credentials.email || !credentials.password) throw new Error('Email and password are required');
    return {
      accessToken: 'mock-token',
      user: { id: 1, name: credentials.email.split('@')[0], email: credentials.email, role: 'admin' },
    };
  }
  return api.post('/auth/login', credentials);
}

export async function getMe() {
  if (USE_MOCK) {
    const saved = localStorage.getItem('mock_user');
    if (!saved) throw new Error('Not logged in');
    return { user: JSON.parse(saved) };
  }
  return api.get('/auth/me');
}

export async function logout() {
  if (USE_MOCK) return;
  return api.post('/auth/logout');
}
