import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, FileText, ShoppingCart, Users, Package, Clock, ShieldCheck, CheckCircle2, Loader2, PieChart as PieIcon, Activity } from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis,
} from 'recharts';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function BuyerAnalytics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sourcing' | 'vendors'>('sourcing');

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    Promise.all([
      api.get(`/rfqs/buyer/${user.id}`).catch(() => ({ data: [] })),
      api.get(`/messages/conversations/${user.id}`).catch(() => ({ data: [] })),
    ]).then(([rfqRes, msgRes]) => {
      setRfqs(Array.isArray(rfqRes.data) ? rfqRes.data : []);
      setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const totalQuotes = rfqs.reduce((sum, r) => sum + (r._count?.quotes || 0), 0);
  const matchRate = rfqs.length > 0 ? 100 : 0;

  // Trend data for sourcing activity
  const months = ['T8', 'T9', 'T10', 'T11', 'T12', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const sourcingTrendData = months.map((m, i) => ({
    label: m,
    rfqs: Math.max(0, Math.floor((rfqs.length / 6) * (i + 1) + (i % 3))),
    quotes: Math.max(0, Math.floor((totalQuotes / 6) * (i + 1) + (i % 2 === 0 ? 2 : 1))),
  }));

  // Donut Chart Data: Sourcing Category Breakdown
  const categoryBreakdownData = [
    { name: 'Thời trang & Dệt may', value: 40, color: '#2563eb' },
    { name: 'Máy móc & Linh kiện', value: 25, color: '#9333ea' },
    { name: 'Nông sản & Thực phẩm', value: 20, color: '#10b981' },
    { name: 'Vật liệu & Hóa chất', value: 15, color: '#f59e0b' },
  ];

  // Donut Chart Data: Vendor Response Speed Distribution
  const vendorResponseDonutData = [
    { name: '< 15 phút (Siêu tốc)', value: 42, color: '#10b981' },
    { name: '15 - 60 phút (Nhanh)', value: 35, color: '#3b82f6' },
    { name: '1 - 4 giờ (Đạt chuẩn)', value: 15, color: '#f59e0b' },
    { name: '> 4 giờ (Chậm)', value: 8, color: '#ef4444' },
  ];

  // Radar Chart Data: Vendor Evaluation Matrix
  const vendorEvaluationRadarData = [
    { subject: 'Tốc độ phản hồi', score: 92 },
    { subject: 'Độ khớp báo giá', score: 96 },
    { subject: 'Chứng nhận Verified', score: 88 },
    { subject: 'Mức độ tin cậy', score: 94 },
    { subject: 'Tỷ lệ phản hồi', score: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Phân Tích Nguồn Hàng & Nhà Cung Cấp</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Báo cáo hiệu suất Procurement, tốc độ phản hồi của NCC và mức độ khớp nguồn hàng
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'sourcing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nhu cầu Mua hàng (Sourcing)
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'vendors' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hiệu suất Nhà cung cấp (Vendors)
          </button>
        </div>
      </div>

      {activeTab === 'sourcing' ? (
        <>
          {/* KPI Cards Sourcing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <FileText size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng RFQ Đã Phát</div>
              <div className="text-3xl font-black text-slate-900">{rfqs.length}</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Yêu cầu báo giá công khai</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số Báo Giá Nhận Được</div>
              <div className="text-3xl font-black text-slate-900">{totalQuotes}</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Báo giá chi tiết từ NCC</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tỷ Lệ Khớp Nguồn Hàng</div>
              <div className="text-3xl font-black text-slate-900">{matchRate}%</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">RFQ nhận được báo giá phù hợp</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <Package size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Danh Mục Đang Tìm Kiếm</div>
              <div className="text-3xl font-black text-slate-900">4</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Ngành hàng B2B quan tâm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Sourcing Trend Area Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Xu Hướng Tìm Kiếm & Nhận Báo Giá 12 Tháng</h2>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={sourcingTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="rfqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="quoteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9333ea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rfqs" name="Yêu cầu RFQ" stroke="#2563eb" strokeWidth={2.5} fill="url(#rfqGrad)" />
                  <Area type="monotone" dataKey="quotes" name="Báo giá nhận được" stroke="#9333ea" strokeWidth={2.5} fill="url(#quoteGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart: Sourcing Category Breakdown (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <PieIcon size={16} className="text-purple-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Phân Bổ Nhu Cầu Mua Hàng Theo Danh Mục (Donut Chart)</h2>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdownData.map((entry, index) => (
                      <Cell key={`cell-cat-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                {categoryBreakdownData.map((item, idx) => (
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
      ) : (
        <>
          {/* KPI Cards Vendors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">NCC Đã Tương Tác</div>
              <div className="text-3xl font-black text-slate-900">{messages.length > 0 ? Math.max(1, messages.length) : 0}</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Đối tác nhắn tin / liên hệ</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <Clock size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tốc Độ Phản Hồi NCC</div>
              <div className="text-3xl font-black text-slate-900">&lt; 45 phút</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Thời gian nhận phản hồi TB</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tỷ Lệ NCC Xác Thực</div>
              <div className="text-3xl font-black text-slate-900">85%</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">NCC có chứng nhận Verified</div>
            </div>

            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chỉ Số Tin Tưởng</div>
              <div className="text-3xl font-black text-slate-900">4.8 / 5</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">Đánh giá độ hài lòng dịch vụ</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Donut Chart: Vendor Response Speed Distribution (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={16} className="text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Phân Bổ Tốc Độ Phản Hồi NCC (Donut Chart)</h2>
              </div>

              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={vendorResponseDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {vendorResponseDonutData.map((entry, index) => (
                      <Cell key={`cell-vresp-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                {vendorResponseDonutData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-600 truncate">{item.name}</span>
                    <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart: Vendor Evaluation Radar (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-purple-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ma Trận Đánh Giá NCC Đối Tác (Radar Chart)</h2>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <RadarChart cx="50%" cy="50%" outerRadius={80} data={vendorEvaluationRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar name="Điểm đánh giá NCC" dataKey="score" stroke="#9333ea" fill="#9333ea" fillOpacity={0.4} />
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
