import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Loader2, ArrowLeft, Search, User, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function BuyerMessages() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) loadConversations();
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [user]);

  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/messages/conversations/${user.id}`);
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (convo: any) => {
    setSelectedConvo(convo);
    setLoadingMessages(true);
    try {
      const res = await api.get(`/messages/conversations/${convo.id}/history?userId=${user?.id}`);
      setMessages(res.data.reverse()); // API returns desc, we need asc
      scrollToBottom();

      // Start polling for new messages every 5s
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          const pollRes = await api.get(`/messages/conversations/${convo.id}/history?userId=${user?.id}`);
          setMessages(pollRes.data.reverse());
        } catch {}
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo || !user?.id) return;
    setSending(true);
    try {
      await api.post('/messages/send', {
        conversationId: selectedConvo.id,
        content: newMessage.trim(),
        type: 'TEXT',
      });
      setNewMessage('');
      // Immediately reload messages
      const res = await api.get(`/messages/conversations/${selectedConvo.id}/history?userId=${user.id}`);
      setMessages(res.data.reverse());
      scrollToBottom();
      // Also refresh conversation list (for lastMessage update)
      loadConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 1) return t('msg_minutes_ago', { count: Math.floor(diffMs / 60000) });
    if (diffHours < 24) return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const filteredConvos = conversations.filter(c => {
    if (!searchTerm) return true;
    const name = c.targetUser?.fullName?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase());
  });

  const getInitials = (name: string) => {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  const handleDeleteConversation = async (convoId: string) => {
    setDeleting(true);
    try {
      await api.delete(`/messages/conversations/${convoId}`);
      // Clear selection if deleted conversation was selected
      if (selectedConvo?.id === convoId) {
        setSelectedConvo(null);
        setMessages([]);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
      // Reload conversations
      loadConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
          {t('msg_title')}: <span className="text-ink font-semibold">{t('msg_conversations_count', { count: conversations.length })}</span>
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex border border-hairline overflow-hidden bg-canvas min-h-0" style={{ borderRadius: 0 }}>
        {/* Conversation List - Left Panel */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-hairline flex flex-col shrink-0 ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-hairline">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
              <input
                type="text"
                placeholder={t('msg_search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
                  <MessageSquare size={28} className="text-ink-subtle" />
                </div>
                <p className="text-sm font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('msg_no_messages')}</p>
                <p className="text-xs text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('msg_no_messages_desc')}</p>
              </div>
            ) : (
              filteredConvos.map((convo) => (
                <div
                  key={convo.id}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-hairline group/item ${
                    selectedConvo?.id === convo.id ? 'bg-surface-2 border-l-2 border-l-primary' : 'hover:bg-surface-1'
                  }`}
                >
                  {/* Click area for opening convo */}
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => openConversation(convo)}>
                    {/* Avatar */}
                    <div className="w-11 h-11 bg-surface-1 border border-hairline flex items-center justify-center shrink-0 text-sm font-normal text-primary" style={{ borderRadius: 0 }}>
                      {convo.targetUser?.avatar ? (
                        <img src={convo.targetUser.avatar} alt="" className="w-full h-full object-cover" style={{ borderRadius: 0 }} />
                      ) : (
                        getInitials(convo.targetUser?.fullName || '')
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-normal text-ink truncate" style={{ letterSpacing: '0.16px' }}>{convo.targetUser?.fullName || t('msg_role_buyer')}</span>
                        <span className="text-[10px] text-ink-subtle shrink-0 ml-2" style={{ letterSpacing: '0.16px' }}>{convo.lastMessageAt ? formatTime(convo.lastMessageAt) : ''}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-ink-muted truncate" style={{ letterSpacing: '0.16px' }}>{convo.lastMessage || t('msg_no_message_content')}</p>
                        {convo.unreadCount > 0 && (
                          <span className="shrink-0 ml-2 w-5 h-5 bg-primary text-white text-[10px] font-normal flex items-center justify-center" style={{ borderRadius: 0 }}>
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-[9px] font-normal uppercase tracking-widest px-1.5 py-0.5 border border-hairline bg-surface-1 text-primary" style={{ borderRadius: 0, letterSpacing: '0.32px' }}>
                          {convo.targetUser?.role === 'SUPPLIER' ? t('msg_role_supplier') : convo.targetUser?.role === 'BUYER' ? t('msg_role_buyer') : convo.targetUser?.role || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Delete button on hover */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(convo.id); }}
                    className="opacity-0 group-hover/item:opacity-100 p-1.5 text-hairline hover:text-red-500 hover:bg-surface-2 transition-all shrink-0"
                    style={{ borderRadius: 0 }}
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window - Right Panel */}
        <div className={`flex-1 flex flex-col ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-hairline flex items-center gap-3 bg-canvas">
                <button onClick={() => { setSelectedConvo(null); if (pollingRef.current) clearInterval(pollingRef.current); }} className="md:hidden text-ink-muted hover:text-ink">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-surface-1 border border-hairline flex items-center justify-center shrink-0 text-sm font-normal text-primary" style={{ borderRadius: 0 }}>
                  {selectedConvo.targetUser?.avatar ? (
                    <img src={selectedConvo.targetUser.avatar} alt="" className="w-full h-full object-cover" style={{ borderRadius: 0 }} />
                  ) : (
                    getInitials(selectedConvo.targetUser?.fullName || '')
                  )}
                </div>
                <div>
                  <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{selectedConvo.targetUser?.fullName || t('msg_role_buyer')}</div>
                  <span className="text-[9px] font-normal uppercase tracking-widest px-1.5 py-0.5 border border-hairline bg-surface-1 text-primary" style={{ borderRadius: 0, letterSpacing: '0.32px' }}>
                    {selectedConvo.targetUser?.role === 'SUPPLIER' ? t('msg_role_supplier') : selectedConvo.targetUser?.role === 'BUYER' ? t('msg_role_buyer') : ''}
                  </span>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => setShowDeleteConfirm(selectedConvo.id)}
                  className="ml-auto p-2 text-hairline hover:text-red-500 hover:bg-surface-2 transition-colors"
                  style={{ borderRadius: 0 }}
                  title={t('msg_delete_title')}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-1">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                    {t('msg_start_chatting')}
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?.id === user?.id || msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap border ${
                          isMe
                            ? 'bg-primary text-white border-primary'
                            : 'bg-canvas border-hairline text-ink'
                        }`} style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
                          {msg.content}
                          <div className={`text-[10px] mt-1.5 ${isMe ? 'text-white/70' : 'text-ink-subtle'}`} style={{ letterSpacing: '0.16px' }}>
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-hairline bg-canvas flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('msg_type_message')}
                  className="flex-1 px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle"
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-11 h-11 bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  style={{ borderRadius: 0 }}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-canvas">
              <div className="w-24 h-24 bg-surface-1 border border-hairline flex items-center justify-center mb-6" style={{ borderRadius: 0 }}>
                <MessageSquare size={40} className="text-ink-subtle" />
              </div>
              <h3 className="text-lg font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('msg_select_conversation')}</h3>
              <p className="text-sm text-ink-muted mt-2 max-w-sm" style={{ letterSpacing: '0.16px' }}>
                {t('msg_select_conversation_desc')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-canvas border border-hairline p-6 max-w-sm w-full space-y-4" style={{ borderRadius: 0 }}>
            <div className="w-14 h-14 bg-surface-1 border border-hairline flex items-center justify-center mx-auto" style={{ borderRadius: 0 }}>
              <Trash2 size={28} className="text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('msg_delete_title')}</h3>
              <p className="text-sm text-ink-muted mt-2" style={{ letterSpacing: '0.16px' }}>
                {t('msg_delete_desc')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-surface-2 text-ink text-sm font-normal hover:bg-surface-3 transition-colors disabled:opacity-50"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                {t('msg_cancel_btn')}
              </button>
              <button
                onClick={() => handleDeleteConversation(showDeleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-normal hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {t('msg_delete_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
