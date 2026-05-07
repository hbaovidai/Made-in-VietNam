import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export function Checkout() {
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.minPrice || item.product?.price || 0;
      const qty = parseInt(item.quantity) || 1;
      return total + (price * qty);
    }, 0);
  };

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
    return <div className="p-12 text-center text-slate-500">Đang tải trang thanh toán...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Thanh toán & Đặt hàng</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary" /> Thông tin Giao hàng
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Họ tên người nhận <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                    placeholder="0912345678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ghi chú đơn hàng (Tùy chọn)</label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"
                    placeholder="Lưu ý giao hàng cho shipper..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary" /> Phương thức Thanh toán
              </h2>
              
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={formData.paymentMethod === 'COD'}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className={`font-bold ${formData.paymentMethod === 'COD' ? 'text-primary-dark' : 'text-slate-900'}`}>Thanh toán khi nhận hàng (COD)</div>
                    <div className={`text-xs mt-0.5 ${formData.paymentMethod === 'COD' ? 'text-primary' : 'text-slate-500'}`}>Nhận hàng rồi thanh toán tiền mặt</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'BANK_TRANSFER' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="BANK_TRANSFER" 
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className={`font-bold ${formData.paymentMethod === 'BANK_TRANSFER' ? 'text-primary-dark' : 'text-slate-900'}`}>Chuyển khoản Ngân hàng</div>
                    <div className={`text-xs mt-0.5 ${formData.paymentMethod === 'BANK_TRANSFER' ? 'text-primary' : 'text-slate-500'}`}>Mã QR sẽ hiển thị sau khi đặt hàng</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-widest">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{item.product.name}</div>
                      <div className="text-xs text-slate-500 mb-1">SL: {item.quantity} {item.product.unit || 'cái'}</div>
                      <div className="text-sm font-black text-emerald-600">{((item.product?.minPrice || item.product?.price || 0) * (parseInt(item.quantity) || 1)).toLocaleString()} VND</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                  <span className="font-bold">{calculateTotal().toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 font-bold">Thỏa thuận</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="font-bold text-slate-900">Tổng thanh toán</span>
                  <span className="text-xl font-black text-emerald-600">{calculateTotal().toLocaleString()} VND</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors uppercase tracking-widest text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {submitting ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'} <ArrowRight size={16} />
              </button>
              
              <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p>Vì đây là nền tảng B2B, cước vận chuyển sẽ được nhà cung cấp liên hệ thông báo sau khi xác nhận đơn.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
