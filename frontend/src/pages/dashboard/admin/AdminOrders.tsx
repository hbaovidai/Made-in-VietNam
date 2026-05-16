import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Search, Package, Truck, CheckCircle2, XCircle, Clock, Eye, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

export function AdminOrders() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState<any>(null);

  const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
    PENDING: { label: t('admin_orders_pending'), variant: 'warning' },
    CONFIRMED: { label: t('admin_orders_confirmed'), variant: 'info' },
    PROCESSING: { label: t('admin_orders_processing'), variant: 'info' },
    SHIPPING: { label: t('admin_orders_shipping'), variant: 'default' },
    DELIVERED: { label: t('admin_orders_delivered'), variant: 'success' },
    CANCELLED: { label: t('admin_orders_cancelled'), variant: 'danger' },
    RETURNED: { label: t('admin_orders_returned'), variant: 'danger' },
  };

  const PAYMENT_MAP: Record<string, string> = {
    UNPAID: t('admin_orders_unpaid'),
    PAID: t('admin_orders_paid'),
    REFUNDED: t('admin_orders_refunded'),
  };

  useEffect(() => { loadOrders(); }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/admin/all?limit=100&status=${statusFilter}`);
      setOrders(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_orders_error_load') });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      addToast({ type: 'success', title: t('admin_success'), message: t('admin_orders_status_updated', { status: STATUS_MAP[newStatus]?.label }) });
      loadOrders();
      if (viewOrder?.id === orderId) {
        setViewOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_orders_error_update') });
    }
  };

  const filtered = orders.filter(o => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.orderNumber?.toLowerCase().includes(s) ||
      o.buyer?.fullName?.toLowerCase().includes(s) ||
      o.supplier?.companyName?.toLowerCase().includes(s);
  });

  const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusTabs = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
  const tabLabels: Record<string, string> = { ALL: t('admin_orders_all'), ...Object.fromEntries(Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label])) };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('admin_orders_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('admin_orders_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
              statusFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t('admin_orders_search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pl-1">{t('admin_orders_code')}</th>
                <th className="pb-3">{t('admin_orders_customer')}</th>
                <th className="pb-3">{t('admin_orders_business')}</th>
                <th className="pb-3 text-right">{t('admin_orders_total')}</th>
                <th className="pb-3">{t('admin_orders_payment')}</th>
                <th className="pb-3">{t('admin_orders_status')}</th>
                <th className="pb-3 pr-1 text-right">{t('admin_orders_actions')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pl-1">
                    <div className="font-bold text-slate-900 text-xs">{o.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(o.createdAt)}</div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-slate-800 text-xs">{o.buyer?.fullName}</div>
                    <div className="text-[10px] text-slate-400">{o.buyer?.email}</div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-medium text-slate-600">{o.supplier?.companyName}</span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="font-bold text-slate-900 text-xs">{formatCurrency(o.totalAmount)}</span>
                  </td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      o.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {PAYMENT_MAP[o.paymentStatus] || o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4">
                    <Badge variant={STATUS_MAP[o.status]?.variant || 'default'}>
                      {STATUS_MAP[o.status]?.label || o.status}
                    </Badge>
                  </td>
                  <td className="py-4 pr-1 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => setViewOrder(o)}
                        className="text-xs font-bold text-slate-600 hover:text-primary transition-colors inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg"
                      >
                        <Eye size={13} /> {t('admin_orders_detail')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-slate-400 text-sm">{t('admin_orders_none')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={t('admin_orders_detail_title', { code: viewOrder?.orderNumber })}>
        {viewOrder && (
          <div className="space-y-5">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase">{t('admin_orders_customer')}</span>
                <div className="font-semibold text-slate-800 mt-1">{viewOrder.buyer?.fullName}</div>
                <div className="text-xs text-slate-500">{viewOrder.buyer?.email}</div>
                <div className="text-xs text-slate-500">{viewOrder.buyer?.phone}</div>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase">{t('admin_orders_business')}</span>
                <div className="font-semibold text-slate-800 mt-1">{viewOrder.supplier?.companyName}</div>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase">{t('admin_orders_recipient')}</span>
                <div className="font-semibold text-slate-800 mt-1">{viewOrder.recipientName}</div>
                <div className="text-xs text-slate-500">{viewOrder.recipientPhone}</div>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase">{t('admin_orders_address')}</span>
                <div className="text-xs text-slate-700 mt-1">{viewOrder.shippingAddress}</div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">{t('admin_orders_products', { count: viewOrder.items?.length })}</h4>
              <div className="space-y-2">
                {viewOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <img src={item.productImage || item.product?.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{item.productName}</div>
                      <div className="text-xs text-slate-400">{t('admin_orders_qty')}: {item.quantity} × {formatCurrency(item.unitPrice)}</div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{formatCurrency(item.totalPrice)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">{t('admin_orders_subtotal')}</span><span>{formatCurrency(viewOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t('admin_orders_shipping_fee')}</span><span>{formatCurrency(viewOrder.shippingFee)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2 mt-2"><span>{t('admin_orders_grand_total')}</span><span className="text-primary">{formatCurrency(viewOrder.totalAmount)}</span></div>
            </div>

            {/* Status Actions */}
            {viewOrder.status !== 'DELIVERED' && viewOrder.status !== 'CANCELLED' && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">{t('admin_orders_update_status')}</h4>
                <div className="flex flex-wrap gap-2">
                  {['CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(viewOrder.id, s)}
                      disabled={s === viewOrder.status}
                      className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
                        s === viewOrder.status
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : s === 'CANCELLED'
                            ? 'text-red-500 border-red-200 hover:bg-red-50'
                            : 'text-primary border-primary/30 hover:bg-primary/5'
                      }`}
                    >
                      {STATUS_MAP[s]?.label || s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
