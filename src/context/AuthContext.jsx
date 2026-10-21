import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '@/api/auth.api';
import { tokenStorage } from '@/api/client';
import { USE_MOCK } from '@/utils/constants';

export const AuthContext = createContext(null);

// Global auth state: who is logged in, plus login/logout actions.
// Read it in any component with the useAuth() hook.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    if (!tokenStorage.get()) {
      setLoading(false);
      return;
    }
    authApi
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  // The API client fires this event when the session can't be refreshed
  useEffect(() => {
    const onForcedLogout = () => setUser(null);
    window.addEventListener('auth:logout', onForcedLogout);
    return () => window.removeEventListener('auth:logout', onForcedLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    tokenStorage.set(data.accessToken);
    if (USE_MOCK) localStorage.setItem('mock_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clear();
      localStorage.removeItem('mock_user');
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
