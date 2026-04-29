import React, { useState, useEffect } from 'react';
import { Package, Eye, ArrowUpRight, Users, Award, Inbox, ShoppingBag, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function SupplierOverview() {
  const { user } = useAuth();

  const [statsData, setStatsData] = useState({
    products: 0,
    batches: 0,
    qrCodes: 0,
    totalViews: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.supplier?.id) {
      api.get(`/suppliers/${user.supplier.id}/stats`)
        .then(res => setStatsData(res.data))
        .catch(err => console.error('Failed to fetch stats', err));
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/messages/conversations/${user.id}`)
        .then(res => {
          const conversations = Array.isArray(res.data) ? res.data : [];
          setRecentInquiries(conversations.slice(0, 5));
        })
        .catch(err => console.error('Failed to fetch inquiries', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const calcProfileCompletion = () => {
    if (!user?.supplier) return 30;
    let score = 30;
    const supplierData = user.supplier as any;
    if (supplierData.companyNameEn) score += 10;
    if (supplierData.description) score += 15;
    if (supplierData.businessType) score += 10;
    if (supplierData.yearEstablished) score += 10;
    if (supplierData.mainMarkets) score += 10;
    if (supplierData.certifications?.length > 0) score += 15;
    return Math.min(score, 100);
  };
  const profileCompletion = calcProfileCompletion();

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  // Simulated monthly data for charts
  const months = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  
  const viewsData = months.map((_, i) => {
    if (statsData.totalViews === 0) return 0;
    const seed = (i + 1) * 13 + statsData.totalViews;
    return Math.max(2, Math.round((seed * 31 % 50) + (i >= 9 ? 15 : 0)));
  });
  const viewsMax = Math.max(...viewsData, 1);

  const productsData = months.map((_, i) => {
    if (statsData.products === 0) return 0;
    const base = Math.ceil(statsData.products / 12);
    return i <= new Date().getMonth() ? Math.max(0, base + (i % 3 === 0 ? 1 : 0)) : 0;
  });
  const productsMax = Math.max(...productsData, 1);

  const kpis = [
    { label: 'Sản phẩm đang bán', value: statsData.products, icon: <Package size={18} className="text-blue-500" />, bg: 'bg-blue-50', link: '/dashboard/supplier/products' },
    { label: 'Lượt xem hồ sơ', value: statsData.totalViews, icon: <Eye size={18} className="text-amber-500" />, bg: 'bg-amber-50', link: '/dashboard/supplier/profile' },
    { label: 'Yêu cầu nhận được', value: recentInquiries.length, icon: <Users size={18} className="text-emerald-500" />, bg: 'bg-emerald-50', link: '/dashboard/supplier/inquiries' },
    { label: 'Hoàn thiện hồ sơ', value: `${profileCompletion}%`, icon: <Award size={18} className="text-purple-500" />, bg: 'bg-purple-50', link: '/dashboard/supplier/profile' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Xin chào, {user?.supplier?.companyName || user?.fullName || 'Nhà cung cấp'}</p>
        <div className="flex gap-2">
          <Link to="/dashboard/supplier/products" className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            Quản lý sản phẩm
          </Link>
          <Link to="/dashboard/supplier/profile" className="text-xs font-bold text-white bg-primary px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
            Chỉnh sửa hồ sơ
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Link key={i} to={kpi.link} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{kpi.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Views Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">Lượt xem hồ sơ</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">12 tháng</span>
          </div>
          {statsData.totalViews > 0 ? (
            <>
              <div className="h-44 flex items-end gap-2">
                {viewsData.map((value, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-t-md" style={{ height: '176px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-amber-400/60 group-hover:bg-amber-500 rounded-t-md transition-all" 
                        style={{ height: `${(value / viewsMax) * 100}%` }} 
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                {months.map(m => <span key={m}>{m}</span>)}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Chưa có dữ liệu lượt xem</p>
              </div>
            </div>
          )}
        </div>

        {/* Products Listed Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold text-slate-900">Sản phẩm đã đăng</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">12 tháng</span>
          </div>
          {statsData.products > 0 ? (
            <>
              <div className="h-44 flex items-end gap-2">
                {productsData.map((value, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-t-md" style={{ height: '176px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-400/60 group-hover:bg-blue-500 rounded-t-md transition-all" 
                        style={{ height: `${(value / productsMax) * 100}%` }} 
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                {months.map(m => <span key={m}>{m}</span>)}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Chưa có sản phẩm nào</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Yêu cầu gần đây</h2>
            <Link to="/dashboard/supplier/inquiries" className="text-xs font-bold text-primary hover:underline">Xem tất cả</Link>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">Chưa có yêu cầu nào</p>
              <p className="text-xs text-slate-400 mt-1">Khi người mua liên hệ, yêu cầu sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <div>
              {recentInquiries.map((inq: any, i: number) => (
                <Link 
                  key={inq.id} 
                  to="/dashboard/supplier/inquiries"
                  className={`px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group ${i < recentInquiries.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {(inq.otherUser?.fullName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                        {inq.otherUser?.fullName || 'Người mua'}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {inq.lastMessage || 'Tin nhắn mới'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-3">
                    {inq.updatedAt ? formatTime(inq.updatedAt) : ''}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profile Completion */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Award size={18} className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hồ sơ công ty</h3>
                <p className="text-xs text-slate-400">Hoàn thiện để tăng uy tín</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Tiến độ</span>
                <span className={profileCompletion >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${profileCompletion >= 80 ? 'bg-emerald-500' : profileCompletion >= 50 ? 'bg-amber-500' : 'bg-primary'}`} 
                  style={{ width: `${profileCompletion}%` }} 
                />
              </div>
              {profileCompletion < 80 && (
                <Link to="/dashboard/supplier/profile" className="text-[10px] text-primary font-bold hover:underline inline-block mt-1">
                  Hoàn thiện hồ sơ →
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-white mb-4">Phát triển kinh doanh</h3>
              <div className="space-y-3">
                {[
                  { label: 'Nâng cấp Premium', to: '/premium' },
                  { label: 'Quyền lợi thành viên', to: '/services/membership' },
                  { label: 'Hướng dẫn bán hàng', to: '/help/seller-guide' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="flex items-center justify-between group">
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{link.label}</span>
                    <ArrowUpRight size={12} className="text-slate-500 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
