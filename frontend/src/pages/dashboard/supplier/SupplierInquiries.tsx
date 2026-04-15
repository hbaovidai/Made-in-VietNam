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
        <h1 className="text-xl font-bold text-slate-900">Quản lý Yêu cầu</h1>
        <p className="text-sm text-slate-500 mt-1">Phản hồi các yêu cầu nhắn tin từ người mua — {inquiries.length} cuộc hội thoại</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Inbox size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Chưa có yêu cầu nào</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Khi người mua gửi tin nhắn hoặc inquiry về sản phẩm của bạn, chúng sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Người mua</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Tin nhắn mới nhất</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Thời gian</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {inquiries.map((conv: any) => {
                // Find the other participant (buyer)
                const otherParticipant = conv.participants?.find((p: any) => p.userId !== user?.id);
                const unread = conv.participants?.find((p: any) => p.userId === user?.id)?.unreadCount || 0;

                return (
                  <tr key={conv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {(otherParticipant?.user?.fullName || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{otherParticipant?.user?.fullName || 'Người mua'}</div>
                          <div className="text-xs text-slate-400">{otherParticipant?.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top max-w-xs">
                      <div className="flex items-start gap-2">
                        <MessageCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-600 leading-relaxed truncate">
                          {conv.lastMessage || 'Chưa có tin nhắn'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="text-xs font-medium text-slate-400">
                        {conv.lastMessageAt ? getTimeSince(conv.lastMessageAt) : getTimeSince(conv.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      {unread > 0 ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
                          <Clock size={14} /> {unread} chưa đọc
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Đã phản hồi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      <button 
                        onClick={() => handleViewConversation(conv.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary hover:bg-blue-50 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm"
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
