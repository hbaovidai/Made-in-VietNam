import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, FileText, ArrowUpRight, Shield, Package, Inbox } from 'lucide-react';
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

  const kpis = [
    { label: t('buyer_kpi_rfqs'), value: rfqCount, icon: <FileText size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/buyer/rfqs' },
    { label: t('buyer_kpi_messages'), value: messages.length, icon: <MessageSquare size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/buyer/messages' },
    { label: t('buyer_kpi_inquiry_basket'), value: 0, icon: <ShoppingCart size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/buyer/saved' },
    { label: t('buyer_kpi_saved'), value: 0, icon: <Package size={18} className="text-primary" />, bg: 'bg-surface-1', link: '/dashboard/buyer/saved' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('buyer_hello', { name: user?.fullName || '' })}</p>
        <Link to="/rfq" className="text-xs font-normal text-white bg-primary px-4 py-2.5 hover:bg-primary-hover transition-colors shrink-0 inline-flex items-center gap-2" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
          <FileText size={14} /> {t('buyer_post_rfq_btn')}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Link key={i} to={kpi.link} className="bg-card-bg shadow-subtle p-5 transition-all group rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 border border-hairline flex items-center justify-center ${kpi.bg}`} style={{ borderRadius: '4px' }}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={14} className="text-hairline group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-bold text-primary" style={{ letterSpacing: 0 }}>{kpi.value}</div>
            <div className="text-[10px] font-normal text-ink-subtle mt-1 uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{kpi.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent RFQs */}
        <div className="lg:col-span-2 bg-card-bg shadow-subtle rounded-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border border-primary border-t-transparent mx-auto" style={{ borderRadius: '50%' }} />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={32} className="text-ink-subtle mx-auto mb-2" />
              <p className="text-sm font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('buyer_no_activity')}</p>
              <p className="text-xs text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('buyer_no_activity_desc')}</p>
              <Link to="/products" className="text-xs font-normal text-primary mt-3 inline-block hover:text-primary-hover" style={{ letterSpacing: '0.16px' }}>{t('buyer_explore_products')}</Link>
            </div>
          ) : (
            <div>
              {rfqs.map((rfq: any, i: number) => (
                <div 
                  key={rfq.id} 
                  className={`px-6 py-4 flex items-center justify-between hover:bg-surface-1 transition-colors ${i < rfqs.length - 1 ? 'border-b border-hairline' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 bg-surface-1 border border-hairline flex items-center justify-center shrink-0" style={{ borderRadius: '4px' }}>
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-normal text-ink truncate" style={{ letterSpacing: '0.16px' }}>{rfq.productName || t('buyer_rfq_label')}</div>
                      <div className="flex items-center gap-2 mt-0.5" style={{ letterSpacing: '0.16px' }}>
                        <span className="text-xs text-ink-subtle">{t('buyer_qty_label')} {rfq.quantity} {rfq.quantityUnit}</span>
                        {rfq._count?.quotes > 0 && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-surface-1 border border-hairline px-1.5 py-0.5" style={{ borderRadius: '4px' }}>{t('buyer_quotes_count', { count: rfq._count.quotes })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 border border-hairline ${
                      rfq.status === 'OPEN' ? 'bg-surface-1 text-primary' : 
                      rfq.status === 'CLOSED' ? 'bg-surface-1 text-ink-muted' : 
                      'bg-surface-1 text-emerald-600'
                    }`} style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
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
          <div className="bg-card-bg shadow-subtle rounded-lg">
            <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('buyer_messages')}</h2>
              <Link to="/dashboard/buyer/messages" className="text-xs font-normal text-primary hover:text-primary-hover" style={{ letterSpacing: '0.16px' }}>{t('buyer_all')}</Link>
            </div>
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={24} className="text-ink-subtle mx-auto mb-2" />
                <p className="text-xs text-ink-muted" style={{ letterSpacing: '0.16px' }}>{t('buyer_no_messages')}</p>
              </div>
            ) : (
              <div>
                {messages.slice(0, 3).map((msg: any, i: number) => (
                  <Link 
                    key={msg.id} 
                    to="/dashboard/buyer/messages"
                    className={`px-5 py-3 flex items-center gap-3 hover:bg-surface-1 transition-colors ${i < Math.min(messages.length, 3) - 1 ? 'border-b border-hairline' : ''}`}
                  >
                    <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center text-[10px] font-normal text-ink shrink-0" style={{ borderRadius: '4px' }}>
                      {(msg.otherUser?.fullName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-normal text-ink truncate" style={{ letterSpacing: '0.16px' }}>{msg.otherUser?.fullName || t('buyer_supplier_label')}</div>
                      <div className="text-[10px] text-ink-muted truncate" style={{ letterSpacing: '0.16px' }}>{msg.lastMessage || t('buyer_new_message')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-card-bg shadow-subtle p-6 relative overflow-hidden rounded-lg">
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
          <div className="bg-card-bg shadow-subtle p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-1 border border-hairline flex items-center justify-center" style={{ borderRadius: '4px' }}>
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
