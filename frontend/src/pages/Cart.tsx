import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export function Cart() {
  const { t } = useTranslation();
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-canvas">
        <ShoppingCart size={48} className="text-ink-subtle mb-4" />
        <h2 className="text-2xl font-light text-ink mb-2" style={{ letterSpacing: '0.16px' }}>{t('cart_login_required')}</h2>
        <p className="text-ink-muted mb-6" style={{ letterSpacing: '0.16px' }}>{t('cart_login_desc')}</p>
        <Link to="/login" className="px-6 py-3 bg-primary text-white font-normal hover:bg-primary-hover transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('cart_loading')}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <h1 className="text-2xl font-light text-ink mb-8 uppercase" style={{ letterSpacing: '0.16px' }}>Inquiry Basket</h1>
        <div className="bg-canvas border border-hairline p-12 text-center" style={{ borderRadius: 0 }}>
          <ShoppingCart size={64} className="mx-auto text-ink-subtle mb-4" />
          <h2 className="text-xl font-normal text-ink mb-2" style={{ letterSpacing: '0.16px' }}>{t('cart_empty_title')}</h2>
          <p className="text-ink-subtle mb-6" style={{ letterSpacing: '0.16px' }}>{t('cart_empty_desc')}</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-normal hover:bg-primary-hover transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
            Khám phá sản phẩm <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas min-h-screen pb-12">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-light text-ink mb-6 uppercase" style={{ letterSpacing: '0.16px' }}>{t('cart_page_title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-surface-1 border border-hairline p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative group" style={{ borderRadius: 0 }}>
                {/* Delete Button */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-ink-subtle hover:text-red-500 transition-colors p-2 hover:bg-surface-2"
                  style={{ borderRadius: 0 }}
                >
                  <Trash2 size={18} />
                </button>

                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-surface-2 border border-hairline overflow-hidden" style={{ borderRadius: 0 }}>
                  <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <Link to={`/products/${item.product.id}`} className="text-lg font-normal text-ink hover:text-primary transition-colors pr-8" style={{ letterSpacing: '0.16px' }}>
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-ink-subtle mt-1" style={{ letterSpacing: '0.16px' }}>
                    Nhà cung cấp: <span className="font-normal text-ink">{item.product.supplier?.companyName}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Price */}
                    <div className="text-lg font-normal text-primary" style={{ letterSpacing: '0.16px' }}>
                      {((item.product?.minPrice || item.product?.price || 0)).toLocaleString()} {item.product?.currency || 'VND'}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-hairline bg-canvas w-fit" style={{ borderRadius: 0 }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        className="p-2 bg-surface-1 text-ink hover:bg-surface-2 disabled:opacity-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="w-12 text-center font-normal text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity, 1)}
                        className="p-2 bg-surface-1 text-ink hover:bg-surface-2 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inquiry Summary */}
          <div className="lg:col-span-1">
            <div className="bg-canvas border border-hairline p-6 sticky top-24" style={{ borderRadius: 0 }}>
              <h2 className="text-lg font-normal text-ink mb-6 uppercase" style={{ letterSpacing: '0.16px' }}>{t('cart_inquiry_summary')}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-ink-subtle text-sm" style={{ letterSpacing: '0.16px' }}>
                  <span>{t('cart_total_products')}</span>
                  <span className="font-normal text-ink">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-ink-subtle text-sm" style={{ letterSpacing: '0.16px' }}>
                  <span>{t('cart_total_quantity')}</span>
                  <span className="font-normal text-ink">
                    {cartItems.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 1), 0)}
                  </span>
                </div>
                <div className="flex justify-between text-ink-subtle text-sm" style={{ letterSpacing: '0.16px' }}>
                  <span>{t('cart_subtotal_ref')}</span>
                  <span className="font-normal text-ink">{calculateTotal().toLocaleString()} VND</span>
                </div>
                <div className="border-t border-hairline pt-4 flex justify-between text-sm">
                  <span className="font-normal text-ink">{t('cart_estimated_total')}</span>
                  <span className="text-xl font-normal text-primary" style={{ letterSpacing: '0.16px' }}>{calculateTotal().toLocaleString()} VND</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full py-4 bg-primary text-white font-normal hover:bg-primary-hover transition-colors uppercase text-sm flex items-center justify-center gap-2"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                {t('checkout_bulk_rfq_title')} <ArrowRight size={16} />
              </Link>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                <ShoppingCart size={12} />
                <span>{t('cart_b2b_safe_trading')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
