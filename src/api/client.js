import { API_URL, TOKEN_KEY } from '@/utils/constants';

/**
 * Centralized HTTP client built on the Fetch API.
 * RULE: components never call fetch() directly - they call functions in src/api/*.api.js,
 * which use this client. Base URL, auth headers, token refresh and errors are handled here.
 */

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

let refreshPromise = null;

// Uses the refresh token in an HTTP-only cookie to get a new access token.
async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new ApiError('Session expired', res.status);
        const data = await res.json();
        tokenStorage.set(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, { method = 'GET', body, headers = {}, retry = true } = {}) {
  const token = tokenStorage.get();
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include', // send HTTP-only cookies
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // Access token expired -> try refresh once, then replay the request
  if (res.status === 401 && retry && !path.startsWith('/auth/')) {
    try {
      await refreshAccessToken();
      return request(path, { method, body, headers, retry: false });
    } catch {
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:logout'));
      throw new ApiError('Session expired, please log in again', 401);
    }
  }

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
