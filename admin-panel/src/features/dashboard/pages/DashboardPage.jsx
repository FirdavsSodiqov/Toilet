import { DollarSign, MessageSquare, Star, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { StatCard } from '../components/StatCard';

const stats = [
  { title: 'Total Users', value: '24,892', change: '+12.5%', icon: Users },
  { title: 'Revenue', value: '$128.4K', change: '+8.2%', icon: DollarSign },
  { title: 'Reviews', value: '3,482', change: '+4.8%', icon: Star },
  { title: 'Messages', value: '1,284', change: '+2.1%', icon: MessageSquare }
];

const chartData = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 42000 },
  { month: 'Mar', revenue: 39000 },
  { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 76000 },
  { month: 'Jun', revenue: 84000 }
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <p className="text-sm text-slate-500">Recharts placeholder wired for real analytics data.</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area dataKey="revenue" stroke="#2563eb" fill="url(#revenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
