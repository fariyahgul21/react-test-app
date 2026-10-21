import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME, ROUTES } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import logo from '@/assets/logo.svg';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/users', label: 'Users', icon: Users, disabled: true },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, disabled: true },
];

// Layout for logged-in pages: sidebar + top bar + page content.
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 px-5 font-semibold">
          <img src={logo} alt="" className="h-7 w-7" />
          {APP_NAME}
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, disabled }) =>
            disabled ? (
              <span key={to} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400">
                <Icon size={18} /> {label}
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                    isActive ? 'bg-brand-50 font-medium text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                  )
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            )
          )}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-800">{user?.email}</span>
          </p>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <LogOut size={16} /> Log out
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
