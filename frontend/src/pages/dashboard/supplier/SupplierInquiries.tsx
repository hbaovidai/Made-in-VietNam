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
        <div className="p-20 text-center space-y-4 bg-canvas border border-hairline" style={{ borderRadius: 0 }}>
          <div className="w-20 h-20 bg-surface-1 border border-hairline flex items-center justify-center mx-auto" style={{ borderRadius: 0 }}>
            <Inbox size={40} className="text-ink-subtle" />
          </div>
          <h3 className="text-base font-normal text-ink uppercase tracking-tight" style={{ letterSpacing: '0.32px' }}>{t('chua_co_yeu_cau_nao')}</h3>
          <p className="text-ink-muted text-sm max-w-xs mx-auto" style={{ letterSpacing: '0.16px' }}>
            Khi người mua gửi tin nhắn hoặc inquiry về sản phẩm của bạn, chúng sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-canvas border border-hairline" style={{ borderRadius: 0 }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-2 border-b border-hairline">
                <th className="px-6 py-4 text-xs font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Người mua</th>
                <th className="px-6 py-4 text-xs font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>{t('tin_nhan_moi_nhat')}</th>
                <th className="px-6 py-4 text-xs font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Thời gian</th>
                <th className="px-6 py-4 text-xs font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Trạng thái</th>
                <th className="px-6 py-4 text-xs font-normal text-ink-subtle uppercase tracking-widest text-right" style={{ letterSpacing: '0.32px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {inquiries.map((conv: any) => {
                // Find the other participant (buyer)
                const otherParticipant = conv.participants?.find((p: any) => p.userId !== user?.id);
                const unread = conv.participants?.find((p: any) => p.userId === user?.id)?.unreadCount || 0;

                return (
                  <tr key={conv.id} className="hover:bg-surface-1 transition-colors group">
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-2 border border-hairline flex items-center justify-center text-ink font-normal text-sm shrink-0" style={{ borderRadius: 0 }}>
                          {(otherParticipant?.user?.fullName || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{otherParticipant?.user?.fullName || 'Người mua'}</div>
                          <div className="text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{otherParticipant?.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top max-w-xs">
                      <div className="flex items-start gap-2">
                        <MessageCircle size={16} className="text-ink-subtle mt-0.5 shrink-0" />
                        <p className="text-sm text-ink-muted leading-relaxed truncate" style={{ letterSpacing: '0.16px' }}>
                          {conv.lastMessage || 'Chưa có tin nhắn'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="text-xs font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                        {conv.lastMessageAt ? getTimeSince(conv.lastMessageAt) : getTimeSince(conv.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      {unread > 0 ? (
                        <span 
                          className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/50 text-amber-800 border border-amber-300 text-xs font-normal uppercase tracking-wider"
                          style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                        >
                          <Clock size={14} /> {unread} chưa đọc
                        </span>
                      ) : (
                        <span 
                          className="flex items-center gap-1.5 px-3 py-1 bg-green-100/50 text-green-800 border border-green-300 text-xs font-normal uppercase tracking-wider"
                          style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                        >
                          <CheckCircle2 size={14} /> Đã phản hồi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      <button 
                        onClick={() => handleViewConversation(conv.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 border border-hairline text-ink hover:bg-surface-2 text-xs font-normal uppercase tracking-wider transition-all"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
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
