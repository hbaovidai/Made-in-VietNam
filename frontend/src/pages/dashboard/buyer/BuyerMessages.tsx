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
        <h1 className="text-xl font-bold text-slate-900">{t('msg_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('msg_conversations_count', { count: conversations.length })}</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex border border-slate-200 rounded-2xl overflow-hidden bg-white min-h-0">
        {/* Conversation List - Left Panel */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col shrink-0 ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder={t('msg_search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
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
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={28} className="text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">{t('msg_no_messages')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('msg_no_messages_desc')}</p>
              </div>
            ) : (
              filteredConvos.map((convo) => (
                <div
                  key={convo.id}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-50 group/item ${
                    selectedConvo?.id === convo.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Click area for opening convo */}
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => openConversation(convo)}>
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                      {convo.targetUser?.avatar ? (
                        <img src={convo.targetUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(convo.targetUser?.fullName || '')
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 truncate">{convo.targetUser?.fullName || t('msg_role_buyer')}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{convo.lastMessageAt ? formatTime(convo.lastMessageAt) : ''}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-slate-500 truncate">{convo.lastMessage || t('msg_no_message_content')}</p>
                        {convo.unreadCount > 0 && (
                          <span className="shrink-0 ml-2 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          convo.targetUser?.role === 'SUPPLIER' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                        }`}>
                          {convo.targetUser?.role === 'SUPPLIER' ? t('msg_role_supplier') : convo.targetUser?.role === 'BUYER' ? t('msg_role_buyer') : convo.targetUser?.role || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Delete button on hover */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(convo.id); }}
                    className="opacity-0 group-hover/item:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
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
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                <button onClick={() => { setSelectedConvo(null); if (pollingRef.current) clearInterval(pollingRef.current); }} className="md:hidden text-slate-400 hover:text-slate-900">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                  {selectedConvo.targetUser?.avatar ? (
                    <img src={selectedConvo.targetUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(selectedConvo.targetUser?.fullName || '')
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedConvo.targetUser?.fullName || t('msg_role_buyer')}</div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    selectedConvo.targetUser?.role === 'SUPPLIER' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                  }`}>
                    {selectedConvo.targetUser?.role === 'SUPPLIER' ? t('msg_role_supplier') : selectedConvo.targetUser?.role === 'BUYER' ? t('msg_role_buyer') : ''}
                  </span>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => setShowDeleteConfirm(selectedConvo.id)}
                  className="ml-auto p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title={t('msg_delete_title')}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">
                    {t('msg_start_chatting')}
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?.id === user?.id || msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          isMe
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                        }`}>
                          {msg.content}
                          <div className={`text-[10px] mt-1.5 ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
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
              <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('msg_type_message')}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} className="text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t('msg_select_conversation')}</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">
                {t('msg_select_conversation_desc')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">{t('msg_delete_title')}</h3>
              <p className="text-sm text-slate-500 mt-2">
                {t('msg_delete_desc')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {t('msg_cancel_btn')}
              </button>
              <button
                onClick={() => handleDeleteConversation(showDeleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
