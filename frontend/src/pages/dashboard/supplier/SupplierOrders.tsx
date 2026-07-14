import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Package, MapPin, Search, Truck, CheckCircle2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';

export function SupplierOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/supplier');
      setOrders(res.data || []);
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách đơn hàng' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật trạng thái đơn hàng' });
      loadOrders();
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật trạng thái' });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-surface-1 text-amber-700 border-hairline';
      case 'CONFIRMED': return 'bg-surface-1 text-blue-700 border-hairline';
      case 'PROCESSING': return 'bg-surface-1 text-purple-700 border-hairline';
      case 'SHIPPING': return 'bg-surface-1 text-indigo-700 border-hairline';
      case 'DELIVERED': return 'bg-surface-1 text-emerald-700 border-hairline';
      case 'CANCELLED': return 'bg-surface-1 text-red-700 border-hairline';
      default: return 'bg-surface-2 text-ink-muted border-hairline';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PROCESSING': return 'Đang đóng gói';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) return <div className="p-8 text-center text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('dang_tai_du_lieu')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-xl font-normal text-ink uppercase tracking-wider flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
            <ShoppingBag className="text-primary" />
            ĐƠN HÀNG LẺ CỦA KHÁCH
          </h1>
          <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('quan_ly_va_xu_ly_cac_don_dat_hang_truc_t')}</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" size={18} />
          <input 
            type="text" 
            placeholder="Tìm mã đơn hàng..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle"
            style={{ borderRadius: 0, letterSpacing: '0.16px' }}
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-canvas border border-hairline p-12 text-center" style={{ borderRadius: 0 }}>
          <Package size={48} className="mx-auto text-ink-subtle mb-4" />
          <h3 className="text-lg font-normal text-ink mb-2" style={{ letterSpacing: '0.16px' }}>{t('chua_co_don_hang_nao')}</h3>
          <p className="text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('khi_co_khach_hang_dat_mua_truc_tiep_don_')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-canvas border border-hairline overflow-hidden" style={{ borderRadius: 0 }}>
              {/* Header */}
              <div className="bg-surface-1 px-6 py-4 border-b border-hairline flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>Mã đơn hàng</div>
                    <div className="font-normal text-ink">#{order.id.split('-')[0].toUpperCase()}</div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-hairline"></div>
                  <div>
                    <div className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>{t('nguoi_dat')}</div>
                    <div className="font-normal text-ink">{order.buyer?.fullName || 'Khách hàng'}</div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-hairline"></div>
                  <div>
                    <div className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>{t('ngay_dat')}</div>
                    <div className="font-normal text-ink">{new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 text-xs font-normal border ${getStatusColor(order.status)}`} style={{ borderRadius: 0, letterSpacing: '0.32px' }}>
                  {getStatusText(order.status)}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row border-b border-hairline">
                {/* Left: Items */}
                <div className="flex-1 px-6 py-4 space-y-4 border-r border-hairline bg-canvas">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-surface-1 border border-hairline overflow-hidden shrink-0" style={{ borderRadius: 0 }}>
                        <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="text-sm font-normal text-ink truncate" style={{ letterSpacing: '0.16px' }}>{item.product.name}</div>
                        <div className="text-xs text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>SL: x{item.quantity} {item.product.unit || 'cái'}</div>
                        <div className="font-light text-primary text-sm mt-1">{((item.price || item.product?.minPrice || 0) * (parseInt(item.quantity) || 1)).toLocaleString()} đ</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Info & Actions */}
                <div className="w-full lg:w-80 px-6 py-4 bg-surface-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-normal text-ink-subtle uppercase tracking-widest mb-2" style={{ letterSpacing: '0.32px' }}>{t('thong_tin_giao_hang')}</div>
                    <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{order.recipientName}</div>
                    <div className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>{order.recipientPhone}</div>
                    <div className="text-sm text-ink-muted mt-1 line-clamp-2" title={order.shippingAddress} style={{ letterSpacing: '0.16px' }}>{order.shippingAddress}</div>
                    
                    {order.note && (
                      <div className="mt-3 p-2 bg-surface-2 border border-hairline text-xs text-ink-muted" style={{ borderRadius: 0 }}>
                        <span className="font-normal text-ink">{t('ghi_chu')}</span> {order.note}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CONFIRMED')}
                        className="w-full py-2 bg-primary text-white font-normal hover:bg-primary-hover transition-colors text-sm flex justify-center items-center gap-2"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      >
                        <CheckCircle2 size={16} /> Xác nhận đơn
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'PROCESSING')}
                        className="w-full py-2 bg-primary text-white font-normal hover:bg-primary-hover transition-colors text-sm flex justify-center items-center gap-2"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      >
                        <Package size={16} /> Đóng gói xong
                      </button>
                    )}
                    {order.status === 'PROCESSING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'SHIPPING')}
                        className="w-full py-2 bg-primary text-white font-normal hover:bg-primary-hover transition-colors text-sm flex justify-center items-center gap-2"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      >
                        <Truck size={16} /> Giao cho đơn vị VC
                      </button>
                    )}
                    {order.status === 'SHIPPING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        className="w-full py-2 bg-primary text-white font-normal hover:bg-primary-hover transition-colors text-sm flex justify-center items-center gap-2"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      >
                        <CheckCircle2 size={16} /> Xác nhận đã giao
                      </button>
                    )}
                    
                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="w-full py-2 bg-canvas border border-red-600 text-red-600 font-normal hover:bg-red-50 transition-colors text-sm"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
