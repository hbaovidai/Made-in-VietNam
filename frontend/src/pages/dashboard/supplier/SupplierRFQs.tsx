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
        <div className="bg-white border border-amber-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 rounded-xl">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t('tai_khoan_chua_xac_thuc')}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t('ban_chi_thay_tieu_de_rfq_de_xem_chi_tiet')} <strong>{t('xac_thuc_doanh_nghiep_kyb')}</strong>.</p>
            </div>
          </div>
          <Link to="/dashboard/supplier/profile" className="shrink-0 px-4 py-2 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 rounded-lg shadow-sm">
            <ShieldCheck size={14} /> Xác thực ngay
          </Link>
        </div>
      )}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : rfqs.map((rfq) => {
          const quoteCount = rfq._count?.quotes || 0;
          const isFull = quoteCount >= MAX_QUOTES;
          const progressPct = Math.min((quoteCount / MAX_QUOTES) * 100, 100);
          const isRestricted = rfq._restricted === true;
          return (
            <div key={rfq.id} className={`bg-white border border-slate-200/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-all group rounded-xl shadow-sm ${isRestricted ? 'opacity-80' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 rounded-xl">
                  {isRestricted ? (
                    <Lock size={20} className="text-slate-400" />
                  ) : (
                    <FileText size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rfq.productName}</div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-slate-500 font-medium">{rfq.buyer?.fullName || 'Khách hàng Ẩn danh'}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-blue-600">SL: {rfq.quantity} {rfq.quantityUnit}</span>
                  </div>
                  {isRestricted && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Lock size={10} className="text-amber-600" />
                      <span className="text-xs font-normal text-amber-700 italic">{t('mo_ta_chi_tiet_ngan_sach_dia_diem_bi_an')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-1">
                    <span>Hạn chót: {new Date(rfq.expiresAt).toLocaleDateString()}</span>
                  </div>
                  {/* Quote Progress Bar */}
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="w-24 h-1.5 bg-slate-100 overflow-hidden rounded-full">
                      <div 
                        className={`h-full transition-all rounded-full ${isFull ? 'bg-rose-500' : progressPct > 60 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${isFull ? 'text-rose-500' : 'text-slate-500'}`}>
                      {quoteCount}/{MAX_QUOTES} báo giá
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {rfq.status === 'OPEN' && !isFull ? (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                      <Clock size={12} /> Đang nhận báo giá
                    </span>
                  ) : rfq.status === 'OPEN' && isFull ? (
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                      <AlertCircle size={12} /> Đã đủ 10/10 báo giá
                    </span>
                  ) : rfq.status === 'CLOSED' ? (
                    <span className="flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                      <CheckCircle2 size={12} /> Đã đóng
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                      <AlertCircle size={12} /> {t('status_closed')}
                    </span>
                  )}
                </div>
                {isRestricted ? (
                  <Link 
                    to="/dashboard/supplier/profile"
                    className="px-4 py-2 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg shadow-2xs"
                  >
                    <Lock size={14} /> Xác thực để báo giá
                  </Link>
                ) : rfq.status === 'OPEN' && !isFull ? (
                  <button 
                    onClick={() => openQuoteModal(rfq)}
                    className="px-4 py-2 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm"
                  >
                    <Send size={14} /> Gửi báo giá
                  </button>
                ) : rfq.status === 'OPEN' && isFull ? (
                  <button 
                    disabled
                    className="px-4 py-2 font-medium text-xs flex items-center justify-center gap-1.5 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed rounded-lg"
                  >
                    Đã đủ báo giá
                  </button>
                ) : (
                  <button 
                    onClick={() => handleViewQuote(rfq)}
                    className="px-4 py-2 font-normal text-xs transition-all flex items-center justify-center gap-1.5 bg-canvas text-ink border border-hairline hover:bg-surface-1 rounded-lg"
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
        <div className="p-20 text-center space-y-4 bg-canvas border border-hairline rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-surface-1 border border-hairline flex items-center justify-center mx-auto rounded-xl">
            <FileText size={40} className="text-ink-subtle" />
          </div>
          <h3 className="text-lg font-bold text-ink uppercase tracking-tight" style={{ letterSpacing: '0.16px' }}>{t('no_rfqs_title')}</h3>
          <p className="text-ink-muted text-sm max-w-xs mx-auto" style={{ letterSpacing: '0.16px' }}>{t('no_rfqs_desc')}</p>
          <Link to="/dashboard/supplier/profile" className="inline-block bg-primary text-white px-8 py-3 font-semibold hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs rounded-lg">
            {t('improve_profile')}
          </Link>
        </div>
      )}

      {/* Quote Submission Modal */}
      {isQuoteModalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-canvas border border-hairline w-full max-w-lg shadow-xl overflow-hidden rounded-xl">
            <div className="p-5 border-b border-hairline bg-surface-1 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink">Gửi báo giá</h3>
                <p className="text-xs text-ink-muted mt-0.5">{selectedRfq.productName}</p>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="text-ink-subtle hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="p-5 space-y-4">
              {/* RFQ Info Summary */}
              <div className="bg-surface-1 p-3.5 border border-hairline space-y-1.5 text-xs rounded-lg">
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
                    <span className="font-semibold text-primary">{selectedRfq.budget}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t('gia_don_vi')}</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={quoteForm.price} 
                    onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-2xs transition-all" 
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">{t('don_vi_tien')}</label>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t('thoi_gian_giao_hang')}</label>
                <input 
                  type="text" 
                  required
                  value={quoteForm.leadTime}
                  onChange={(e) => setQuoteForm({...quoteForm, leadTime: e.target.value})}
                  placeholder="VD: 15-20 ngày"
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-2xs transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t('ghi_chu_cho_nguoi_mua')}</label>
                <textarea 
                  rows={3}
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                  placeholder="Thêm ghi chú về sản phẩm, điều kiện giao hàng, thanh toán..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none rounded-lg shadow-2xs transition-all" 
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 text-xs font-semibold transition-all hover:bg-slate-50 rounded-lg shadow-sm"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submittingQuote}
                  className="flex-1 bg-blue-600 text-white py-2.5 text-xs font-semibold transition-all hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5 rounded-lg shadow-sm"
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
