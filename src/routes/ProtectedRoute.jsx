import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import { ROUTES } from '@/utils/constants';

/**
 * Wrap private routes with this. Optionally restrict by role:
 *   <Route element={<ProtectedRoute roles={['admin']} />}> ... </Route>
 */
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
}
