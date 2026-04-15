import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, FileText, ArrowUpRight, Shield, Package, Inbox, Clock } from 'lucide-react';
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
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const kpis = [
    { label: 'Yêu cầu báo giá', value: rfqCount, icon: <FileText size={18} className="text-blue-500" />, bg: 'bg-blue-50', link: '/dashboard/buyer/rfqs' },
    { label: 'Tin nhắn', value: messages.length, icon: <MessageSquare size={18} className="text-orange-500" />, bg: 'bg-orange-50', link: '/dashboard/buyer/messages' },
    { label: 'Giỏ hàng yêu cầu', value: 0, icon: <ShoppingCart size={18} className="text-emerald-500" />, bg: 'bg-emerald-50', link: '/dashboard/buyer/saved' },
    { label: 'Sản phẩm đã lưu', value: 0, icon: <Package size={18} className="text-purple-500" />, bg: 'bg-purple-50', link: '/dashboard/buyer/saved' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Xin chào, {user?.fullName || 'Người mua'}</p>
        <Link to="/rfq" className="text-xs font-bold text-white bg-primary px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shadow-sm shrink-0 inline-flex items-center gap-2">
          <FileText size={14} /> Đăng yêu cầu báo giá
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Link key={i} to={kpi.link} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{kpi.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent RFQs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Hoạt động gần đây</h2>
            <Link to="/dashboard/buyer/history" className="text-xs font-bold text-primary hover:underline">Xem tất cả</Link>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">Chưa có hoạt động nào</p>
              <p className="text-xs text-slate-400 mt-1">Các hoạt động mua hàng, báo giá sẽ hiển thị tại đây.</p>
              <Link to="/products" className="text-xs font-bold text-primary mt-3 inline-block hover:underline">Khám phá sản phẩm →</Link>
            </div>
          ) : (
            <div>
              {rfqs.map((rfq: any, i: number) => (
                <div 
                  key={rfq.id} 
                  className={`px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${i < rfqs.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{rfq.productName || 'Yêu cầu báo giá'}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">SL: {rfq.quantity} {rfq.quantityUnit}</span>
                        {rfq._count?.quotes > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{rfq._count.quotes} báo giá</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                      rfq.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 
                      rfq.status === 'CLOSED' ? 'bg-slate-100 text-slate-500' : 
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {rfq.status === 'OPEN' ? 'Đang mở' : rfq.status === 'CLOSED' ? 'Đã đóng' : rfq.status}
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
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Tin nhắn</h2>
              <Link to="/dashboard/buyer/messages" className="text-xs font-bold text-primary hover:underline">Tất cả</Link>
            </div>
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={24} className="text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Chưa có tin nhắn</p>
              </div>
            ) : (
              <div>
                {messages.slice(0, 3).map((msg: any, i: number) => (
                  <Link 
                    key={msg.id} 
                    to="/dashboard/buyer/messages"
                    className={`px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${i < Math.min(messages.length, 3) - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                      {(msg.otherUser?.fullName || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800 truncate">{msg.otherUser?.fullName || 'Nhà cung cấp'}</div>
                      <div className="text-[10px] text-slate-400 truncate">{msg.lastMessage || 'Tin nhắn mới'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-white mb-4">Công cụ tìm nguồn</h3>
              <div className="space-y-3">
                {[
                  { label: 'Đăng yêu cầu báo giá', to: '/rfq' },
                  { label: 'Duyệt sản phẩm', to: '/products' },
                  { label: 'Trung tâm hỗ trợ', to: '/help' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="flex items-center justify-between group">
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{link.label}</span>
                    <ArrowUpRight size={12} className="text-slate-500 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Assurance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Trade Assurance</h3>
                <p className="text-[10px] text-slate-400">Bảo vệ giao dịch an toàn</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Giao dịch được bảo vệ với đảm bảo hoàn tiền và chất lượng sản phẩm.
            </p>
            <Link to="/services/trade-assurance" className="text-xs font-bold text-primary hover:underline">
              Tìm hiểu thêm →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
