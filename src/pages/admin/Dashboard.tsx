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
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#111111] mb-2">Dashboard</h2>
          <p className="text-gray-500">Monitor your book's preorder performance and revenue.</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase ${stats.preordersOpen ? 'bg-[#70C12E]/10 text-[#70C12E] border border-[#70C12E]/20' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          {stats.preordersOpen ? 'Preorders Open' : 'Preorders Closed'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Highlighted Card */}
        <div className="bg-gradient-to-br from-[#111111] to-[#222222] p-6 rounded-3xl shadow-lg border border-[#333333] relative overflow-hidden text-white">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-300 mb-4">Total Revenue</h3>
          <p className="text-4xl font-semibold tracking-tight">{formatCurrency(stats.totalRevenue, stats.currency)}</p>
          <div className="mt-4 flex items-center text-xs text-[#B5964A] font-medium bg-[#B5964A]/10 w-max px-2 py-1 rounded-md">
            <span>Live total</span>
          </div>
        </div>

        {/* Standard Cards */}
        <StatCard title="Copies Reserved" value={stats.copiesReserved.toString()} />
        <StatCard title="Paid Preorders" value={stats.paidPreorders.toString()} />
        <StatCard title="Pending Payments" value={stats.pendingPayments.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAEAEA]">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Current Book Price</h3>
          <p className="text-3xl font-semibold text-[#111111]">{formatCurrency(stats.currentBookPrice, stats.currency)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAEAEA]">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Release Date</h3>
          <p className="text-3xl font-serif font-semibold text-[#111111]">{stats.releaseDate}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAEAEA]">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Total Orders (Incl. Pending)</h3>
          <p className="text-3xl font-semibold text-[#111111]">{stats.totalPreorders}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EAEAEA] relative group hover:shadow-md transition-shadow">
       <div className="absolute top-6 right-6 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      <p className="text-4xl font-semibold text-[#111111] tracking-tight">{value}</p>
    </div>
  );
}
