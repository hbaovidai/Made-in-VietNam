import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Package, MapPin, Search, ChevronRight, XCircle } from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

export function BuyerOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/buyer');
      setOrders(res.data || []);
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách đơn hàng' });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      await api.patch(`/orders/${id}/cancel`);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã hủy đơn hàng' });
      loadOrders();
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể hủy đơn hàng' });
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
      case 'PROCESSING': return 'Đang xử lý';
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
            <ShoppingBag className="text-emerald-600" />
            ĐƠN MUA CỦA TÔI
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t('quan_ly_va_theo_doi_cac_don_hang_ban_da_')}</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm mã đơn hàng..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Package size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">{t('chua_co_don_hang_nao')}</h3>
          <p className="text-slate-500">{t('ban_chua_thuc_hien_bat_ky_don_mua_hang_n')}</p>
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
                    <div className="text-xs text-slate-500 font-medium">{t('ngay_dat')}</div>
                    <div className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-4 space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.product.images[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="text-sm font-bold text-slate-900 truncate">{item.product.name}</div>
                      <div className="text-xs text-slate-500 mt-1">Cung cấp bởi: {item.product.supplier?.companyName}</div>
                      <div className="text-xs text-slate-500 mt-1">SL: x{item.quantity} {item.product.unit || 'cái'}</div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <div className="font-black text-emerald-600">{((item.price || item.product?.minPrice || 0) * (parseInt(item.quantity) || 1)).toLocaleString()} đ</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="truncate max-w-[200px] sm:max-w-md">{order.shippingAddress}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Tổng tiền</div>
                    <div className="text-lg font-black text-emerald-600">{order.totalAmount.toLocaleString()} đ</div>
                  </div>
                  
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => cancelOrder(order.id)}
                      className="px-4 py-2 border-2 border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-sm flex items-center gap-2"
                    >
                      <XCircle size={16} /> Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
