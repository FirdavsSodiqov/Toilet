import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';

export function StatCard({ title, value, change, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-600">
            <ArrowUpRight className="h-4 w-4" />
            {change}
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
