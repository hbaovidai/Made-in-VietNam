import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data?.items || []);
    } catch (e) {
      console.error(e);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải giỏ hàng' });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, currentQty: number, change: number) => {
    const newQty = Math.max(1, currentQty + change);
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity: newQty });
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật số lượng' });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa sản phẩm khỏi giỏ' });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa sản phẩm' });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.minPrice || item.product?.price || 0;
      const qty = parseInt(item.quantity) || 1;
      return total + (price * qty);
    }, 0);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <ShoppingCart size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Vui lòng đăng nhập</h2>
        <p className="text-slate-500 mb-6">Bạn cần đăng nhập để xem giỏ hàng</p>
        <Link to="/login" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải giỏ hàng...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Giỏ hàng của bạn</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <ShoppingCart size={64} className="mx-auto text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Giỏ hàng trống</h2>
          <p className="text-slate-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
            Khám phá sản phẩm <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Giỏ hàng của bạn</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative group">
                {/* Delete Button */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>

                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                  <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <Link to={`/products/${item.product.id}`} className="text-lg font-bold text-slate-900 hover:text-primary transition-colors pr-8">
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-slate-500 mt-1">
                    Cung cấp bởi: <span className="font-semibold text-slate-700">{item.product.supplier?.companyName}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Price */}
                    <div className="text-lg font-black text-emerald-600">
                      {((item.product?.minPrice || item.product?.price || 0)).toLocaleString()} {item.product?.currency || 'VND'}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="w-12 text-center font-bold text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity, 1)}
                        className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-widest">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Tổng sản phẩm</span>
                  <span className="font-bold">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-bold">{calculateTotal().toLocaleString()} VND</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between">
                  <span className="font-bold text-slate-900">Tổng cộng</span>
                  <span className="text-xl font-black text-emerald-600">{calculateTotal().toLocaleString()} VND</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors uppercase tracking-widest text-sm shadow-sm flex items-center justify-center gap-2"
              >
                Tiến hành Thanh toán <ArrowRight size={16} />
              </Link>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShoppingCart size={12} />
                <span>Thanh toán an toàn 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
