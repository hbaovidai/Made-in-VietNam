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
        <h1 className="text-xl font-bold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('my_rfqs_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('my_rfqs_subtitle')}</p>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : rfqs.map((rfq) => (
          <div key={rfq.id} onClick={() => viewQuotes(rfq.id)} className="p-6 bg-card-bg shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-bg transition-all group cursor-pointer rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-surface-1 border border-hairline flex items-center justify-center shrink-0" style={{ borderRadius: '4px' }}>
                <FileText size={24} className="text-ink-muted group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-ink group-hover:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>{rfq.productName}</div>
                <div className="flex items-center gap-4 text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>
                  <span>ID: {rfq.id.slice(0, 8)}...</span>
                  <span>{t('posted_label')} {new Date(rfq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-lg font-bold text-ink">{rfq._count?.quotes || 0}<span className="text-xs font-normal text-ink-subtle">/10</span></div>
                <div className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('quotes_label')}</div>
              </div>
              <div className="flex items-center gap-2">
                {rfq.status === 'OPEN' ? (
                  <span className="flex items-center gap-1.5 bg-surface-1 text-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <Clock size={12} /> {t('status_active')}
                  </span>
                ) : rfq.status === 'CLOSED' ? (
                  <span className="flex items-center gap-1.5 bg-surface-1 text-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <CheckCircle2 size={12} /> {t('status_completed')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-surface-2 text-ink-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <AlertCircle size={12} /> {t('status_expired')}
                  </span>
                )}
                <ChevronRight size={16} className="text-hairline group-hover:text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {!loading && rfqs.length === 0 && (
        <div className="p-20 text-center space-y-4 bg-card-bg shadow-subtle rounded-lg">
          <div className="w-20 h-20 bg-surface-1 border border-hairline flex items-center justify-center mx-auto" style={{ borderRadius: '4px' }}>
            <FileText size={40} className="text-ink-subtle" />
          </div>
          <h3 className="text-lg font-bold text-ink uppercase tracking-tight" style={{ letterSpacing: '0.32px' }}>{t('no_rfqs_title')}</h3>
          <p className="text-ink-muted text-sm max-w-xs mx-auto" style={{ letterSpacing: '0.16px' }}>{t('no_rfqs_buyer_desc')}</p>
          <Link to="/rfq" className="inline-block bg-primary text-white px-8 py-3 font-semibold hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
            {t('post_rfq_now')}
          </Link>
        </div>
      )}

      {/* Quotes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card-bg w-full max-w-3xl shadow-lg flex flex-col max-h-[85vh] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-hairline flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('rfq_quotes_for', { name: selectedRfq?.productName || 'RFQ' })}</h3>
                <p className="text-xs text-ink-subtle mt-1" style={{ letterSpacing: '0.16px' }}>
                  {t('rfq_quotes_received', { count: selectedRfq?.quotes?.length || 0 })}
                  {selectedRfq?.status === 'CLOSED' && <span className="text-blue-500 ml-2">{t('rfq_closed_label')}</span>}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-muted hover:text-ink text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-surface-1">
              {loadingQuotes ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : selectedRfq?.quotes?.length > 0 ? (
                <div className="space-y-4">
                  {selectedRfq.quotes.map((quote: any) => (
                    <div key={quote.id} className={`bg-card-bg p-6 border transition-all rounded-lg ${
                      quote.status === 'ACCEPTED' 
                        ? 'border-emerald-500 shadow-md' 
                        : quote.status === 'REJECTED' 
                        ? 'border-hairline opacity-50' 
                        : 'border-hairline shadow-subtle'
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
                          <div className="text-xl font-bold text-primary">{quote.price?.toLocaleString()} {quote.currency}</div>
                          <div className="text-[10px] text-ink-subtle uppercase font-normal" style={{ letterSpacing: '0.32px' }}>{t('rfq_delivery_label')} {quote.leadTime}</div>
                        </div>
                      </div>
                      {quote.message && (
                        <div className="text-sm text-ink-muted bg-surface-1 p-4 border border-hairline mb-4 whitespace-pre-wrap" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
                          {quote.message}
                        </div>
                      )}
                      {/* Action buttons - only show for PENDING quotes */}
                      {quote.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAcceptQuote(quote); }}
                            disabled={!!acceptingQuoteId}
                            className="flex-1 bg-primary text-white py-2.5 text-xs font-semibold transition-all uppercase tracking-widest hover:bg-primary-hover flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
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
                            className="flex-1 bg-canvas border border-hairline text-ink py-2.5 text-xs font-semibold transition-all uppercase tracking-widest hover:bg-surface-1 flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
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
                          className="w-full bg-surface-1 border border-hairline text-emerald-600 py-2.5 text-xs font-semibold transition-all uppercase tracking-widest hover:bg-surface-2 flex items-center justify-center gap-2 disabled:opacity-50"
                          style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
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
