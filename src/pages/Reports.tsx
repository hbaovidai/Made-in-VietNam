import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, Search, Filter } from 'lucide-react';

export function Reports() {
  const { t } = useTranslation();
  const reports = [
    { id: 1, title: "Textile Industry Audit Report 2026", type: t('industry_report'), date: "Mar 20, 2026", size: "4.2 MB", downloads: "1.2k" },
    { id: 2, title: "Electronics Manufacturing Growth Analysis", type: t('market_analysis'), date: "Mar 15, 2026", size: "2.8 MB", downloads: "850" },
    { id: 3, title: "Vietnam Logistics & Supply Chain Review", type: t('logistics'), date: "Mar 10, 2026", size: "5.1 MB", downloads: "2.1k" },
    { id: 4, title: "Sustainable Sourcing Trends in Vietnam", type: t('sustainability'), date: "Mar 05, 2026", size: "3.5 MB", downloads: "1.5k" },
    { id: 5, title: "Vietnam Export Performance Q1 2026", type: t('economic_data'), date: "Feb 28, 2026", size: "1.9 MB", downloads: "3.2k" },
    { id: 6, title: "Furniture Industry Supplier Directory", type: t('directory'), date: "Feb 20, 2026", size: "8.4 MB", downloads: "4.5k" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('audited_supplier_reports')} 
        description={t('audited_supplier_reports_desc')}
        breadcrumbs={[{ label: t('reports') }]}
        image="https://picsum.photos/seed/reports/400/600"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input type="text" placeholder={t('search_reports_placeholder')} className="w-full px-4 py-3 bg-white border border-slate-200 outline-none focus:border-viet-red shadow-sm" />
            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors">
              <Filter size={18} /> {t('filters')}
            </button>
            <button className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-3 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
              {t('latest_reports')}
            </button>
          </div>
        </div>

        {/* Featured Report */}
        <div className="bg-white border border-slate-200 p-8 mb-16 flex flex-col lg:flex-row gap-12 items-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-full lg:w-48 h-64 bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-xl rotate-2 hover:rotate-0 transition-transform">
            <FileText size={80} className="text-viet-red opacity-20" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2">
              <span className="bg-viet-red text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{t('premium_report')}</span>
              <span className="text-slate-400 text-xs">{t('updated_time', { time: '2 ' + t('hours_ago') })}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Vietnam Manufacturing Outlook 2026: The Comprehensive Guide</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('featured_report_desc')}
            </p>
            <div className="flex flex-wrap gap-8 text-sm font-bold text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {t('verified_data')}</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {t('expert_analysis')}</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {t('pages_count', { count: 120 })}</span>
            </div>
            <div className="pt-4 flex gap-4">
              <button className="bg-viet-red text-white px-10 py-4 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-xl shadow-red-500/20 flex items-center gap-2">
                <Download size={18} /> {t('download_full_report')}
              </button>
              <button className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-4 font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
                {t('view_sample')}
              </button>
            </div>
          </div>
        </div>

        {/* Report List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 border border-slate-200 hover:border-viet-red transition-all group cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-red-50 transition-colors">
                  <FileText size={24} className="text-slate-400 group-hover:text-viet-red transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.type}</span>
              </div>
              <h3 className="text-slate-900 font-bold group-hover:text-viet-red transition-colors mb-4 line-clamp-2">{report.title}</h3>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                <span>{report.date}</span>
                <span>{report.size}</span>
                <span>{report.downloads} {t('downloads').toLowerCase()}</span>
              </div>
              <button className="w-full py-3 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-viet-red hover:text-white hover:border-viet-red transition-all flex items-center justify-center gap-2">
                <Download size={14} /> {t('download_pdf')}
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-12 py-4 border-2 border-slate-200 text-slate-900 font-bold hover:bg-slate-100 hover:border-slate-300 transition-all uppercase tracking-widest text-sm">
            {t('browse_all_reports')}
          </button>
        </div>
      </div>
    </div>
  );
}
