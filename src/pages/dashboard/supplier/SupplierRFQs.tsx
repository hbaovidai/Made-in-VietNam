import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { FileText, ChevronRight, Search, Filter, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SupplierRFQs() {
  const { t } = useTranslation();

  const rfqs = [
    { id: 'RFQ-001', buyer: 'John Smith', company: 'US Retail Group', product: 'Cotton T-shirts for Summer Collection', date: 'Mar 20, 2026', status: 'New', quotes: 0 },
    { id: 'RFQ-002', buyer: 'Maria Garcia', company: 'EU Sourcing Ltd.', product: 'Industrial Grade PVC Pipes', date: 'Mar 18, 2026', status: 'Quoted', quotes: 1 },
    { id: 'RFQ-003', buyer: 'Ahmed Khan', company: 'Dubai Trading Co.', product: 'Eco-friendly Bamboo Packaging', date: 'Mar 15, 2026', status: 'Quoted', quotes: 1 },
    { id: 'RFQ-004', buyer: 'Lee Wei', company: 'Asia Tech Solutions', product: 'LED Smart Home Lighting System', date: 'Mar 10, 2026', status: 'Closed', quotes: 0 },
  ];

  return (
    <DashboardSection 
      title={t('rfqs_received_title')} 
      subtitle={t('rfqs_received_subtitle')}
      actions={
        <div className="flex gap-2">
          <div className="relative">
            <input type="text" placeholder={t('search_rfqs')} className="pl-8 pr-4 py-2 bg-white border border-slate-200 text-xs outline-none focus:border-primary" />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors">
            <Filter size={18} />
          </button>
        </div>
      }
    >
      <div className="divide-y divide-slate-100">
        {rfqs.map((rfq) => (
          <div key={rfq.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{rfq.product}</div>
                <div className="text-xs text-slate-500">{rfq.buyer} - <span className="font-bold text-slate-700">{rfq.company}</span></div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  <span>ID: {rfq.id}</span>
                  <span>{t('received_label')} {rfq.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                {rfq.status === 'New' ? (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    <Clock size={12} /> {t('status_new')}
                  </span>
                ) : rfq.status === 'Quoted' ? (
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                    <CheckCircle2 size={12} /> {t('status_quoted')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                    <AlertCircle size={12} /> {t('status_closed')}
                  </span>
                )}
                <ChevronRight size={16} className="text-slate-300 group-hover:text-primary" />
              </div>
              <button className={`px-6 py-2 font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 ${rfq.status === 'New' ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"}`}>
                {rfq.status === 'New' ? t('submit_quote') : t('view_quote')}
              </button>
            </div>
          </div>
        ))}
      </div>
      {rfqs.length === 0 && (
        <div className="p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <FileText size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('no_rfqs_title')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_rfqs_desc')}</p>
          <Link to="/dashboard/supplier/profile" className="inline-block bg-primary text-white px-8 py-3 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs">
            {t('improve_profile')}
          </Link>
        </div>
      )}
    </DashboardSection>
  );
}
