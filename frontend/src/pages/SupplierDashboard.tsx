import React from 'react';
import { Package, FileText, BarChart3, ArrowUpRight, TrendingUp, Users, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { products } from '../data/mockData';

export function SupplierDashboard() {
  const { t } = useTranslation();
  const stats = [
    { label: t('total_products'), value: '48', icon: <Package size={20} />, color: 'bg-blue-500' },
    { icon: <FileText size={20} />, label: t('rfqs_received'), value: '156', color: 'bg-primary' },
    { icon: <Users size={20} />, label: t('profile_views'), value: '2.4k', color: 'bg-emerald-500' },
    { icon: <DollarSign size={20} />, label: t('total_sales'), value: '$124k', color: 'bg-viet-gold' },
  ];

  const recentInquiries = [
    { id: 'INQ-552', buyer: 'Global Sourcing Ltd', product: 'Arabica Coffee Beans', status: 'New', date: '2 hours ago' },
    { id: 'INQ-551', buyer: 'EcoHome Decor', product: 'Bamboo Basket Set', status: 'Replied', date: '5 hours ago' },
    { id: 'INQ-550', buyer: 'Fashion Hub US', product: 'Cotton T-Shirts', status: 'New', date: 'Yesterday' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl font-bold">{t('supplier_welcome_back', { name: 'VietAgro Exports' })}</h2>
          <p className="text-slate-400 max-w-md">
            {t('supplier_performance_desc')}
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck size={18} />
            <span>{t('verified_gold_supplier')}</span>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary-dark/40">
            {t('add_new_product')}
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
            {t('edit_profile')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                <TrendingUp size={14} />
                <span>+8%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{t('recent_inquiries')}</h3>
            <button className="text-primary font-bold text-sm hover:underline">{t('manage_all')}</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('buyer')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('product')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{inq.buyer}</div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{inq.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{inq.product}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inq.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t(inq.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{inq.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="bg-viet-gold rounded-3xl p-8 text-slate-900 space-y-6 relative overflow-hidden shadow-xl shadow-yellow-400/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="w-12 h-12 bg-slate-900 text-viet-gold rounded-xl flex items-center justify-center shadow-lg">
            <Zap size={24} />
          </div>
          <h3 className="text-2xl font-bold leading-tight">{t('upgrade_to_premium_gold')}</h3>
          <p className="text-slate-800 text-sm leading-relaxed">
            {t('upgrade_premium_desc')}
          </p>
          <ul className="space-y-3">
            {[
              "unlimited_product_listings",
              "priority_search_ranking",
              "advanced_analytics",
              "verified_badge_plus"
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs font-bold">
                <ShieldCheck size={16} />
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl">
            {t('upgrade_now')}
          </button>
        </div>
      </div>
    </div>
  );
}
