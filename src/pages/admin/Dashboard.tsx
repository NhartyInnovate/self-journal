import { useEffect, useState } from 'react';

type Stats = {
  totalPreorders: number;
  paidPreorders: number;
  pendingPayments: number;
  totalRevenue: number;
  copiesReserved: number;
  currentBookPrice: number;
  currency: string;
  releaseDate: string;
  preordersOpen: boolean;
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/admin/stats?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return <div className="text-red-500">Failed to load dashboard statistics.</div>;
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${stats.preordersOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          Preorders: {stats.preordersOpen ? 'OPEN' : 'CLOSED'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue, stats.currency)} />
        <StatCard title="Copies Reserved" value={stats.copiesReserved.toString()} />
        <StatCard title="Paid Preorders" value={stats.paidPreorders.toString()} />
        <StatCard title="Pending Payments" value={stats.pendingPayments.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Current Product Price</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(stats.currentBookPrice, stats.currency)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Configured Release Date</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.releaseDate}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Preorders (Including Pending)</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalPreorders}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
