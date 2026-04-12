import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { TrendingUp, TrendingDown, Eye, Users, MessageSquare, Package, ChevronRight, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function SupplierAnalytics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [statsData, setStatsData] = useState({
    products: 0,
    batches: 0,
    qrCodes: 0,
    totalViews: 0
  });
  const [topProductsData, setTopProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.supplier?.id) {
      setLoading(true);
      Promise.all([
        api.get(`/suppliers/${user.supplier.id}/stats`),
        api.get(`/products?supplierId=${user.supplier.id}&sortBy=viewCount&sortOrder=desc&limit=5`)
      ])
      .then(([statsRes, productsRes]) => {
        setStatsData(statsRes.data);
        setTopProductsData(productsRes.data.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [user]);

  const stats = [
    { label: t('profile_views'), value: (statsData.totalViews || 0).toString(), change: "+12%", trend: "up", icon: <Eye className="text-blue-500" /> },
    { label: t('products'), value: (statsData.products || 0).toString(), change: "+5%", trend: "up", icon: <Package className="text-orange-500" /> },
    { label: t('batches'), value: (statsData.batches || 0).toString(), change: "+2", trend: "up", icon: <MessageSquare className="text-blue-500" /> },
    { label: t('qrs_generated'), value: (statsData.qrCodes || 0).toString(), change: "+15%", trend: "up", icon: <Users className="text-green-500" /> },
  ];

  return (
    <DashboardSection 
      title={t('biz_analytics_title')} 
      subtitle={t('biz_analytics_subtitle')}
      actions={
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={14} /> {t('last_30_days')}
          </button>
          <button className="bg-slate-900 text-white px-6 py-2 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
            {t('export_data')}
          </button>
        </div>
      }
    >
      <div className="p-8 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Visitor Trend */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Eye size={20} className="text-primary" /> {t('visitor_trend')}
            </h3>
            <div className="h-64 flex items-end gap-2">
              {[30, 50, 40, 70, 60, 90, 80, 100, 85, 95, 75, 110].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 relative group cursor-pointer">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 group-hover:bg-primary transition-all" 
                    style={{ height: `${h}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{t('week_1')}</span><span>{t('week_2')}</span><span>{t('week_3')}</span><span>{t('week_4')}</span>
            </div>
          </div>

          {/* Inquiry Trend */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" /> {t('inquiry_trend')}
            </h3>
            <div className="h-64 flex items-end gap-2">
              {[20, 40, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 relative group cursor-pointer">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/20 group-hover:bg-blue-500 transition-all" 
                    style={{ height: `${h}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{t('week_1')}</span><span>{t('week_2')}</span><span>{t('week_3')}</span><span>{t('week_4')}</span>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" /> {t('top_performing_products')}
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : topProductsData.length === 0 ? (
              <div className="text-sm text-slate-500 text-center p-4">Chưa có sản phẩm nào</div>
            ) : topProductsData.map((product, idx) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">{product.category?.name || 'General'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">{product.viewCount}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">{t('views')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
