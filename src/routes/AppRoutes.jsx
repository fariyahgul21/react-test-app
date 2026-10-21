import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import { ROUTES } from '@/utils/constants';

// All routes in one place. Add a page: create it in src/pages, then register it here.
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>

      {/* Private pages - require login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
