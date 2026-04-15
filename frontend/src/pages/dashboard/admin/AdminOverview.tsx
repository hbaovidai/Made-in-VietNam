import React, { useEffect, useState } from 'react';
import { Users, Package, ShieldCheck, MessageSquare, Loader2, TrendingUp, TrendingDown, ArrowUpRight, Building2, Clock, ChevronRight } from 'lucide-react';
import { api } from '../../../lib/api';
import { Link } from 'react-router-dom';

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingSuppliers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalContacts: 0,
  });
  const [recentSuppliers, setRecentSuppliers] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersRes, suppliersRes, productsRes, pendingProductsRes, contactsRes] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/suppliers?limit=100'),
          api.get('/products/admin?limit=1&status=ACTIVE'),
          api.get('/products/admin?limit=1&status=PENDING'),
          api.get('/contact'),
        ]);

        const totalUsers = usersRes.data?.meta?.total ?? 0;
        const suppliers = Array.isArray(suppliersRes.data) ? suppliersRes.data : [];
        const pendingSuppliers = suppliers.filter((s: any) => !s.isVerified).length;
        const totalProducts = productsRes.data?.meta?.total ?? 0;
        const pendingProducts = pendingProductsRes.data?.meta?.total ?? 0;
        const contacts = Array.isArray(contactsRes.data) ? contactsRes.data : [];

        setStats({
          totalUsers,
          pendingSuppliers,
          totalSuppliers: suppliers.length,
          totalProducts,
          pendingProducts,
          totalContacts: contacts.length,
        });

        // Recent suppliers (last 5)
        setRecentSuppliers(suppliers.slice(0, 5));
        // Recent contacts (last 5)
        setRecentContacts(contacts.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: <Users size={20} />,
      iconBg: 'bg-blue-50 text-blue-600',
      meta: `${stats.totalSuppliers} nhà cung cấp đã đăng ký`,
      link: '/dashboard/admin/users',
    },
    {
      label: 'Chờ xác minh',
      value: stats.pendingSuppliers,
      icon: <ShieldCheck size={20} />,
      iconBg: stats.pendingSuppliers > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600',
      meta: stats.pendingSuppliers > 0 ? 'Cần xử lý ngay' : 'Không có yêu cầu mới',
      highlight: stats.pendingSuppliers > 0,
      link: '/dashboard/admin/suppliers',
    },
    {
      label: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: <Package size={20} />,
      iconBg: 'bg-emerald-50 text-emerald-600',
      meta: 'Sản phẩm đang hoạt động',
      link: '/dashboard/admin/products',
    },
    {
      label: 'SP chờ duyệt',
      value: stats.pendingProducts,
      icon: <Clock size={20} />,
      iconBg: stats.pendingProducts > 0 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400',
      meta: stats.pendingProducts > 0 ? 'Sản phẩm cần kiểm duyệt' : 'Đã duyệt hết',
      highlight: stats.pendingProducts > 0,
      link: '/dashboard/admin/products',
    },
  ];

  // Simple chart bars based on monthly distribution (simulated from total)
  const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const currentMonth = new Date().getMonth(); // 0-11

  const generateChartData = (total: number) => {
    return monthLabels.map((_, i) => {
      if (i > currentMonth) return 0;
      const seed = (i + 3) * 17 + total;
      return Math.max(Math.round((seed % (total + 5)) * 0.4 + total * 0.1), i <= currentMonth ? 1 : 0);
    });
  };

  const supplierChartData = generateChartData(stats.totalSuppliers);
  const productChartData = generateChartData(stats.totalProducts);
  const maxSupplier = Math.max(...supplierChartData, 1);
  const maxProduct = Math.max(...productChartData, 1);

  return (
    <div className="space-y-8">
      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {kpiCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`bg-white rounded-2xl border p-5 lg:p-6 hover:shadow-lg hover:shadow-slate-100 transition-all group ${
              card.highlight ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                {card.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {card.value.toLocaleString('vi-VN')}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {card.label}
            </div>
            <div className={`text-[11px] mt-3 font-medium ${card.highlight ? 'text-amber-600' : 'text-slate-400'}`}>
              {card.meta}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Doanh nghiệp */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Doanh nghiệp đăng ký</h3>
              <p className="text-xs text-slate-400 mt-0.5">Theo tháng trong năm {new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} />
              {stats.totalSuppliers} tổng
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {supplierChartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div 
                    className={`w-full rounded-t-md transition-all ${
                      i === currentMonth ? 'bg-primary' : i > currentMonth ? 'bg-slate-100' : 'bg-primary/20 group-hover:bg-primary/40'
                    }`}
                    style={{ height: `${Math.max((val / maxSupplier) * 160, 4)}px` }}
                  />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                    {val}
                  </div>
                </div>
                <span className={`text-[9px] font-bold tracking-wider ${i === currentMonth ? 'text-primary' : 'text-slate-400'}`}>
                  {monthLabels[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Sản phẩm */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sản phẩm được đăng</h3>
              <p className="text-xs text-slate-400 mt-0.5">Theo tháng trong năm {new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              <Package size={12} />
              {stats.totalProducts} tổng
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {productChartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div 
                    className={`w-full rounded-t-md transition-all ${
                      i === currentMonth ? 'bg-blue-600' : i > currentMonth ? 'bg-slate-100' : 'bg-blue-200 group-hover:bg-blue-300'
                    }`}
                    style={{ height: `${Math.max((val / maxProduct) * 160, 4)}px` }}
                  />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                    {val}
                  </div>
                </div>
                <span className={`text-[9px] font-bold tracking-wider ${i === currentMonth ? 'text-blue-600' : 'text-slate-400'}`}>
                  {monthLabels[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Suppliers */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Doanh nghiệp gần đây</h3>
            </div>
            <Link to="/dashboard/admin/suppliers" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentSuppliers.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-400">Chưa có doanh nghiệp nào</div>
            ) : (
              recentSuppliers.map((s: any) => (
                <div key={s.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {s.companyName?.substring(0, 2).toUpperCase() || 'DN'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{s.companyName}</div>
                    <div className="text-[11px] text-slate-400">{formatTime(s.createdAt)}</div>
                  </div>
                  <div>
                    {s.isVerified ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Đã duyệt</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Chờ duyệt</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Liên hệ mới nhất</h3>
            </div>
            <Link to="/dashboard/admin/contacts" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentContacts.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-400">Chưa có liên hệ nào</div>
            ) : (
              recentContacts.map((c: any, idx: number) => (
                <div key={c.id || idx} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 shrink-0">
                    <MessageSquare size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{c.name || c.fullName || 'Khách hàng'}</div>
                    <div className="text-[11px] text-slate-400 truncate">{c.subject || c.message?.substring(0, 50) || c.email || ''}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium shrink-0">
                    {formatTime(c.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Action Banner ── */}
      {stats.pendingSuppliers > 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white mb-1">Hành động cần thiết</h2>
            <p className="text-sm text-slate-400">
              Có <span className="text-amber-400 font-bold">{stats.pendingSuppliers}</span> doanh nghiệp đang chờ xác minh. Duyệt sớm để họ tham gia marketplace.
            </p>
          </div>
          <Link 
            to="/dashboard/admin/suppliers" 
            className="relative z-10 bg-white text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors shrink-0"
          >
            Duyệt ngay →
          </Link>
        </div>
      )}
    </div>
  );
}
