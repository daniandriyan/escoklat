import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Coffee,
  ArrowUpRight,
} from 'lucide-react';
import {
  getTodayStats,
  getBestSellingProducts,
  getDailySales,
} from '../services/supabase';
import { Card, LoadingSpinner } from '../components';
import { formatRupiah, formatDate } from '../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function StatCard({ title, value, icon: Icon, trend, trendValue, gradient }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>{trendValue}% dari kemarin</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, bestSellersData, dailySalesData] = await Promise.all([
        getTodayStats(),
        getBestSellingProducts(5),
        getDailySales(7),
      ]);
      setStats(statsData);
      setBestSellers(bestSellersData || []);
      setDailySales(dailySalesData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const chartData = dailySales.map(day => ({
    name: formatDate(day.sale_date, 'dd MMM'),
    revenue: day.total_revenue,
    transactions: day.total_transactions,
  })).reverse();

  return (
    <div className="space-y-6 pb-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <StatCard
          title="Penjualan Hari Ini"
          value={formatRupiah(stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend="up"
          trendValue="12"
          gradient="from-chocolate-500 to-chocolate-700"
        />
        <StatCard
          title="Total Transaksi"
          value={stats?.totalTransactions || 0}
          icon={ShoppingCart}
          trend="up"
          trendValue="8"
          gradient="from-green-600 to-green-800"
        />
        <StatCard
          title="Rata-rata Transaksi"
          value={formatRupiah(stats?.averageTransaction || 0)}
          icon={TrendingUp}
          gradient="from-blue-600 to-blue-800"
        />
        <StatCard
          title="Total Produk"
          value={bestSellers.length}
          icon={Coffee}
          gradient="from-purple-600 to-purple-800"
        />
      </div>

      {/* Charts & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Grafik Penjualan 7 Hari Terakhir
          </h3>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    fontSize={12}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(78, 52, 46, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value) => [formatRupiah(value), 'Pendapatan']}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8D6E63" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#8D6E63" stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/40">
                Belum ada data penjualan
              </div>
            )}
          </div>
        </Card>

        {/* Best Selling Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Menu Terlaris
          </h3>
          <div className="space-y-3">
            {bestSellers.length > 0 ? (
              bestSellers.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cream-400 to-cream-600 flex items-center justify-center font-bold text-chocolate-900 text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-white/60">{product.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cream-300">
                      {product.total_sold}
                    </p>
                    <p className="text-xs text-white/60">terjual</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-white/40 py-8">
                Belum ada data produk terlaris
              </div>
            )}
          </div>
          <Link
            to="/products"
            className="block mt-4 text-center text-sm font-medium text-cream-300 hover:text-white transition-colors"
          >
            Lihat Semua Produk →
          </Link>
        </Card>
      </div>
    </div>
  );
}
