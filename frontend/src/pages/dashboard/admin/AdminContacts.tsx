import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Mail, MailOpen, Search, Reply, Trash2, CheckCircle2, Circle } from 'lucide-react';

export function AdminContacts() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await api.get('/contact');
      setContacts(res.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_contacts_load_error') });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentIsRead: boolean) => {
    try {
      await api.patch(`/contact/${id}/read`, { isRead: !currentIsRead });
      setContacts(contacts.map(c => c.id === id ? { ...c, isRead: !currentIsRead } : c));
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật trạng thái' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contact/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa liên hệ' });
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa liên hệ' });
    }
  };

  const handleReply = (email: string, subject: string) => {
    window.open(`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`, '_blank');
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const filtered = contacts
    .filter(c => {
      if (filter === 'unread') return !c.isRead;
      if (filter === 'read') return c.isRead;
      return true;
    })
    .filter(c =>
      !search ||
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Unread indicator */}
      {unreadCount > 0 && (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
          <Circle size={6} fill="currentColor" /> {unreadCount} {t('admin_contacts_unread')}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('admin_search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                filter === f
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'Tất cả' : f === 'unread' ? `Chưa đọc (${unreadCount})` : 'Đã đọc'}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">{t('admin_no_contacts_found')}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(contact => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                !contact.isRead
                  ? 'border-primary/30 shadow-[0_0_0_1px_rgba(var(--color-primary-rgb),0.1)] bg-primary/[0.02]'
                  : 'border-slate-200'
              }`}
            >
              {/* Header Row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => {
                  setExpandedId(expandedId === contact.id ? null : contact.id);
                  if (!contact.isRead) handleToggleRead(contact.id, false);
                }}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !contact.isRead ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                }`}>
                  {!contact.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!contact.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {contact.fullName}
                    </span>
                    {!contact.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                    )}
                  </div>
                  <div className={`text-sm mt-0.5 truncate ${!contact.isRead ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                    {contact.subject}
                  </div>
                </div>

                {/* Date */}
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    {new Date(contact.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === contact.id && (
                <div className="border-t border-slate-100">
                  {/* Email */}
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email:</span>
                    <span className="text-sm text-primary font-medium ml-2">{contact.email}</span>
                  </div>

                  {/* Message */}
                  <div className="px-4 py-3">
                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReply(contact.email, contact.subject); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <Reply size={12} /> Trả lời
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleRead(contact.id, contact.isRead); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        {contact.isRead ? (
                          <><Circle size={12} /> Đánh dấu chưa đọc</>
                        ) : (
                          <><CheckCircle2 size={12} /> Đánh dấu đã đọc</>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
