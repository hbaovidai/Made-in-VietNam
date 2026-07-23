import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, FileText, ArrowUpRight, Shield, Package, Inbox, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function BuyerOverview() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rfqCount, setRfqCount] = useState(0);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    Promise.all([
      api.get(`/rfqs/buyer/${user.id}`).catch(() => ({ data: [] })),
      api.get(`/messages/conversations/${user.id}`).catch(() => ({ data: [] })),
    ]).then(([rfqRes, msgRes]) => {
      const rfqList = Array.isArray(rfqRes.data) ? rfqRes.data : [];
      setRfqs(rfqList.slice(0, 5));
      setRfqCount(rfqList.length);
      const msgList = Array.isArray(msgRes.data) ? msgRes.data : [];
      setMessages(msgList.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [user]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t('admin_minutes_ago', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('admin_hours_ago', { count: hours });
    const days = Math.floor(hours / 24);
    return t('admin_days_ago', { count: days });
  };

  const nonMonetaryKpis = [
    { 
      label: 'Tổng NCC đã tương tác', 
      value: messages.length > 0 ? Math.max(1, messages.length) : 0, 
      icon: <Users size={20} className="text-blue-600" />, 
      bg: 'bg-blue-50 border border-blue-100', 
      desc: 'Nhà cung cấp đã nhắn tin / trao đổi'
    },
    { 
      label: 'Yêu cầu RFQ đang mở', 
      value: rfqCount, 
      icon: <FileText size={20} className="text-emerald-600" />, 
      bg: 'bg-emerald-50 border border-emerald-100', 
      desc: 'Đang sẵn sàng nhận báo giá'
    },
    { 
      label: 'Số báo giá đã nhận', 
      value: rfqs.reduce((acc: number, r: any) => acc + (r._count?.quotes || 0), 0), 
      icon: <ShoppingCart size={20} className="text-purple-600" />, 
      bg: 'bg-purple-50 border border-purple-100', 
      desc: 'Báo giá chi tiết từ các Nhà cung cấp'
    },
    { 
      label: 'Tỷ lệ khớp nguồn hàng', 
      value: rfqCount > 0 ? '100%' : '0%', 
      icon: <Package size={20} className="text-orange-600" />, 
      bg: 'bg-orange-50 border border-orange-100', 
      desc: 'Tỷ lệ RFQ tìm thấy NCC phù hợp'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600" style={{ letterSpacing: '0.16px' }}>{t('buyer_hello', { name: user?.fullName || '' })}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard/buyer/analytics" className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg px-4 py-2.5 transition-colors shadow-2xs inline-flex items-center gap-1.5">
            <BarChart3 size={14} /> Xem Phân Tích Mua Hàng Analytics <ArrowUpRight size={14} />
          </Link>
          <Link to="/rfq" className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 shadow-sm" style={{ letterSpacing: '0.16px' }}>
            <FileText size={14} /> {t('buyer_post_rfq_btn')}
          </Link>
        </div>
      </div>

      {/* Non-monetary Procurement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nonMonetaryKpis.map((kpi, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-200/90 p-5 transition-all group rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${kpi.bg} shadow-2xs group-hover:scale-105 transition-transform`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1" style={{ letterSpacing: '0.05em' }}>
                {kpi.label}
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {kpi.value}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
              {kpi.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent RFQs */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent mx-auto rounded-full" />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">{t('buyer_no_activity')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('buyer_no_activity_desc')}</p>
              <Link to="/products" className="text-xs font-semibold text-blue-600 mt-3 inline-block hover:underline">{t('buyer_explore_products')}</Link>
            </div>
          ) : (
            <div>
              {rfqs.map((rfq: any, i: number) => (
                <div 
                  key={rfq.id} 
                  className={`px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${i < rfqs.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{rfq.productName || t('buyer_rfq_label')}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{t('buyer_qty_label')} {rfq.quantity} {rfq.quantityUnit}</span>
                        {rfq._count?.quotes > 0 && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">{t('buyer_quotes_count', { count: rfq._count.quotes })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 border rounded-full ${
                      rfq.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      rfq.status === 'CLOSED' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {rfq.status === 'OPEN' ? t('buyer_status_open') : rfq.status === 'CLOSED' ? t('buyer_status_closed') : rfq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Recent Messages */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('buyer_messages')}</h2>
              <Link to="/dashboard/buyer/messages" className="text-xs font-semibold text-blue-600 hover:text-blue-700">{t('buyer_all')}</Link>
            </div>
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{t('buyer_no_messages')}</p>
              </div>
            ) : (
              <div>
                {messages.slice(0, 3).map((msg: any, i: number) => (
                  <Link 
                    key={msg.id} 
                    to="/dashboard/buyer/messages"
                    className={`px-5 py-3 flex items-center gap-3 hover:bg-surface-1 transition-colors ${i < Math.min(messages.length, 3) - 1 ? 'border-b border-hairline' : ''}`}
                  >
                    <div className="w-8 h-8 bg-surface-2 border border-hairline rounded-lg flex items-center justify-center text-[10px] font-medium text-ink shrink-0">
                      {(msg.otherUser?.fullName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-ink truncate" style={{ letterSpacing: '0.16px' }}>{msg.otherUser?.fullName || t('buyer_supplier_label')}</div>
                      <div className="text-[10px] text-ink-muted truncate" style={{ letterSpacing: '0.16px' }}>{msg.lastMessage || t('buyer_new_message')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-canvas border border-hairline p-6 relative overflow-hidden rounded-xl shadow-sm">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-ink uppercase mb-4" style={{ letterSpacing: '0.32px' }}>{t('buyer_sourcing_tools')}</h3>
              <div className="space-y-3">
                {[
                  { label: t('buyer_post_rfq_link'), to: '/rfq' },
                  { label: t('buyer_browse_products'), to: '/products' },
                  { label: t('buyer_help_center'), to: '/help' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="flex items-center justify-between group">
                    <span className="text-xs font-normal text-ink-muted group-hover:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>{link.label}</span>
                    <ArrowUpRight size={12} className="text-hairline group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Assurance */}
          <div className="bg-canvas border border-hairline p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-1 border border-hairline flex items-center justify-center rounded-lg">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('buyer_trade_assurance')}</h3>
                <p className="text-[10px] text-ink-subtle mt-0.5" style={{ letterSpacing: '0.16px' }}>{t('buyer_trade_desc')}</p>
              </div>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed mb-4" style={{ letterSpacing: '0.16px' }}>
              {t('buyer_trade_body')}
            </p>
            <Link to="/services/trade-assurance" className="text-xs font-normal text-primary hover:text-primary-hover" style={{ letterSpacing: '0.16px' }}>
              {t('buyer_learn_more')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
