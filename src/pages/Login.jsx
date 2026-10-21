import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, USE_MOCK } from '@/utils/constants';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Where to go after login (the page the user originally wanted)
  const redirectTo = location.state?.from?.pathname || ROUTES.DASHBOARD;

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
          {USE_MOCK && <p className="mt-1 text-sm text-slate-500">Mock mode: any email and password will work.</p>}
        </div>
        <Input id="email" name="email" type="email" label="Email" value={form.email} onChange={handleChange} required />
        <Input id="password" name="password" type="password" label="Password" value={form.password} onChange={handleChange} required />
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>
    </div>
  );
}
