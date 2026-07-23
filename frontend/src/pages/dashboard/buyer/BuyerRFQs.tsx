import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Clock, CheckCircle2, AlertCircle, Loader2, MessageSquare, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';
import { SupplierStatus } from '@/src/lib/enums';

export function BuyerRFQs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptingQuoteId, setAcceptingQuoteId] = useState<string | null>(null);
  const [contactingQuoteId, setContactingQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadRfqs();
    }
  }, [user]);

  const loadRfqs = () => {
    if (!user?.id) return;
    setLoading(true);
    api.get(`/rfqs/buyer/${user.id}`)
      .then(res => setRfqs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

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

  // Chấp nhận báo giá → close RFQ + tạo hội thoại + gửi tin nhắn tự động
  const handleAcceptQuote = async (quote: any) => {
    if (!user?.id) return;
    setAcceptingQuoteId(quote.id);
    try {
      // 1. Accept quote on backend
      await api.put(`/rfqs/quotes/${quote.id}/accept`);

      // 2. Create conversation with supplier + auto message
      const supplierUserId = quote.supplier?.userId;
      if (supplierUserId) {
        const convoRes = await api.post('/messages/conversations', {
          targetUserId: supplierUserId,
          initialMessage: `✅ Tôi đã chấp nhận báo giá của bạn cho "${selectedRfq?.productName}".\n\n💰 Giá: ${quote.price?.toLocaleString()} ${quote.currency}\n📦 Thời gian giao: ${quote.leadTime}\n\nHãy cùng bàn chi tiết đơn hàng nhé!`,
        });

        addToast({
          type: 'success',
          title: t('rfq_accept_success'),
          message: t('rfq_accept_success_msg', { name: quote.supplier?.companyName }),
        });

        // 3. Navigate to messages
        setTimeout(() => {
          navigate('/dashboard/buyer/messages');
        }, 1500);
      } else {
        addToast({ type: 'success', title: t('buyer_success'), message: t('rfq_accept_success') });
      }

      // Refresh data
      setIsModalOpen(false);
      loadRfqs();
    } catch (err: any) {
      const msg = err.response?.data?.message || t('rfq_accept_error');
      addToast({ type: 'error', title: t('buyer_error'), message: msg });
    } finally {
      setAcceptingQuoteId(null);
    }
  };

  // Liên hệ supplier → tạo hội thoại → chuyển đến chat
  const handleContactSupplier = async (quote: any) => {
    if (!user?.id) return;
    setContactingQuoteId(quote.id);
    try {
      const supplierUserId = quote.supplier?.userId;
      if (!supplierUserId) {
        addToast({ type: 'error', title: t('buyer_error'), message: t('rfq_supplier_not_found') });
        return;
      }

      await api.post('/messages/conversations', {
        targetUserId: supplierUserId,
        initialMessage: `Xin chào ${quote.supplier?.companyName}! 👋\n\nTôi quan tâm đến báo giá của bạn cho "${selectedRfq?.productName}" (${quote.price?.toLocaleString()} ${quote.currency}).\n\nTôi muốn trao đổi thêm chi tiết trước khi quyết định.`,
      });

      addToast({
        type: 'success',
        title: t('rfq_convo_created'),
        message: t('rfq_convo_created_msg', { name: quote.supplier?.companyName }),
      });

      setTimeout(() => {
        navigate('/dashboard/buyer/messages');
      }, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || t('rfq_convo_error');
      addToast({ type: 'error', title: t('buyer_error'), message: msg });
    } finally {
      setContactingQuoteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-sm font-bold text-slate-900">{t('my_rfqs_title')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t('my_rfqs_subtitle')}</p>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : rfqs.map((rfq) => (
          <div key={rfq.id} onClick={() => viewQuotes(rfq.id)} className="p-5 bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-all group cursor-pointer rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 rounded-xl">
                <FileText size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rfq.productName}</div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                  <span>ID: {rfq.id.slice(0, 8)}...</span>
                  <span>•</span>
                  <span>{t('posted_label')} {new Date(rfq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-base font-extrabold text-slate-900">{rfq._count?.quotes || 0}<span className="text-xs font-medium text-slate-400">/10</span></div>
                <div className="text-xs font-medium text-slate-500">{t('quotes_label')}</div>
              </div>
              <div className="flex items-center gap-2">
                {rfq.status === 'OPEN' ? (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                    <Clock size={12} /> Đang nhận báo giá
                  </span>
                ) : rfq.status === 'CLOSED' ? (
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                    <CheckCircle2 size={12} /> Đã hoàn thành
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                    <AlertCircle size={12} /> Hết hạn
                  </span>
                )}
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {!loading && rfqs.length === 0 && (
        <div className="p-20 text-center space-y-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto rounded-2xl">
            <FileText size={40} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('no_rfqs_title')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_rfqs_buyer_desc')}</p>
          <Link to="/rfq" className="inline-block bg-blue-600 text-white px-8 py-3 font-semibold hover:bg-blue-700 transition-colors text-xs rounded-lg shadow-sm">
            {t('post_rfq_now')}
          </Link>
        </div>
      )}

      {/* Quotes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-3xl shadow-xl flex flex-col max-h-[85vh] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase">{t('rfq_quotes_for', { name: selectedRfq?.productName || 'RFQ' })}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t('rfq_quotes_received', { count: selectedRfq?.quotes?.length || 0 })}
                  {selectedRfq?.status === 'CLOSED' && <span className="text-blue-600 font-semibold ml-2">{t('rfq_closed_label')}</span>}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {loadingQuotes ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : selectedRfq?.quotes?.length > 0 ? (
                <div className="space-y-4">
                  {selectedRfq.quotes.map((quote: any) => (
                    <div key={quote.id} className={`bg-white p-6 border transition-all rounded-xl ${
                      quote.status === 'ACCEPTED' 
                        ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                        : quote.status === 'REJECTED' 
                        ? 'border-slate-200 opacity-50' 
                        : 'border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <img src={quote.supplier?.logo || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 border border-hairline" style={{ borderRadius: '4px' }} />
                          <div>
                            <div className="font-semibold text-ink" style={{ letterSpacing: '0.16px' }}>{quote.supplier?.companyName}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {quote.supplier?.status === SupplierStatus.VERIFIED && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold uppercase" style={{ letterSpacing: '0.32px' }}>
                                  <ShieldCheck size={10} /> Verified
                                </span>
                              )}
                              {quote.status === 'ACCEPTED' && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold uppercase bg-surface-1 border border-hairline px-2 py-0.5" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                                  <CheckCircle2 size={10} /> {t('rfq_accepted_label')}
                                </span>
                              )}
                              {quote.status === 'REJECTED' && (
                                <span className="text-[10px] text-ink-subtle font-semibold uppercase" style={{ letterSpacing: '0.32px' }}>{t('rfq_rejected_label')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-extrabold text-blue-600">{quote.price?.toLocaleString()} {quote.currency}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">{t('rfq_delivery_label')} {quote.leadTime}</div>
                        </div>
                      </div>
                      {quote.message && (
                        <div className="text-sm text-slate-700 bg-slate-50 p-4 border border-slate-200 mb-4 whitespace-pre-wrap rounded-lg">
                          {quote.message}
                        </div>
                      )}
                      {/* Action buttons - only show for PENDING quotes */}
                      {quote.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAcceptQuote(quote); }}
                            disabled={!!acceptingQuoteId}
                            className="flex-1 bg-blue-600 text-white py-2.5 text-xs font-semibold transition-all hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg shadow-sm"
                          >
                            {acceptingQuoteId === quote.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <ThumbsUp size={14} />
                            )}
                            {t('rfq_accept_btn')}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleContactSupplier(quote); }}
                            disabled={!!contactingQuoteId}
                            className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 text-xs font-semibold transition-all hover:bg-slate-50 flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg shadow-sm"
                          >
                            {contactingQuoteId === quote.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <MessageSquare size={14} />
                            )}
                            {t('rfq_contact_btn')}
                          </button>
                        </div>
                      )}
                      {/* If accepted, show chat button */}
                      {quote.status === 'ACCEPTED' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleContactSupplier(quote); }}
                          disabled={!!contactingQuoteId}
                          className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 text-xs font-semibold transition-all hover:bg-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50 rounded-lg"
                        >
                          {contactingQuoteId === quote.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <MessageSquare size={14} />
                          )}
                          {t('rfq_chat_supplier')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-ink-subtle text-sm" style={{ letterSpacing: '0.16px' }}>{t('rfq_no_quotes')}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-hairline bg-canvas">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-surface-2 text-ink py-3 font-semibold transition-all uppercase tracking-widest text-xs hover:bg-surface-3"
                style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
              >
                {t('rfq_close_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
