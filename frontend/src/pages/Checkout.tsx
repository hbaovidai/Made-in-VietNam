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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-slate-500 font-medium">Đang tải trang thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Gửi yêu cầu Báo giá hàng loạt</h1>
          <p className="text-sm text-slate-500 mt-1">Kiểm tra thông tin liên hệ và danh sách sản phẩm cần gửi báo giá</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Contact + B2B Info (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck size={16} className="text-primary" />
                </div>
                Thông tin Liên hệ & Địa chỉ nhận hàng
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Họ tên người liên hệ <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={formData.recipientPhone}
                      onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                      placeholder="0912345678"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ nhận hàng dự kiến <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium resize-none"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ghi chú / Yêu cầu đặc biệt (Tùy chọn)</label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium resize-none"
                    placeholder="Ví dụ: Yêu cầu chứng chỉ CO/CQ, đóng gói xuất khẩu, yêu cầu thời gian giao hàng gấp..."
                  />
                </div>
              </div>
            </div>

            {/* B2B Process Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-primary" />
                </div>
                Quy trình giao dịch B2B
              </h2>
              
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  Yêu cầu hỏi giá sỉ của bạn sẽ được chuyển tiếp trực tiếp đến các nhà cung cấp tương ứng để phản hồi báo giá.
                </p>
                <div className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-250 text-xs">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">Xác nhận yêu cầu</h4>
                    <p>Nhà cung cấp sẽ kiểm tra số lượng tồn kho, thời gian sản xuất và liên hệ lại với bạn.</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-250 text-xs">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">Thỏa thuận thương mại</h4>
                    <p>Hai bên tự do đàm phán phương thức thanh toán doanh nghiệp (L/C, T/T, bảo lãnh...) và phương thức vận chuyển phù hợp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart size={16} className="text-primary" />
                </div>
                Sản phẩm gửi hỏi giá
              </h2>

              {/* Product list with unit price × qty */}
              <div className="space-y-0 mb-5 max-h-[360px] overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className={`flex gap-3 py-4 ${idx > 0 ? 'border-t border-slate-100' : ''}`}>
                    <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate leading-tight">{item.product.name}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <span>{formatCurrency(getPrice(item))}₫</span>
                        <span className="text-slate-300">×</span>
                        <span>{getQty(item)} {item.product.unit || 'cái'}</span>
                      </div>
                      <div className="text-sm font-bold text-primary mt-1">{formatCurrency(getLineTotal(item))}₫</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice breakdown */}
              <div className="border-t border-slate-200 pt-4 space-y-3 mb-5">
                {/* Per-item breakdown table */}
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase tracking-wider">
                      <th className="text-left pb-2">Sản phẩm</th>
                      <th className="text-center pb-2">Giá sỉ tham khảo</th>
                      <th className="text-center pb-2">SL</th>
                      <th className="text-right pb-2">Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="text-slate-600 border-t border-dashed border-slate-100">
                        <td className="py-2 pr-2 max-w-[120px] truncate font-medium">{item.product.name}</td>
                        <td className="py-2 text-center whitespace-nowrap">{formatCurrency(getPrice(item))}₫</td>
                        <td className="py-2 text-center">{getQty(item)}</td>
                        <td className="py-2 text-right font-bold text-slate-800 whitespace-nowrap">{formatCurrency(getLineTotal(item))}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-slate-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tạm tính ({cartItems.length} mặt hàng)</span>
                    <span className="font-bold text-slate-700">{formatCurrency(calculateTotal())}₫</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Vận chuyển & Thuế</span>
                    <span className="text-primary font-bold text-xs bg-primary/5 px-2 py-0.5 rounded-full">Thương lượng sau</span>
                  </div>
                </div>

                <div className="border-t-2 border-primary/20 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Tổng giá trị tham khảo</span>
                  <span className="text-xl font-black text-primary">{formatCurrency(calculateTotal())}₫</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all uppercase tracking-widest text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Đang gửi yêu cầu...</>
                ) : (
                  <>GỬI YÊU CẦU BÁO GIÁ HÀNG LOẠT <ArrowRight size={16} /></>
                )}
              </button>
              
              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Thông tin bảo mật</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Kết nối trực tiếp</span>
              </div>

              <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <AlertCircle size={14} className="text-primary shrink-0 mt-0.5" />
                <p>Nền tảng Made in Vietnam đóng vai trò trung gian kết nối B2B, không thu phí giao dịch hay xử lý thanh toán trực tuyến.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
