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
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROCESSING': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SHIPPING': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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

  if (loading) return <div className="p-8 text-center text-slate-500">{t('dang_tai_du_lieu')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-blue-600" />
            ĐƠN HÀNG LẺ CỦA KHÁCH
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t('quan_ly_va_xu_ly_cac_don_dat_hang_truc_t')}</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm mã đơn hàng..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Package size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">{t('chua_co_don_hang_nao')}</h3>
          <p className="text-slate-500">{t('khi_co_khach_hang_dat_mua_truc_tiep_don_')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Mã đơn hàng</div>
                    <div className="font-bold text-slate-900">#{order.id.split('-')[0].toUpperCase()}</div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">{t('nguoi_dat')}</div>
                    <div className="font-bold text-slate-900">{order.buyer?.fullName || 'Khách hàng'}</div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">{t('ngay_dat')}</div>
                    <div className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row border-b border-slate-100">
                {/* Left: Items */}
                <div className="flex-1 px-6 py-4 space-y-4 border-r border-slate-100">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="text-sm font-bold text-slate-900 truncate">{item.product.name}</div>
                        <div className="text-xs text-slate-500 mt-1">SL: x{item.quantity} {item.product.unit || 'cái'}</div>
                        <div className="font-bold text-emerald-600 text-sm mt-1">{((item.price || item.product?.minPrice || 0) * (parseInt(item.quantity) || 1)).toLocaleString()} đ</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Info & Actions */}
                <div className="w-full lg:w-80 px-6 py-4 bg-slate-50/30 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('thong_tin_giao_hang')}</div>
                    <div className="text-sm font-bold text-slate-900">{order.recipientName}</div>
                    <div className="text-sm text-slate-600">{order.recipientPhone}</div>
                    <div className="text-sm text-slate-600 mt-1 line-clamp-2" title={order.shippingAddress}>{order.shippingAddress}</div>
                    
                    {order.note && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800">
                        <span className="font-bold">{t('ghi_chu')}</span> {order.note}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CONFIRMED')}
                        className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm flex justify-center items-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Xác nhận đơn
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'PROCESSING')}
                        className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors text-sm flex justify-center items-center gap-2"
                      >
                        <Package size={16} /> Đóng gói xong
                      </button>
                    )}
                    {order.status === 'PROCESSING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'SHIPPING')}
                        className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm flex justify-center items-center gap-2"
                      >
                        <Truck size={16} /> Giao cho đơn vị VC
                      </button>
                    )}
                    {order.status === 'SHIPPING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors text-sm flex justify-center items-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Xác nhận đã giao
                      </button>
                    )}
                    
                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button 
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="w-full py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors text-sm"
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
