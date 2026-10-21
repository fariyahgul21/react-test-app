import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { APP_NAME } from '@/utils/constants';

// Layout for public pages: navbar on top, footer at the bottom, page in between.
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {APP_NAME}
      </footer>
    </div>
  );
}
