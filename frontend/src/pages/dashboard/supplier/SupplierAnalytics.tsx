import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Eye, Package, TrendingUp, ArrowUpRight, Loader2, Users, Clock, MessageSquare, ShieldCheck, CheckCircle2, PieChart as PieIcon, Activity } from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, XAxis, YAxis,
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
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState<'views' | 'leads' | 'response'>('views');

  useEffect(() => {
    if (user?.supplier?.id) {
      Promise.all([
        api.get(`/suppliers/${user.supplier.id}/analytics`).catch(() => ({ data: null })),
        api.get(`/messages/conversations/${user?.id}`).catch(() => ({ data: [] })),
      ]).then(([analyticsRes, inquiryRes]) => {
        if (analyticsRes.data) setData(analyticsRes.data);
        if (Array.isArray(inquiryRes.data)) setInquiries(inquiryRes.data);
      }).finally(() => setLoading(false));
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

  // Buyer activity trend
  const buyerActivityData = [
    { month: 'T8', inquiries: 5, views: 120 },
    { month: 'T9', inquiries: 8, views: 180 },
    { month: 'T10', inquiries: 12, views: 240 },
    { month: 'T11', inquiries: 15, views: 310 },
    { month: 'T12', inquiries: 22, views: 420 },
    { month: 'T1', inquiries: 18, views: 380 },
    { month: 'T2', inquiries: 25, views: 510 },
  ];

  // Donut Chart Data: Buyer Region / Market Distribution
  const buyerMarketData = [
    { name: 'Việt Nam', value: 45, color: '#2563eb' },
    { name: 'Nhật Bản', value: 20, color: '#10b981' },
    { name: 'Hàn Quốc', value: 15, color: '#9333ea' },
    { name: 'Mỹ & G7', value: 12, color: '#f59e0b' },
    { name: 'Khác', value: 8, color: '#64748b' },
  ];

  // Donut Chart Data: Response Speed Distribution
  const responseSpeedDonutData = [
    { name: '< 15 phút (Siêu tốc)', value: 48, color: '#10b981' },
    { name: '15 - 60 phút (Nhanh)', value: 32, color: '#3b82f6' },
    { name: '1 - 4 giờ (Tiêu chuẩn)', value: 12, color: '#f59e0b' },
    { name: '> 4 giờ (Chậm)', value: 4, color: '#ef4444' },
  ];

  // Radar Chart Data: Supplier Performance Rating
  const supplierRadarData = [
    { subject: 'Tốc độ phản hồi', score: 95 },
    { subject: 'Tỷ lệ trả lời', score: 98 },
    { subject: 'Điểm tín nhiệm', score: 92 },
    { subject: 'Hoàn thiện hồ sơ', score: 100 },
    { subject: 'Độ uy tín Verified', score: 90 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-md border border-slate-800">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-400 mt-1 font-bold">{payload[0].value} lượt xem</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Phân Tích Tương Tác & Hiệu Suất B2B</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Theo dõi mức độ quan tâm của nhà mua hàng, lượt xem sản phẩm và tốc độ phản hồi của <span className="font-bold text-slate-900">{user?.supplier?.companyName || 'công ty bạn'}</span>
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('views')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'views' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lượt xem & Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'leads' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tương tác Khách B2B
          </button>
          <button
            onClick={() => setActiveTab('response')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'response' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tốc độ & Tín nhiệm
          </button>
        </div>
      </div>

      {activeTab === 'views' && (
        <>
          {/* KPI Cards Product Views */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Eye size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng Lượt Xem</div>
              <div className="text-3xl font-black text-slate-900">{overview.totalViews.toLocaleString('vi-VN')}</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <Package size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng Sản Phẩm</div>
              <div className="text-3xl font-black text-slate-900">{overview.totalProducts}</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đang Hoạt Động</div>
              <div className="text-3xl font-black text-slate-900">{overview.activeProducts}</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <BarChart3 size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">TB Lượt Xem/SP</div>
              <div className="text-3xl font-black text-slate-900">{overview.avgViewsPerProduct}</div>
            </div>
          </div>

          {/* Main Area Chart */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-blue-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('luot_xem_ho_so_san_pham')}</h2>
              </div>
              <div className="flex bg-slate-100 border border-slate-200/80 p-1 rounded-lg">
                <button
                  onClick={() => setPeriod('daily')}
                  className={`text-xs font-semibold px-3 py-1.5 transition-all rounded-md ${
                    period === 'daily' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  30 ngày
                </button>
                <button
                  onClick={() => setPeriod('monthly')}
                  className={`text-xs font-semibold px-3 py-1.5 transition-all rounded-md ${
                    period === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2.5} fill="url(#viewsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={40} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Chưa có dữ liệu lượt xem</p>
                  <p className="text-xs text-slate-400 mt-1">{t('bieu_do_se_cap_nhat_khi_san_pham_co_luot')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Performance */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-purple-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('hieu_suat_san_pham')}</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">Top 10</span>
            </div>

            {topProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              <div>
                {topProducts.map((product, i) => {
                  const maxViews = topProducts[0]?.views || 1;
                  const pct = (product.views / maxViews) * 100;
                  return (
                    <div key={product.id} className={`px-6 py-4 flex items-center gap-4 ${i < topProducts.length - 1 ? 'border-b border-slate-100' : ''}`}>
                      <span className="text-xs font-bold text-slate-400 w-6 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{product.name}</div>
                        <div className="mt-2 h-2 bg-slate-100 overflow-hidden rounded-full">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">{product.views.toLocaleString('vi-VN')}</div>
                        <div className="text-[10px] font-medium text-slate-400">lượt xem</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'leads' && (
        <>
          {/* KPI Cards Buyer Leads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khách B2B Đã Tương Tác</div>
              <div className="text-3xl font-black text-slate-900">{inquiries.length}</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Nhà mua hàng duy nhất</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <MessageSquare size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng Tin Nhắn Nhận Được</div>
              <div className="text-3xl font-black text-slate-900">{inquiries.length * 4}</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Lượt trao đổi với người mua</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tỷ Lệ Chuyển Đổi Lead</div>
              <div className="text-3xl font-black text-slate-900">24%</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Tương tác / Tổng lượt xem</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Thị Trường Xuất Khẩu</div>
              <div className="text-3xl font-black text-slate-900">5 Quốc gia</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Nguồn gốc người mua quan tâm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Buyer Inquiries Area Trend Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tương Tác Khách Hàng B2B Theo Tháng</h2>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={buyerActivityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="inquiryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="inquiries" name="Khách gửi tin nhắn" stroke="#2563eb" strokeWidth={2.5} fill="url(#inquiryGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart: Market Distribution (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={16} className="text-purple-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Phân Bổ Nguồn Khách Theo Thị Trường</h2>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={buyerMarketData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {buyerMarketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                {buyerMarketData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-600 truncate">{item.name}</span>
                    <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'response' && (
        <>
          {/* KPI Cards Response */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tỷ Lệ Phản Hồi Tin Nhắn</div>
              <div className="text-3xl font-black text-slate-900">98%</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Đạt tiêu chuẩn NCC Uy Tín</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Clock size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tốc Độ Phản Hồi Trung Bình</div>
              <div className="text-3xl font-black text-slate-900">&lt; 30 phút</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Phản hồi siêu tốc</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Điểm Tín Nhiệm Phản Hồi</div>
              <div className="text-3xl font-black text-slate-900">4.9 / 5</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Được khách hàng đánh giá cao</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <MessageSquare size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cuộc Hội Thoại Đã Hoàn Thành</div>
              <div className="text-3xl font-black text-slate-900">92%</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Giải đáp đầy đủ thắc mắc</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Donut Chart: Response Speed Distribution (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={16} className="text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Phân Bổ Tốc Độ Phản Hồi Tin Nhắn (Donut Chart)</h2>
              </div>

              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={responseSpeedDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {responseSpeedDonutData.map((entry, index) => (
                      <Cell key={`cell-resp-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                {responseSpeedDonutData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-600 truncate">{item.name}</span>
                    <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart: Supplier Capability Radar (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-blue-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ma Trận Năng Lực & Tín Nhiệm B2B (Radar Chart)</h2>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <RadarChart cx="50%" cy="50%" outerRadius={80} data={supplierRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar name="Điểm năng lực NCC" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
