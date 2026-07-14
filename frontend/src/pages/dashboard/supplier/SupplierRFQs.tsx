import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Search, Filter, Clock, CheckCircle2, AlertCircle, Loader2, Send, X, Lock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { SupplierStatus } from '@/src/lib/enums';
import { CustomSelect } from '../../../components/CustomSelect';

const MAX_QUOTES = 10;

export function SupplierRFQs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quote modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [quoteForm, setQuoteForm] = useState({ price: '', currency: 'VND', leadTime: '', message: '' });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const supplierId = user?.supplier?.id;
  const isVerified = user?.supplier?.status === SupplierStatus.VERIFIED;

  useEffect(() => {
    loadRfqs();
  }, []);

  const loadRfqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rfqs/open');
      setRfqs(res.data);
    } catch (error) {
      console.error('Failed to load RFQs:', error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách RFQ' });
    } finally {
      setLoading(false);
    }
  };

  const openQuoteModal = (rfq: any) => {
    setSelectedRfq(rfq);
    setQuoteForm({ price: '', currency: 'VND', leadTime: '', message: '' });
    setIsQuoteModalOpen(true);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !selectedRfq) return;

    if (!quoteForm.price || !quoteForm.leadTime) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập giá và thời gian giao hàng' });
      return;
    }

    try {
      setSubmittingQuote(true);
      await api.post('/rfqs/quotes', {
        rfqId: selectedRfq.id,
        price: parseFloat(quoteForm.price),
        currency: quoteForm.currency,
        leadTime: quoteForm.leadTime,
        message: quoteForm.message,
      });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã gửi báo giá thành công!' });
      setIsQuoteModalOpen(false);
      // Reload to reflect status changes
      loadRfqs();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Không thể gửi báo giá';
      addToast({ type: 'error', title: 'Lỗi', message: msg });
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleViewQuote = async (rfq: any) => {
    try {
      const res = await api.get(`/rfqs/${rfq.id}`);
      const detail = res.data;
      const myQuote = detail.quotes?.find((q: any) => q.supplierId === supplierId);
      if (myQuote) {
        addToast({
          type: 'info',
          title: `Báo giá của bạn`,
          message: `Giá: ${myQuote.price} ${myQuote.currency} | Giao hàng: ${myQuote.leadTime} | Trạng thái: ${myQuote.status}`,
        });
      } else {
        addToast({ type: 'info', title: 'Thông tin', message: 'Bạn chưa gửi báo giá cho RFQ này' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
          {t('rfqs_received_title')}: <span className="text-ink font-semibold">{rfqs.length} yêu cầu báo giá</span>
        </p>
      </div>

      {/* Content */}

      {/* Banner for unverified suppliers */}
      {!isVerified && !loading && rfqs.length > 0 && (
        <div className="bg-card-bg shadow-subtle p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-surface-1 text-amber-600 border border-hairline flex items-center justify-center shrink-0" style={{ borderRadius: '4px' }}>
              <Lock size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink" style={{ letterSpacing: '0.16px' }}>{t('tai_khoan_chua_xac_thuc')}</p>
              <p className="text-xs text-ink-muted mt-0.5" style={{ letterSpacing: '0.16px' }}>{t('ban_chi_thay_tieu_de_rfq_de_xem_chi_tiet')} <strong>{t('xac_thuc_doanh_nghiep_kyb')}</strong>.</p>
            </div>
          </div>
          <Link to="/dashboard/supplier/profile" className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors inline-flex items-center gap-1.5" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
            <ShieldCheck size={14} /> Xác thực ngay
          </Link>
        </div>
      )}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : rfqs.map((rfq) => {
          const quoteCount = rfq._count?.quotes || 0;
          const isFull = quoteCount >= MAX_QUOTES;
          const progressPct = Math.min((quoteCount / MAX_QUOTES) * 100, 100);
          const isRestricted = rfq._restricted === true;
          return (
          <div key={rfq.id} className={`bg-card-bg shadow-subtle p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-bg transition-all group cursor-pointer rounded-lg ${isRestricted ? 'opacity-80' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-surface-1 border border-hairline flex items-center justify-center shrink-0" style={{ borderRadius: '4px' }}>
                {isRestricted ? (
                  <Lock size={24} className="text-ink-subtle" />
                ) : (
                  <FileText size={24} className="text-ink-subtle group-hover:text-primary transition-colors" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-ink group-hover:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>{rfq.productName}</div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-ink-muted font-normal">{rfq.buyer?.fullName || 'Khách hàng Ẩn danh'}</span>
                  <span className="text-hairline">•</span>
                  <span className="font-bold text-primary" style={{ letterSpacing: '0.16px' }}>SL: {rfq.quantity} {rfq.quantityUnit}</span>
                </div>
                {isRestricted && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Lock size={10} className="text-ink-subtle" />
                    <span className="text-[10px] font-normal text-ink-subtle italic">{t('mo_ta_chi_tiet_ngan_sach_dia_diem_bi_an')}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-[10px] font-normal text-ink-subtle uppercase tracking-widest mt-2" style={{ letterSpacing: '0.32px' }}>
                  <span>Hạn chót: {new Date(rfq.expiresAt).toLocaleDateString()}</span>
                </div>
                {/* Quote Progress Bar */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-28 h-2 bg-surface-1 overflow-hidden rounded-full">
                    <div 
                      className={`h-full transition-all rounded-full ${isFull ? 'bg-red-500' : progressPct > 60 ? 'bg-amber-500' : 'bg-primary'}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-normal uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-ink-subtle'}`} style={{ letterSpacing: '0.32px' }}>
                    {quoteCount}/{MAX_QUOTES} báo giá
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {rfq.status === 'OPEN' && !isFull ? (
                  <span className="flex items-center gap-1.5 bg-surface-1 text-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <Clock size={12} /> Đang mở
                  </span>
                ) : rfq.status === 'OPEN' && isFull ? (
                  <span className="flex items-center gap-1.5 bg-surface-1 text-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <AlertCircle size={12} /> Đầy
                  </span>
                ) : rfq.status === 'CLOSED' ? (
                  <span className="flex items-center gap-1.5 bg-surface-2 text-ink-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <CheckCircle2 size={12} /> Đã đóng
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-surface-2 text-ink-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border border-hairline" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
                    <AlertCircle size={12} /> {t('status_closed')}
                  </span>
                )}
              </div>
              {isRestricted ? (
                <Link 
                  to="/dashboard/supplier/profile"
                  className="px-6 py-2.5 font-semibold uppercase tracking-widest text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 bg-surface-2 text-amber-700 border border-hairline hover:bg-surface-3"
                  style={{ borderRadius: '4px', letterSpacing: '0.32px' }}
                >
                  <Lock size={14} /> Xác thực để báo giá
                </Link>
              ) : rfq.status === 'OPEN' && !isFull ? (
                <button 
                  onClick={() => openQuoteModal(rfq)}
                  className="px-6 py-2.5 font-semibold uppercase tracking-widest text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover"
                  style={{ borderRadius: '4px', letterSpacing: '0.32px' }}
                >
                  <Send size={14} /> Gửi báo giá
                </button>
              ) : rfq.status === 'OPEN' && isFull ? (
                <button 
                  disabled
                  className="px-6 py-2.5 font-semibold uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 bg-surface-2 text-ink-subtle border border-hairline cursor-not-allowed"
                  style={{ borderRadius: '4px', letterSpacing: '0.32px' }}
                >
                  Đã đủ báo giá
                </button>
              ) : (
                <button 
                  onClick={() => handleViewQuote(rfq)}
                  className="px-6 py-2.5 font-semibold uppercase tracking-widest text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 bg-canvas text-ink border border-hairline hover:bg-surface-1"
                  style={{ borderRadius: '4px', letterSpacing: '0.32px' }}
                >
                  Xem báo giá đã gửi
                </button>
              )}
            </div>
          </div>
        );
        })}
      </div>
      {!loading && rfqs.length === 0 && (
        <div className="p-20 text-center space-y-4 bg-card-bg shadow-subtle rounded-lg">
          <div className="w-20 h-20 bg-surface-1 border border-hairline flex items-center justify-center mx-auto" style={{ borderRadius: '4px' }}>
            <FileText size={40} className="text-ink-subtle" />
          </div>
          <h3 className="text-lg font-bold text-ink uppercase tracking-tight" style={{ letterSpacing: '0.16px' }}>{t('no_rfqs_title')}</h3>
          <p className="text-ink-muted text-sm max-w-xs mx-auto" style={{ letterSpacing: '0.16px' }}>{t('no_rfqs_desc')}</p>
          <Link to="/dashboard/supplier/profile" className="inline-block bg-primary text-white px-8 py-3 font-semibold hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs" style={{ borderRadius: '4px', letterSpacing: '0.32px' }}>
            {t('improve_profile')}
          </Link>
        </div>
      )}

      {/* Quote Submission Modal */}
      {isQuoteModalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-card-bg w-full max-w-lg shadow-lg overflow-hidden rounded-lg">
            <div className="p-6 border-b border-hairline bg-surface-1 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>Gửi báo giá</h3>
                <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{selectedRfq.productName}</p>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="text-ink-subtle hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="p-6 space-y-5">
              {/* RFQ Info Summary */}
              <div className="bg-surface-1 p-4 border border-hairline space-y-2 text-sm" style={{ borderRadius: '4px' }}>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Người mua</span>
                  <span className="font-semibold text-ink">{selectedRfq.buyer?.fullName || 'Ẩn danh'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Số lượng</span>
                  <span className="font-semibold text-ink">{selectedRfq.quantity} {selectedRfq.quantityUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">{t('diem_den')}</span>
                  <span className="font-semibold text-ink">{selectedRfq.destination}</span>
                </div>
                {selectedRfq.budget && (
                  <div className="flex justify-between">
                    <span className="text-ink-muted">{t('ngan_sach')}</span>
                    <span className="font-bold text-primary" style={{ letterSpacing: '0.16px' }}>{selectedRfq.budget}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('gia_don_vi')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={quoteForm.price} 
                    onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                    style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-widest block mb-1" style={{ letterSpacing: '0.32px' }}>{t('don_vi_tien')}</label>
                  <CustomSelect 
                    options={[
                      { value: 'VND', label: 'VND' },
                      { value: 'USD', label: 'USD' },
                      { value: 'EUR', label: 'EUR' }
                    ]}
                    value={quoteForm.currency}
                    onChange={(val) => setQuoteForm({...quoteForm, currency: val})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('thoi_gian_giao_hang')}</label>
                <input 
                  type="text" 
                  required
                  value={quoteForm.leadTime}
                  onChange={(e) => setQuoteForm({...quoteForm, leadTime: e.target.value})}
                  placeholder="VD: 15-20 ngày"
                  className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                  style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('ghi_chu_cho_nguoi_mua')}</label>
                <textarea 
                  rows={3}
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                  placeholder="Thêm ghi chú về sản phẩm, điều kiện giao hàng, thanh toán..."
                  className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary resize-none" 
                  style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="flex-1 bg-surface-2 text-ink py-3 font-semibold transition-all uppercase tracking-widest text-xs hover:bg-surface-3"
                  style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submittingQuote}
                  className="flex-1 bg-primary text-white py-3 font-semibold transition-all uppercase tracking-widest text-xs hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ borderRadius: '4px', letterSpacing: '0.16px' }}
                >
                  {submittingQuote && <Loader2 size={14} className="animate-spin" />}
                  <Send size={14} /> Gửi báo giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
