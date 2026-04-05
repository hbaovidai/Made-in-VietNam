import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { FileText, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function BuyerRFQs() {
  const { t } = useTranslation();

  const rfqs = [
    { id: 'RFQ-001', title: 'Cotton T-shirts for Summer Collection', date: 'Mar 20, 2026', status: 'Active', quotes: 5 },
    { id: 'RFQ-002', title: 'Industrial Grade PVC Pipes', date: 'Mar 18, 2026', status: 'Active', quotes: 3 },
    { id: 'RFQ-003', title: 'Eco-friendly Bamboo Packaging', date: 'Mar 15, 2026', status: 'Completed', quotes: 12 },
    { id: 'RFQ-004', title: 'LED Smart Home Lighting System', date: 'Mar 10, 2026', status: 'Expired', quotes: 8 },
  ];

  return (
    <DashboardSection 
      title={t('my_rfqs_title')} 
      subtitle={t('my_rfqs_subtitle')}
      actions={
        <Link to="/rfq" className="bg-primary text-white px-6 py-2 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
          {t('post_new_rfq')}
        </Link>
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
                <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{rfq.title}</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>ID: {rfq.id}</span>
                  <span>{t('posted_label')} {rfq.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">{rfq.quotes}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('quotes_label')}</div>
              </div>
              <div className="flex items-center gap-2">
                {rfq.status === 'Active' ? (
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                    <Clock size={12} /> {t('status_active')}
                  </span>
                ) : rfq.status === 'Completed' ? (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    <CheckCircle2 size={12} /> {t('status_completed')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                    <AlertCircle size={12} /> {t('status_expired')}
                  </span>
                )}
                <ChevronRight size={16} className="text-slate-300 group-hover:text-primary" />
              </div>
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
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_rfqs_buyer_desc')}</p>
          <Link to="/rfq" className="inline-block bg-primary text-white px-8 py-3 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs">
            {t('post_rfq_now')}
          </Link>
        </div>
      )}
    </DashboardSection>
  );
}
