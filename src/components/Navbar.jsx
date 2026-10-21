import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME, ROUTES } from '@/utils/constants';
import logo from '@/assets/logo.svg';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-semibold text-slate-900">
          <img src={logo} alt="" className="h-7 w-7" />
          {APP_NAME}
        </Link>
        <Link
          to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {isAuthenticated ? 'Dashboard' : 'Log in'}
        </Link>
      </nav>
    </header>
  );
}
