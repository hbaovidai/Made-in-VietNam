import React, { useState, useEffect } from 'react';
import { Package, FileText, TrendingUp, ChevronRight, ArrowUpRight, Eye, Users, Award, QrCode, Inbox } from 'lucide-react';
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
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  useEffect(() => {
    if (user?.supplier?.id) {
      api.get(`/suppliers/${user.supplier.id}/stats`)
        .then(res => setStatsData(res.data))
        .catch(err => console.error('Failed to fetch stats', err));
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      setLoadingInquiries(true);
      api.get(`/messages/conversations/${user.id}`)
        .then(res => {
          const conversations = Array.isArray(res.data) ? res.data : [];
          setRecentInquiries(conversations.slice(0, 4));
        })
        .catch(err => console.error('Failed to fetch inquiries', err))
        .finally(() => setLoadingInquiries(false));
    }
  }, [user]);

  // Calculate profile completion dynamically
  const calcProfileCompletion = () => {
    if (!user?.supplier) return 30;
    let score = 30; // base for having account
    if (user.supplier.companyNameEn) score += 10;
    if (user.supplier.description) score += 15;
    if (user.supplier.businessType) score += 10;
    if (user.supplier.yearEstablished) score += 10;
    if (user.supplier.mainMarkets) score += 10;
    if (user.supplier.certifications?.length > 0) score += 15;
    return Math.min(score, 100);
  };
  const profileCompletion = calcProfileCompletion();

  const stats = [
    { label: t('active_products'), value: statsData.products.toString(), icon: <Package className="text-blue-500" /> },
    { label: t('batch_mgmt_title') || 'Lô hàng', value: statsData.batches.toString(), icon: <FileText className="text-orange-500" /> },
    { label: t('qr_management') || 'Mã QR đã tạo', value: statsData.qrCodes.toString(), icon: <QrCode className="text-green-500" /> },
    { label: t('profile_views'), value: statsData.totalViews.toString(), icon: <Eye className="text-yellow-500" /> },
  ];

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">{t('supplier_dashboard_title')}</h1>
          <p className="text-slate-500 text-sm">{t('supplier_welcome', { name: user?.fullName || '' })}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Link to="/dashboard/supplier/products" className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">
            {t('manage_products_btn')}
          </Link>
          <Link to="/dashboard/supplier/profile" className="bg-primary text-white px-6 py-2 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
            {t('edit_profile_overview_btn')}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-300" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{t('recent_inquiries')}</h2>
              <Link to="/dashboard/supplier/inquiries" className="text-xs font-bold text-primary hover:underline">{t('view_all')}</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {loadingInquiries ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-xs text-slate-400">Đang tải...</p>
                </div>
              ) : recentInquiries.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Inbox size={40} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500">Chưa có yêu cầu nào</p>
                  <p className="text-xs text-slate-400 mt-1">Khi người mua liên hệ với bạn, các yêu cầu sẽ hiển thị tại đây.</p>
                </div>
              ) : (
                recentInquiries.map((inquiry: any) => (
                  <Link 
                    key={inquiry.id} 
                    to="/dashboard/supplier/inquiries"
                    className="px-4 sm:px-6 py-4 flex items-start sm:items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                        <Users size={14} className="text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                          {inquiry.otherUser?.fullName || 'Người mua'}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500 mt-1 truncate">
                          {inquiry.lastMessage || 'Tin nhắn mới'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {inquiry.updatedAt ? formatTime(inquiry.updatedAt) : ''}
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-primary ml-auto mt-1" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{t('performance_trends')}</h2>
              <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 outline-none">
                <option>{t('last_30_days')}</option>
                <option>{t('last_7_days')}</option>
                <option>{t('last_6_months')}</option>
              </select>
            </div>
            {statsData.totalViews > 0 ? (
              <>
                <div className="h-64 flex items-end gap-4">
                  {Array.from({ length: 12 }, (_, i) => {
                    const seed = (i + 1) * 7 + statsData.totalViews;
                    const h = Math.min(20 + ((seed * 31) % 60) + (i % 3) * 10, 100);
                    return (
                      <div key={i} className="flex-1 bg-slate-100 relative group cursor-pointer">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-primary/20 group-hover:bg-primary transition-all" 
                          style={{ height: `${h}%` }} 
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {Math.round(h * statsData.totalViews / 100)} {t('views_suffix')}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span>
                  <span>T7</span><span>T8</span><span>T9</span><span>T10</span><span>T11</span><span>T12</span>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">Chưa có dữ liệu hiệu suất</p>
                  <p className="text-xs text-slate-400 mt-1">Biểu đồ sẽ hiển thị khi sản phẩm của bạn bắt đầu có lượt xem.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Business Growth */}
          <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight">{t('grow_your_business')}</h3>
            <div className="space-y-4">
              <Link to="/premium" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{t('upgrade_to_premium')}</span>
                <ArrowUpRight size={16} className="text-primary" />
              </Link>
              <Link to="/services/membership" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{t('membership_benefits')}</span>
                <ArrowUpRight size={16} className="text-primary" />
              </Link>
              <Link to="/help/seller-guide" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{t('seller_guide_link')}</span>
                <ArrowUpRight size={16} className="text-primary" />
              </Link>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white border border-slate-200 p-5 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Award size={32} className="text-primary" />
              <h3 className="font-black text-slate-900 uppercase tracking-tight">{t('verified_supplier')}</h3>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {t('verified_supplier_desc')}
            </p>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">
                <span>{t('profile_completion')}</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${profileCompletion >= 80 ? 'bg-emerald-500' : profileCompletion >= 50 ? 'bg-viet-gold' : 'bg-primary'}`} 
                  style={{ width: `${profileCompletion}%` }} 
                />
              </div>
              {profileCompletion < 80 && (
                <Link to="/dashboard/supplier/profile" className="text-[10px] text-primary font-bold mt-2 inline-block hover:underline">
                  Hoàn thiện hồ sơ để tăng thứ hạng →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
