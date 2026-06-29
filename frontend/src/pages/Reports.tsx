import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, Search, Filter, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export function Reports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports').then((res) => {
      setReports(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbBar items={[{ label: t('reports') }]} />
      <PageHeader 
        title={t('audited_supplier_reports')} 
        description={t('audited_supplier_reports_desc')}
        breadcrumbs={[{ label: t('reports') }]}
        
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-lg border border-white/50 relative z-10">
          <div className="relative w-full md:w-96">
            <input type="text" placeholder={t('search_reports_placeholder')} className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            <Search size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl text-slate-700 font-bold hover:bg-slate-100 hover:text-primary transition-colors">
              <Filter size={18} /> {t('filters')}
            </button>
            <button className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 uppercase tracking-widest text-xs">
              {t('latest_reports')}
            </button>
          </div>
        </div>

        {/* Featured Report */}
        <div className="bg-white border text-left border-slate-100 p-8 lg:p-10 mb-16 flex flex-col lg:flex-row gap-12 items-center rounded-[2.5rem] shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all">
          <div className="w-full lg:w-64 h-80 bg-gradient-to-br from-slate-100 via-blue-50 to-primary/10 rounded-3xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity" />
            <FileText size={80} className="text-primary opacity-40 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/40 blur-2xl rounded-full" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                {t('premium_report')}
              </span>
              <span className="text-slate-400 text-xs font-medium">{t('updated_time', { time: '2 ' + t('hours_ago') })}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Vietnam Manufacturing Outlook 2026: The Comprehensive Guide</h2>
            <p className="text-slate-500 text-lg leading-relaxed font-light">
              {t('featured_report_desc')}
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl w-fit">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {t('verified_data')}</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {t('expert_analysis')}</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {t('pages_count', { count: 120 })}</span>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-1 uppercase tracking-widest text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                <Download size={18} /> {t('download_full_report')}
              </button>
              <button className="bg-slate-50 text-slate-700 px-10 py-4 rounded-2xl font-bold hover:bg-slate-100 hover:text-primary transition-colors uppercase tracking-widest text-sm text-center">
                {t('view_sample')}
              </button>
            </div>
          </div>
        </div>

        {/* Report List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-primary/30 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <FileText size={28} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="bg-slate-50 text-slate-500 group-hover:bg-primary/5 group-hover:text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">{report.category || 'Report'}</span>
                </div>
                <h3 className="text-lg text-slate-900 font-bold group-hover:text-primary transition-colors mb-4 line-clamp-2 leading-tight flex-1">{report.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
                  <span className="bg-slate-50 px-2 py-1 rounded-md">{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-emerald-600">{report.price === 0 ? 'Free' : `$${report.price}`}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); window.open(report.pdfUrl, '_blank'); }}
                  className="w-full py-4 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2 shadow-inner"
                >
                  <Download size={16} /> {t('download_pdf')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 hover:text-primary hover:shadow-md transition-all uppercase tracking-widest text-sm">
            {t('browse_all_reports')}
          </button>
        </div>
      </div>
    </div>
  );
}
