import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <p className="text-slate-600">This page doesn't exist.</p>
      <Link to={ROUTES.HOME} className="text-sm font-medium text-brand-700 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
