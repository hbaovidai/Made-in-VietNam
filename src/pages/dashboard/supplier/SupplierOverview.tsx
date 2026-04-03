import React from 'react';
import { Package, MessageSquare, FileText, TrendingUp, ChevronRight, Star, ArrowUpRight, Eye, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SupplierOverview() {
  const { t } = useTranslation();

  const stats = [
    { label: t('active_products'), value: "48", icon: <Package className="text-blue-500" /> },
    { label: t('new_inquiries'), value: "15", icon: <MessageSquare className="text-orange-500" /> },
    { label: t('profile_views'), value: "1.2k", icon: <Eye className="text-yellow-500" /> },
    { label: t('total_leads'), value: "85", icon: <Users className="text-green-500" /> },
  ];

  const recentInquiries = [
    { id: 1, buyer: "John Smith", company: "US Retail Group", product: "Cotton T-shirts", time: "2 hours ago" },
    { id: 2, buyer: "Maria Garcia", company: "EU Sourcing Ltd.", product: "Electronic Components", time: "5 hours ago" },
    { id: 3, buyer: "Ahmed Khan", company: "Dubai Trading Co.", product: "Industrial Machinery", time: "1 day ago" },
    { id: 4, buyer: "Lee Wei", company: "Asia Tech Solutions", product: "Mobile Accessories", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t('supplier_dashboard_title')}</h1>
          <p className="text-slate-500 text-sm">{t('supplier_welcome')}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/dashboard/supplier/products" className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">
            {t('manage_products_btn')}
          </Link>
          <Link to="/dashboard/supplier/profile" className="bg-viet-red text-white px-6 py-2 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-500/20">
            {t('edit_profile_overview_btn')}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
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
              <button className="text-xs font-bold text-viet-red hover:underline">{t('view_all')}</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <Users size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 group-hover:text-viet-red transition-colors">{inquiry.buyer} - {inquiry.company}</div>
                      <div className="text-xs text-slate-500 mt-1">{t('interested_in')} <span className="font-medium text-slate-700">{inquiry.product}</span></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inquiry.time}</div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-viet-red ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{t('performance_trends')}</h2>
              <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 outline-none">
                <option>{t('last_30_days')}</option>
                <option>{t('last_7_days')}</option>
                <option>{t('last_6_months')}</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-4">
              {[40, 70, 45, 90, 65, 80, 55, 75, 60, 85, 50, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 relative group cursor-pointer">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-viet-red/20 group-hover:bg-viet-red transition-all" 
                    style={{ height: `${h}%` }} 
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h * 10} {t('views_suffix')}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Business Growth */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight">{t('grow_your_business')}</h3>
            <div className="space-y-4">
              <Link to="/premium" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{t('upgrade_to_premium')}</span>
                <ArrowUpRight size={16} className="text-viet-red" />
              </Link>
              <Link to="/services/membership" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{t('membership_benefits')}</span>
                <ArrowUpRight size={16} className="text-viet-red" />
              </Link>
              <Link to="/help/seller-guide" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{t('seller_guide_link')}</span>
                <ArrowUpRight size={16} className="text-viet-red" />
              </Link>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white border border-slate-200 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Award size={32} className="text-viet-red" />
              <h3 className="font-black text-slate-900 uppercase tracking-tight">{t('verified_supplier')}</h3>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {t('verified_supplier_desc')}
            </p>
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">
                <span>{t('profile_completion')}</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-viet-red" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
