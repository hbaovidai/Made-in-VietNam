import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MessageCircle, Clock, CheckCircle2, XCircle, SearchIcon, Eye, Loader2, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

export function SupplierInquiries() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/messages/conversations/${user?.id}`);
      setInquiries(res.data || []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách yêu cầu' });
    } finally {
      setLoading(false);
    }
  };

  const getTimeSince = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const handleViewConversation = (conversationId: string) => {
    // Navigate to the messages page for this conversation
    navigate('/dashboard/supplier/messages');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('quan_ly_yeu_cau')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>Phản hồi các yêu cầu nhắn tin từ người mua — {inquiries.length} cuộc hội thoại</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-20 text-center space-y-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto rounded-2xl">
            <Inbox size={40} className="text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{t('chua_co_yeu_cau_nao')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Khi người mua gửi tin nhắn hoặc inquiry về sản phẩm của bạn, chúng sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-700">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-1/4">Người mua</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-1/3">{t('tin_nhan_moi_nhat')}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-32">Thời gian</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-36">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((conv: any) => {
                // Find the other participant (buyer)
                const otherParticipant = conv.participants?.find((p: any) => p.userId !== user?.id);
                const unread = conv.participants?.find((p: any) => p.userId === user?.id)?.unreadCount || 0;

                return (
                  <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm shrink-0 rounded-xl">
                          {(otherParticipant?.user?.fullName || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{otherParticipant?.user?.fullName || 'Người mua'}</div>
                          <div className="text-xs text-slate-400 truncate">{otherParticipant?.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle max-w-xs">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-slate-400 shrink-0" />
                        <p className="text-xs font-medium text-slate-600 truncate">
                          {conv.lastMessage || 'Chưa có tin nhắn'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
                        {conv.lastMessageAt ? getTimeSince(conv.lastMessageAt) : getTimeSince(conv.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {unread > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
                          <Clock size={13} /> {unread} chưa đọc
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
                          <CheckCircle2 size={13} /> Đã phản hồi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <button 
                        onClick={() => handleViewConversation(conv.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-2xs transition-all"
                      >
                        <Eye size={14} /> Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
