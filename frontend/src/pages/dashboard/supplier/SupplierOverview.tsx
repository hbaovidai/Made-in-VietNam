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
    { label: t('sup_active_products'), value: statsData.products, icon: <Package size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/supplier/products' },
    { label: t('sup_profile_views'), value: statsData.totalViews, icon: <Eye size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/supplier/profile' },
    { label: t('sup_inquiries_received'), value: recentInquiries.length, icon: <Users size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/supplier/inquiries' },
    { label: t('sup_profile_completion'), value: `${profileCompletion}%`, icon: <Award size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/supplier/profile' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('sup_hello', { name: user?.supplier?.companyName || user?.fullName || '' })}</p>
        <div className="flex gap-2">
          <Link to="/dashboard/supplier/products" className="text-xs font-normal text-ink bg-surface-1 border border-hairline px-4 py-2.5 hover:bg-surface-2 transition-colors" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
            {t('sup_manage_products')}
          </Link>
          <Link to="/dashboard/supplier/profile" className="text-xs font-normal text-white bg-primary px-4 py-2.5 hover:bg-primary-hover transition-colors" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
            {t('sup_edit_profile')}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Link key={i} to={kpi.link} className="bg-card-bg shadow-subtle p-5 transition-all group rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 border border-hairline flex items-center justify-center ${kpi.bg}`} style={{ borderRadius: '4px' }}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={14} className="text-hairline group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-bold text-primary" style={{ letterSpacing: 0 }}>{kpi.value}</div>
            <div className="text-[10px] font-normal text-ink-subtle mt-1 uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{kpi.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Views Chart */}
        <div className="bg-card-bg shadow-subtle p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('sup_profile_views_chart')}</h2>
            </div>
            <span className="text-xs font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('sup_months_12')}</span>
          </div>
          {statsData.totalViews > 0 ? (
            <>
              <div className="h-44 flex items-end gap-2">
                {viewsData.map((value, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div className="w-full bg-surface-1 border border-hairline" style={{ height: '176px', borderRadius: '4px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary/70 group-hover:bg-primary transition-all" 
                        style={{ height: `${(value / viewsMax) * 100}%`, borderRadius: '4px' }} 
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-2 text-ink text-[9px] px-1.5 py-0.5 border border-hairline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ borderRadius: '4px' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.32px' }}>
                {months.map(m => <span key={m}>{m}</span>)}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="text-ink-subtle mx-auto mb-2" />
                <p className="text-xs text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('sup_no_view_data')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Products Listed Chart */}
        <div className="bg-card-bg shadow-subtle p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('sup_products_posted')}</h2>
            </div>
            <span className="text-xs font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('sup_months_12')}</span>
          </div>
          {statsData.products > 0 ? (
            <>
              <div className="h-44 flex items-end gap-2">
                {productsData.map((value, i) => (
                  <div key={i} className="flex-1 relative group cursor-pointer">
                    <div className="w-full bg-surface-1 border border-hairline" style={{ height: '176px', borderRadius: '4px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary/70 group-hover:bg-primary transition-all" 
                        style={{ height: `${(value / productsMax) * 100}%`, borderRadius: '4px' }} 
                      />
                    </div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-2 text-ink text-[9px] px-1.5 py-0.5 border border-hairline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ borderRadius: '4px' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.32px' }}>
                {months.map(m => <span key={m}>{m}</span>)}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="text-ink-subtle mx-auto mb-2" />
                <p className="text-xs text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('sup_no_products_yet')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-card-bg shadow-subtle rounded-lg">
          <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('sup_recent_inquiries')}</h2>
            <Link to="/dashboard/supplier/inquiries" className="text-xs font-normal text-primary hover:text-primary-hover" style={{ letterSpacing: '0.16px' }}>{t('sup_view_all')}</Link>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border border-primary border-t-transparent mx-auto" style={{ borderRadius: '50%' }} />
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={32} className="text-ink-subtle mx-auto mb-2" />
              <p className="text-sm font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('chua_co_yeu_cau_nao')}</p>
              <p className="text-xs text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('khi_nguoi_mua_lien_he_yeu_cau_se_hien_th')}</p>
            </div>
          ) : (
            <div>
              {recentInquiries.map((inq: any, i: number) => (
                <Link 
                  key={inq.id} 
                  to="/dashboard/supplier/inquiries"
                  className={`px-6 py-4 flex items-center justify-between hover:bg-surface-1 transition-colors group ${i < recentInquiries.length - 1 ? 'border-b border-hairline' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-surface-2 border border-hairline flex items-center justify-center text-xs font-normal text-ink shrink-0 animate-fade-in" style={{ borderRadius: '4px' }}>
                      {(inq.otherUser?.fullName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-normal text-ink group-hover:text-primary transition-colors truncate" style={{ letterSpacing: '0.16px' }}>
                        {inq.otherUser?.fullName || 'Người mua'}
                      </div>
                      <div className="text-xs text-ink-muted truncate mt-0.5" style={{ letterSpacing: '0.16px' }}>
                        {inq.lastMessage || 'Tin nhắn mới'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-subtle font-normal shrink-0 ml-3" style={{ letterSpacing: '0.16px' }}>
                    {inq.updatedAt ? formatTime(inq.updatedAt) : ''}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profile Completion */}
        <div className="space-y-5">
          <div className="bg-card-bg shadow-subtle p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-surface-1 border border-hairline flex items-center justify-center" style={{ borderRadius: '4px' }}>
                <Award size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('sup_company_profile')}</h3>
                <p className="text-xs text-ink-subtle mt-0.5" style={{ letterSpacing: '0.16px' }}>{t('sup_complete_to_trust')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-normal" style={{ letterSpacing: '0.16px' }}>
                <span className="text-ink-muted">{t('sup_progress')}</span>
                <span className={profileCompletion >= 80 ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-surface-2 border border-hairline overflow-hidden rounded-full">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${profileCompletion >= 80 ? 'bg-emerald-500' : profileCompletion >= 50 ? 'bg-amber-500' : 'bg-primary'}`} 
                  style={{ width: `${profileCompletion}%` }} 
                />
              </div>
              {profileCompletion < 80 && (
                <Link to="/dashboard/supplier/profile" className="text-[10px] text-primary font-normal hover:text-primary-hover inline-block mt-1" style={{ letterSpacing: '0.16px' }}>
                  {t('sup_complete_profile')}
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card-bg shadow-subtle p-6 relative overflow-hidden rounded-lg">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-ink uppercase mb-4" style={{ letterSpacing: '0.32px' }}>Phát triển kinh doanh</h3>
              <div className="space-y-3">
                {[
                  { label: t('membership_benefits'), to: '/services/membership' },
                  { label: t('seller_guide_link'), to: '/help/seller-guide' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="flex items-center justify-between group">
                    <span className="text-xs font-normal text-ink-muted group-hover:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>{link.label}</span>
                    <ArrowUpRight size={12} className="text-hairline group-hover:text-primary transition-colors" />
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
