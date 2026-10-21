import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '@/components/StatCard';
import Spinner from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { getDashboardStats } from '@/api/dashboard.api';
import { formatCurrency } from '@/utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(getDashboardStats);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600">{error.message}</p>;

  const { totals, monthly } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {user?.name}</h1>
        <p className="text-sm text-slate-500">Sample data from src/api/dashboard.api.js</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={totals.users.toLocaleString()} icon={Users} />
        <StatCard label="Revenue" value={formatCurrency(totals.revenue)} icon={DollarSign} />
        <StatCard label="Orders" value={totals.orders} icon={ShoppingCart} />
        <StatCard label="Growth" value={`${totals.growth}%`} icon={TrendingUp} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Monthly revenue</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} fill="#ccfbf1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
