import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { FileText, ChevronRight, Search, Filter, Clock, CheckCircle2, AlertCircle, Loader2, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

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
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : rfqs.map((rfq) => (
          <div key={rfq.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{rfq.productName}</div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-600 font-medium">{rfq.buyer?.fullName || 'Khách hàng Ẩn danh'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-[#A2875E]">SL: {rfq.quantity} {rfq.quantityUnit}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  <span>Hạn chót: {new Date(rfq.expiresAt).toLocaleDateString()}</span>
                  {rfq._count?.quotes > 0 && <span>{rfq._count.quotes} báo giá</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {rfq.status === 'OPEN' ? (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                    <Clock size={12} /> {t('status_new')}
                  </span>
                ) : rfq.status === 'QUOTED' ? (
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                    <CheckCircle2 size={12} /> {t('status_quoted')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                    <AlertCircle size={12} /> {t('status_closed')}
                  </span>
                )}
              </div>
              {rfq.status === 'OPEN' ? (
                <button 
                  onClick={() => openQuoteModal(rfq)}
                  className="px-6 py-2.5 font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg transition-all flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20"
                >
                  <Send size={14} /> Gửi báo giá
                </button>
              ) : (
                <button 
                  onClick={() => handleViewQuote(rfq)}
                  className="px-6 py-2.5 font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg transition-all flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                >
                  Xem báo giá đã gửi
                </button>
              )}
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
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_rfqs_desc')}</p>
          <Link to="/dashboard/supplier/profile" className="inline-block bg-primary text-white px-8 py-3 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs">
            {t('improve_profile')}
          </Link>
        </div>
      )}

      {/* Quote Submission Modal */}
      {isQuoteModalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Gửi báo giá</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedRfq.productName}</p>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="p-6 space-y-5">
              {/* RFQ Info Summary */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Người mua</span>
                  <span className="font-bold text-slate-900">{selectedRfq.buyer?.fullName || 'Ẩn danh'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số lượng</span>
                  <span className="font-bold text-slate-900">{selectedRfq.quantity} {selectedRfq.quantityUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm đến</span>
                  <span className="font-bold text-slate-900">{selectedRfq.destination}</span>
                </div>
                {selectedRfq.budget && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngân sách</span>
                    <span className="font-bold text-[#A2875E]">{selectedRfq.budget}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá đơn vị *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={quoteForm.price} 
                    onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn vị tiền</label>
                  <select 
                    value={quoteForm.currency}
                    onChange={(e) => setQuoteForm({...quoteForm, currency: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary rounded-lg"
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian giao hàng *</label>
                <input 
                  type="text" 
                  required
                  value={quoteForm.leadTime}
                  onChange={(e) => setQuoteForm({...quoteForm, leadTime: e.target.value})}
                  placeholder="VD: 15-20 ngày"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary rounded-lg" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghi chú cho người mua</label>
                <textarea 
                  rows={3}
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                  placeholder="Thêm ghi chú về sản phẩm, điều kiện giao hàng, thanh toán..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary rounded-lg resize-none" 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-900 py-3 font-bold transition-all uppercase tracking-widest text-xs hover:bg-slate-200 rounded-lg"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submittingQuote}
                  className="flex-1 bg-primary text-white py-3 font-bold transition-all uppercase tracking-widest text-xs hover:bg-primary-dark rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingQuote && <Loader2 size={14} className="animate-spin" />}
                  <Send size={14} /> Gửi báo giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
