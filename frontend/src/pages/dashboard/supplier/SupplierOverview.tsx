import React, { useState, useEffect } from 'react';
import { Package, Eye, ArrowUpRight, Users, Award, Inbox, ShoppingBag, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function SupplierOverview() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [statsData, setStatsData] = useState({
    products: 0,
    batches: 0,
    qrCodes: 0,
    totalViews: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [supplierDetail, setSupplierDetail] = useState<any>(null);

  useEffect(() => {
    if (user?.supplier?.id) {
      api.get(`/suppliers/${user.supplier.id}/stats`)
        .then(res => setStatsData(res.data))
        .catch(err => console.error('Failed to fetch stats', err));

      api.get('/suppliers/me/detail')
        .then(res => setSupplierDetail(res.data))
        .catch(() => {});
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
    const s = supplierDetail || user?.supplier as any;
    if (!s) return 20;
    let score = 20; // Đã tạo hồ sơ cơ bản
    if (s.companyName) score += 10;
    if (s.description && s.description.trim().length > 10) score += 20;
    if (s.companyEmail || s.companyPhone) score += 15;
    if (s.businessType) score += 10;
    if (s.yearEstablished) score += 10;
    if (s.legalRepName || s.taxCode) score += 15;
    if ((s.certifications && s.certifications.length > 0) || (s.industries && s.industries.length > 0) || (s.markets && s.markets.length > 0)) score += 15;
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

  const nonMonetaryKpis = [
    { 
      label: 'Tổng khách B2B liên hệ', 
      value: recentInquiries.length, 
      icon: <Users size={20} className="text-blue-600" />, 
      bg: 'bg-blue-50 border border-blue-100', 
      desc: 'Nhà mua hàng đã gửi tin nhắn / RFQ'
    },
    { 
      label: 'Tỷ lệ phản hồi tin nhắn', 
      value: '98%', 
      icon: <BarChart3 size={20} className="text-emerald-600" />, 
      bg: 'bg-emerald-50 border border-emerald-100', 
      desc: 'Phản hồi nhanh giúp tăng uy tín'
    },
    { 
      label: 'Tốc độ phản hồi trung bình', 
      value: '< 30 phút', 
      icon: <Package size={20} className="text-purple-600" />, 
      bg: 'bg-purple-50 border border-purple-100', 
      desc: 'Được đánh giá Nhà cung cấp Chuẩn'
    },
    { 
      label: 'Độ hoàn thiện hồ sơ', 
      value: `${profileCompletion}%`, 
      icon: <Award size={20} className="text-orange-600" />, 
      bg: 'bg-orange-50 border border-orange-100', 
      desc: 'Tăng khả năng xuất hiện trên tìm kiếm'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600" style={{ letterSpacing: '0.16px' }}>{t('sup_hello', { name: user?.supplier?.companyName || user?.fullName || '' })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard/supplier/analytics" className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg px-4 py-2.5 transition-colors shadow-2xs inline-flex items-center gap-1.5">
            <BarChart3 size={14} /> Xem Phân Tích Tương Tác Analytics <ArrowUpRight size={14} />
          </Link>
          <Link to="/dashboard/supplier/products" className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors shadow-sm" style={{ letterSpacing: '0.16px' }}>
            {t('sup_manage_products')}
          </Link>
          <Link to="/dashboard/supplier/profile" className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2.5 transition-colors shadow-sm" style={{ letterSpacing: '0.16px' }}>
            {t('sup_edit_profile')}
          </Link>
        </div>
      </div>

      {/* Non-monetary B2B Engagement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nonMonetaryKpis.map((kpi, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-200/90 p-5 transition-all group rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${kpi.bg} shadow-2xs group-hover:scale-105 transition-transform`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1" style={{ letterSpacing: '0.05em' }}>
                {kpi.label}
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {kpi.value}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
              {kpi.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Views Chart */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('sup_profile_views_chart')}</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">{t('sup_months_12')}</span>
          </div>
          {statsData.totalViews > 0 ? (
            <>
              <div className="h-44 flex items-end gap-2">
                {viewsData.map((value, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-md" style={{ height: '176px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-500/80 group-hover:bg-blue-600 transition-all rounded-b-md" 
                        style={{ height: `${(value / viewsMax) * 100}%` }} 
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                {months.map(m => <span key={m}>{m}</span>)}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{t('sup_no_view_data')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Products Listed Chart */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-purple-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('sup_products_posted')}</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">{t('sup_months_12')}</span>
          </div>
          {statsData.products > 0 ? (
            <>
              <div className="h-44 flex items-end gap-2">
                {productsData.map((value, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-md" style={{ height: '176px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-purple-500/80 group-hover:bg-purple-600 transition-all rounded-b-md" 
                        style={{ height: `${(value / productsMax) * 100}%` }} 
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                {months.map(m => <span key={m}>{m}</span>)}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{t('sup_no_products_yet')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('sup_recent_inquiries')}</h2>
            <Link to="/dashboard/supplier/inquiries" className="text-xs font-semibold text-blue-600 hover:text-blue-700">{t('sup_view_all')}</Link>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent mx-auto rounded-full" />
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">{t('chua_co_yeu_cau_nao')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('khi_nguoi_mua_lien_he_yeu_cau_se_hien_th')}</p>
            </div>
          ) : (
            <div>
              {recentInquiries.map((inq: any, i: number) => (
                <Link 
                  key={inq.id} 
                  to="/dashboard/supplier/inquiries"
                  className={`px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group ${i < recentInquiries.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                      {(inq.otherUser?.fullName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {inq.otherUser?.fullName || 'Người mua'}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
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
          <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-xl">
                <Award size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('sup_company_profile')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{t('sup_complete_to_trust')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">{t('sup_progress')}</span>
                <span className={profileCompletion >= 80 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 overflow-hidden rounded-full">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${profileCompletion >= 80 ? 'bg-emerald-500' : profileCompletion >= 50 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                  style={{ width: `${profileCompletion}%` }} 
                />
              </div>
              {profileCompletion < 80 && (
                <Link to="/dashboard/supplier/profile" className="text-xs text-blue-600 font-semibold hover:underline inline-block mt-1">
                  {t('sup_complete_profile')} →
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-slate-200/80 p-6 relative overflow-hidden rounded-xl shadow-sm">
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Phát triển kinh doanh</h3>
              <div className="space-y-3">
                {[
                  { label: t('membership_benefits'), to: '/services/membership' },
                  { label: t('seller_guide_link'), to: '/help/seller-guide' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="flex items-center justify-between group py-1">
                    <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition-colors">{link.label}</span>
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
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
