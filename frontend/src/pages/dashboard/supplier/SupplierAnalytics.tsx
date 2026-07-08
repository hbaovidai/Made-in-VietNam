import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Eye, Package, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalProducts: number;
    activeProducts: number;
    avgViewsPerProduct: number;
  };
  dailyViews: { date: string; views: number }[];
  monthlyViews: { month: string; views: number }[];
  topProducts: { id: string; name: string; views: number; status: string }[];
}

export function SupplierAnalytics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    if (user?.supplier?.id) {
      api.get(`/suppliers/${user.supplier.id}/analytics`)
        .then(res => setData(res.data))
        .catch(err => console.error('Failed to fetch analytics', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const overview = data?.overview || { totalViews: 0, totalProducts: 0, activeProducts: 0, avgViewsPerProduct: 0 };

  const kpis = [
    { label: 'Tổng lượt xem', value: overview.totalViews, icon: <Eye size={18} className="text-amber-500" />, bg: 'bg-amber-50' },
    { label: 'Tổng sản phẩm', value: overview.totalProducts, icon: <Package size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Đang hoạt động', value: overview.activeProducts, icon: <TrendingUp size={18} className="text-emerald-500" />, bg: 'bg-emerald-50' },
    { label: 'TB lượt xem/SP', value: overview.avgViewsPerProduct, icon: <BarChart3 size={18} className="text-purple-500" />, bg: 'bg-purple-50' },
  ];

  const chartData = period === 'daily'
    ? (data?.dailyViews || []).map(d => ({
        label: d.date.slice(5), // MM-DD
        views: d.views,
      }))
    : (data?.monthlyViews || []).map(d => ({
        label: `T${parseInt(d.month.slice(5))}`,
        views: d.views,
      }));

  const topProducts = data?.topProducts || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
          <p className="font-bold">{label}</p>
          <p className="text-amber-300">{payload[0].value} lượt xem</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <p className="text-sm text-slate-500">
        Phân tích hiệu suất kinh doanh của {user?.supplier?.companyName || 'công ty bạn'}
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value.toLocaleString('vi-VN')}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">{t('luot_xem_ho_so_san_pham')}</h2>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setPeriod('daily')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-md transition-all ${
                period === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              30 ngày
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-md transition-all ${
                period === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              12 tháng
            </button>
          </div>
        </div>

        {chartData.length > 0 && chartData.some(d => d.views > 0) ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" stroke="#f59e0b" strokeWidth={2.5} fill="url(#viewsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-400">Chưa có dữ liệu lượt xem</p>
              <p className="text-xs text-slate-400 mt-1">{t('bieu_do_se_cap_nhat_khi_san_pham_co_luot')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900">{t('hieu_suat_san_pham')}</h2>
          </div>
          <span className="text-xs text-slate-400">Top 10</span>
        </div>

        {topProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div>
            {topProducts.map((product, i) => {
              const maxViews = topProducts[0]?.views || 1;
              const pct = (product.views / maxViews) * 100;
              return (
                <div key={product.id} className={`px-6 py-4 flex items-center gap-4 ${i < topProducts.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <span className="text-xs font-black text-slate-300 w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{product.name}</div>
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900">{product.views.toLocaleString('vi-VN')}</div>
                    <div className="text-[10px] text-slate-400">lượt xem</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
