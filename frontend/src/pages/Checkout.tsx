import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Truck, CreditCard, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export function Checkout() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
    note: '',
    paymentMethod: 'COD'
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
    
    // Auto-fill from user profile if available
    setFormData(prev => ({
      ...prev,
      recipientName: user.fullName || '',
      recipientPhone: user.phone || ''
    }));
  }, [user]);

  const loadCart = async () => {
    try {
      const res = await api.get('/cart');
      const items = res.data?.items || [];
      if (items.length === 0) {
        navigate('/cart');
      }
      setCartItems(items);
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải giỏ hàng' });
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (item: any) => item.product?.minPrice || item.product?.price || 0;
  const getQty = (item: any) => parseInt(item.quantity) || 1;
  const getLineTotal = (item: any) => getPrice(item) * getQty(item);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + getLineTotal(item), 0);
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.recipientPhone || !formData.shippingAddress) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin giao hàng' });
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/orders', formData);
      addToast({ type: 'success', title: 'Thành công', message: 'Đặt hàng thành công!' });
      
      // Clear cart
      await api.delete('/cart');
      
      // Navigate to order history
      navigate('/dashboard/buyer/orders');
    } catch (e: any) {
      addToast({ type: 'error', title: 'Lỗi', message: e.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>{t('checkout_loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas min-h-screen pb-16">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-ink uppercase" style={{ letterSpacing: '0.16px' }}>{t('checkout_bulk_rfq_title')}</h1>
          <p className="text-sm text-ink-subtle mt-1" style={{ letterSpacing: '0.16px' }}>{t('checkout_review_desc')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Contact + B2B Info (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <div className="bg-canvas border border-hairline p-6 sm:p-8" style={{ borderRadius: 0 }}>
              <h2 className="text-base font-normal text-ink mb-6 flex items-center gap-2" style={{ letterSpacing: '0.16px' }}>
                <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>
                  <Truck size={16} className="text-primary" />
                </div>
                Thông tin Liên hệ & Địa chỉ nhận hàng
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-ink-subtle uppercase mb-1.5" style={{ letterSpacing: '0.32px' }}>{t('checkout_contact_name')} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                      className="w-full px-4 py-3 bg-surface-1 border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-sm font-normal text-ink placeholder:text-ink-subtle" style={{ borderRadius: 0 }}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-ink-subtle uppercase mb-1.5" style={{ letterSpacing: '0.32px' }}>{t('checkout_contact_phone')} <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={formData.recipientPhone}
                      onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                      className="w-full px-4 py-3 bg-surface-1 border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-sm font-normal text-ink placeholder:text-ink-subtle" style={{ borderRadius: 0 }}
                      placeholder="0912345678"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-normal text-ink-subtle uppercase mb-1.5" style={{ letterSpacing: '0.32px' }}>{t('checkout_shipping_address')} <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-sm font-normal text-ink placeholder:text-ink-subtle resize-none" style={{ borderRadius: 0 }}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-normal text-ink-subtle uppercase mb-1.5" style={{ letterSpacing: '0.32px' }}>{t('checkout_special_notes')}</label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-sm font-normal text-ink placeholder:text-ink-subtle resize-none" style={{ borderRadius: 0 }}
                    placeholder="Ví dụ: Yêu cầu chứng chỉ CO/CQ, đóng gói xuất khẩu, yêu cầu thời gian giao hàng gấp..."
                  />
                </div>
              </div>
            </div>

            {/* B2B Process Card */}
            <div className="bg-canvas border border-hairline p-6 sm:p-8" style={{ borderRadius: 0 }}>
              <h2 className="text-base font-normal text-ink mb-4 flex items-center gap-2" style={{ letterSpacing: '0.16px' }}>
                <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>
                  <ShieldCheck size={16} className="text-primary" />
                </div>
                Quy trình giao dịch B2B
              </h2>
              
              <div className="space-y-4 text-sm text-ink-muted leading-relaxed" style={{ letterSpacing: '0.16px' }}>
                <p>
                  Yêu cầu hỏi giá sỉ của bạn sẽ được chuyển tiếp trực tiếp đến các nhà cung cấp tương ứng để phản hồi báo giá.
                </p>
                <div className="flex gap-3 p-4 bg-surface-1 border border-hairline text-xs" style={{ borderRadius: 0 }}>
                  <div className="w-5 h-5 bg-primary text-white flex items-center justify-center shrink-0 font-normal" style={{ borderRadius: 0 }}>1</div>
                  <div>
                    <h4 className="font-normal text-ink mb-0.5">{t('checkout_confirm_request')}</h4>
                    <p className="text-ink-subtle">{t('checkout_confirm_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-surface-1 border border-hairline text-xs" style={{ borderRadius: 0 }}>
                  <div className="w-5 h-5 bg-primary text-white flex items-center justify-center shrink-0 font-normal" style={{ borderRadius: 0 }}>2</div>
                  <div>
                    <h4 className="font-normal text-ink mb-0.5">{t('checkout_trade_agreement')}</h4>
                    <p className="text-ink-subtle">{t('checkout_trade_agreement_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-canvas border border-hairline p-6 sticky top-24" style={{ borderRadius: 0 }}>
              <h2 className="text-base font-normal text-ink mb-5 flex items-center gap-2" style={{ letterSpacing: '0.16px' }}>
                <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>
                  <ShoppingCart size={16} className="text-primary" />
                </div>
                Sản phẩm gửi hỏi giá
              </h2>

              {/* Product list with unit price × qty */}
              <div className="space-y-0 mb-5 max-h-[360px] overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className={`flex gap-3 py-4 ${idx > 0 ? 'border-t border-hairline' : ''}`}>
                    <div className="w-14 h-14 bg-surface-2 border border-hairline overflow-hidden shrink-0" style={{ borderRadius: 0 }}>
                      <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-normal text-ink truncate leading-tight" style={{ letterSpacing: '0.16px' }}>{item.product.name}</div>
                      <div className="text-xs text-ink-subtle mt-1 flex items-center gap-1" style={{ letterSpacing: '0.16px' }}>
                        <span>{formatCurrency(getPrice(item))}₫</span>
                        <span className="text-hairline">×</span>
                        <span>{getQty(item)} {item.product.unit || 'cái'}</span>
                      </div>
                      <div className="text-sm font-normal text-primary mt-1" style={{ letterSpacing: '0.16px' }}>{formatCurrency(getLineTotal(item))}₫</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice breakdown */}
              <div className="border-t border-hairline pt-4 space-y-3 mb-5">
                {/* Per-item breakdown table */}
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-ink-subtle font-normal uppercase" style={{ letterSpacing: '0.32px' }}>
                      <th className="text-left pb-2">{t('supplier_products_tab')}</th>
                      <th className="text-center pb-2">{t('checkout_ref_wholesale_price')}</th>
                      <th className="text-center pb-2">SL</th>
                      <th className="text-right pb-2">{t('checkout_subtotal')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="text-ink border-t border-hairline">
                        <td className="py-2 pr-2 max-w-[120px] truncate font-normal">{item.product.name}</td>
                        <td className="py-2 text-center whitespace-nowrap">{formatCurrency(getPrice(item))}₫</td>
                        <td className="py-2 text-center">{getQty(item)}</td>
                        <td className="py-2 text-right font-normal text-ink whitespace-nowrap">{formatCurrency(getLineTotal(item))}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-hairline pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                    <span>Tạm tính ({cartItems.length} mặt hàng)</span>
                    <span className="font-normal text-ink">{formatCurrency(calculateTotal())}₫</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                    <span>{t('checkout_shipping_tax')}</span>
                    <span className="text-primary font-normal text-xs bg-surface-2 border border-hairline px-2 py-0.5" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>{t('checkout_negotiate_later')}</span>
                  </div>
                </div>

                <div className="border-t-2 border-primary/20 pt-3 flex justify-between items-center text-sm">
                  <span className="font-normal text-ink">{t('checkout_ref_total')}</span>
                  <span className="text-xl font-normal text-primary" style={{ letterSpacing: '0.16px' }}>{formatCurrency(calculateTotal())}₫</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-white font-normal hover:bg-primary-hover disabled:opacity-50 transition-colors uppercase text-sm flex items-center justify-center gap-2"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> {t('checkout_submitting')}</>
                ) : (
                  <>{t('checkout_submit_bulk_rfq')} <ArrowRight size={16} /></>
                )}
              </button>
              
              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>
                <span className="flex items-center gap-1"><ShieldCheck size={12} /> {t('checkout_privacy_info')}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {t('checkout_direct_connect')}</span>
              </div>

              <div className="mt-3 flex items-start gap-2 text-xs text-ink-muted p-3 bg-surface-1 border-l-2 border-primary" style={{ borderRadius: 0 }}>
                <AlertCircle size={14} className="text-primary shrink-0 mt-0.5" />
                <p style={{ letterSpacing: '0.16px' }}>{t('checkout_platform_disclaimer')}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
