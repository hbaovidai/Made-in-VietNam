import React from 'react';
import { FileText, Heart, MessageSquare, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { products } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export function BuyerDashboard() {
  const { t } = useTranslation();
  const stats = [
    { label: t('active_rfqs'), value: '12', icon: <FileText size={20} />, color: 'bg-blue-500' },
    { icon: <MessageSquare size={20} />, label: t('new_messages'), value: '5', color: 'bg-primary' },
    { icon: <Heart size={20} />, label: t('saved_items'), value: '24', color: 'bg-pink-500' },
    { icon: <Clock size={20} />, label: t('pending_quotes'), value: '8', color: 'bg-viet-gold' },
  ];

  const recentRfqs = [
    { id: 'RFQ-1024', product: 'Organic Robusta Coffee', status: 'Active', quotes: 5, date: 'Mar 20, 2026' },
    { id: 'RFQ-1025', product: 'Bamboo Furniture Set', status: 'Pending', quotes: 0, date: 'Mar 21, 2026' },
    { id: 'RFQ-1026', product: 'Cotton T-Shirts', status: 'Completed', quotes: 12, date: 'Mar 15, 2026' },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                <ArrowUpRight size={14} />
                <span>+12%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent RFQs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{t('recent_rfqs')}</h3>
            <button className="text-primary font-bold text-sm hover:underline">{t('view_all')}</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('rfq_id')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('product')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('quotes')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{rfq.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{rfq.product}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rfq.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                        rfq.status === 'Pending' ? 'bg-viet-gold/20 text-viet-gold-dark' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {t(rfq.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{rfq.quotes}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{rfq.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Products Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{t('saved_items')}</h3>
            <button className="text-primary font-bold text-sm hover:underline">{t('view_all')}</button>
          </div>
          <div className="space-y-4">
            {products.slice(0, 2).map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                  <div className="text-primary font-bold text-sm mt-1">{product.priceRange}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{t('moq')}: {product.moq}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
