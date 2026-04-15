import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function BuyerRFQs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      api.get(`/rfqs/buyer/${user.id}`)
        .then(res => setRfqs(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const viewQuotes = async (rfqId: string) => {
    setIsModalOpen(true);
    setLoadingQuotes(true);
    try {
      const res = await api.get(`/rfqs/${rfqId}`);
      setSelectedRfq(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('my_rfqs_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('my_rfqs_subtitle')}</p>
      </div>
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : rfqs.map((rfq) => (
          <div key={rfq.id} onClick={() => viewQuotes(rfq.id)} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{rfq.productName}</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>ID: {rfq.id}</span>
                  <span>{t('posted_label')} {new Date(rfq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">{rfq._count?.quotes || 0}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('quotes_label')}</div>
              </div>
              <div className="flex items-center gap-2">
                {rfq.status === 'OPEN' ? (
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                    <Clock size={12} /> {t('status_active')}
                  </span>
                ) : rfq.status === 'CLOSED' ? (
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
      {!loading && rfqs.length === 0 && (
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

      {/* Quotes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Quotes for {selectedRfq?.productName || 'RFQ'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {loadingQuotes ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : selectedRfq?.quotes?.length > 0 ? (
                <div className="space-y-4">
                  {selectedRfq.quotes.map((quote: any) => (
                    <div key={quote.id} className="bg-white p-6 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <img src={quote.supplier?.logo || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded border" />
                          <div>
                            <div className="font-bold text-slate-900">{quote.supplier?.companyName}</div>
                            {quote.supplier?.isVerified && <div className="text-[10px] text-green-600 font-bold uppercase">Verified Supplier</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{quote.price} {quote.currency}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Thời gian giao: {quote.leadTime}</div>
                        </div>
                      </div>
                      {quote.message && (
                        <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 whitespace-pre-wrap">
                          {quote.message}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-primary text-white py-2 text-xs font-bold transition-all uppercase tracking-widest hover:bg-primary-dark">Chấp nhận</button>
                        <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 text-xs font-bold transition-all uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900">Liên hệ</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-sm">Chưa có báo giá nào cho RFQ này.</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-white">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-100 text-slate-900 py-3 font-bold transition-all uppercase tracking-widest text-xs hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
