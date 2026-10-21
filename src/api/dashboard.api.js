import { api } from './client';
import { USE_MOCK } from '@/utils/constants';
import { sleep } from '@/utils/helpers';

const MOCK_STATS = {
  totals: { users: 1284, revenue: 48250, orders: 312, growth: 12.4 },
  monthly: [
    { month: 'Jan', revenue: 3200 },
    { month: 'Feb', revenue: 4100 },
    { month: 'Mar', revenue: 3800 },
    { month: 'Apr', revenue: 5200 },
    { month: 'May', revenue: 6100 },
    { month: 'Jun', revenue: 5900 },
    { month: 'Jul', revenue: 7300 },
  ],
};

export async function getDashboardStats() {
  if (USE_MOCK) {
    await sleep(400);
    return MOCK_STATS;
  }
  return api.get('/dashboard/stats');
}
