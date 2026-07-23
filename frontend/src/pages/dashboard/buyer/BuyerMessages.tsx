import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Loader2, ArrowLeft, Search, User, Trash2, 
  Phone, Video, MoreVertical, Paperclip, Image, Smile, FileText, 
  Download, FileCode, FileSpreadsheet, X, CheckCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';
import { getSocket } from '../../../lib/socket';

export function BuyerMessages() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Attachments & Utility state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) loadConversations();

    // Kết nối WebSocket thời gian thực
    const socket = getSocket();

    const handleNewMessage = (msg: any) => {
      if (selectedConvo && msg.conversationId === selectedConvo.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        scrollToBottom();
      }
      loadConversations();
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user, selectedConvo?.id]);

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
      const socket = getSocket();
      if (selectedConvo?.id && selectedConvo.id !== convo.id) {
        socket.emit('leave_conversation', { conversationId: selectedConvo.id });
      }
      socket.emit('join_conversation', { conversationId: convo.id });

      const res = await api.get(`/messages/conversations/${convo.id}/history?userId=${user?.id}`);
      setMessages(res.data.reverse());
      scrollToBottom();

      // Polling dự phòng 10s (fallback nếu kết nối mạng chập chờn)
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          const pollRes = await api.get(`/messages/conversations/${convo.id}/history?userId=${user?.id}`);
          setMessages(pollRes.data.reverse());
        } catch {}
      }, 10000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachedFile) || !selectedConvo || !user?.id) return;
    setSending(true);

    try {
      let finalContent = newMessage.trim();
      if (attachedFile) {
        const fileMeta = `[ATTACHMENT] ${attachedFile.name} (${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)`;
        finalContent = finalContent ? `${finalContent}\n${fileMeta}` : fileMeta;
      }

      await api.post('/messages/send', {
        conversationId: selectedConvo.id,
        content: finalContent,
        type: attachedFile ? 'FILE' : 'TEXT',
      });

      setNewMessage('');
      setAttachedFile(null);
      setShowEmojiPicker(false);

      // Immediately reload messages
      const res = await api.get(`/messages/conversations/${selectedConvo.id}/history?userId=${user.id}`);
      setMessages(res.data.reverse());
      scrollToBottom();
      loadConversations();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể gửi tin nhắn' });
    } finally {
      setSending(false);
    }
  };

  const triggerCall = (type: 'phone' | 'video') => {
    const targetName = selectedConvo?.targetUser?.fullName || 'đối tác';
    addToast({
      type: 'info',
      title: type === 'phone' ? 'Cuộc gọi thoại' : 'Video Call',
      message: `Đang kết nối ${type === 'phone' ? 'thoại' : 'video'} với ${targetName}...`,
      duration: 3500
    });
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
    if (diffHours < 1) return t('msg_minutes_ago', { count: Math.max(1, Math.floor(diffMs / 60000)) });
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
      if (selectedConvo?.id === convoId) {
        setSelectedConvo(null);
        setMessages([]);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
      loadConversations();
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa hội thoại' });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa hội thoại' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(null);
    }
  };

  // Helper to parse file attachment from content
  const parseAttachment = (content: string) => {
    if (content.includes('[ATTACHMENT]')) {
      const match = content.match(/\[ATTACHMENT\]\s*([^\s(]+(?:\s+[^\s(]+)*)?\s*\(([^)]+)\)/);
      if (match) {
        const fileName = match[1] || 'Tập tin đính kèm';
        const fileSize = match[2] || 'File';
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        return { fileName, fileSize, ext };
      }
      return { fileName: 'Tập tin đính kèm', fileSize: 'Document', ext: 'doc' };
    }
    return null;
  };

  const renderFileCard = (fileInfo: { fileName: string; fileSize: string; ext: string }, isMe: boolean) => {
    let icon = <FileText size={20} className={isMe ? "text-blue-200" : "text-red-500"} />;
    if (['png', 'jpg', 'jpeg', 'webp'].includes(fileInfo.ext)) {
      icon = <Image size={20} className={isMe ? "text-blue-200" : "text-emerald-500"} />;
    } else if (['cad', 'dwg', 'zip', 'rar'].includes(fileInfo.ext)) {
      icon = <FileCode size={20} className={isMe ? "text-amber-200" : "text-amber-500"} />;
    } else if (['xls', 'xlsx', 'csv'].includes(fileInfo.ext)) {
      icon = <FileSpreadsheet size={20} className={isMe ? "text-emerald-200" : "text-emerald-600"} />;
    }

    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl mt-2 border ${
        isMe ? 'bg-blue-700/50 border-blue-500/50 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className={`p-2 rounded-lg ${isMe ? 'bg-blue-800/60' : 'bg-white shadow-2xs border border-slate-100'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate leading-tight">{fileInfo.fileName}</p>
          <p className={`text-[11px] mt-0.5 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>{fileInfo.fileSize}</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', title: 'Tải xuống', message: `Đang tải file ${fileInfo.fileName}...` })}
          className={`p-1.5 rounded-full transition-colors ${
            isMe ? 'hover:bg-blue-500/50 text-white' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Tải xuống"
        >
          <Download size={15} />
        </button>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] min-h-[600px] bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* ==================== CỘT TRÁI: CHAT LIST (320px) ==================== */}
      <div className={`w-full md:w-[320px] shrink-0 border-r border-slate-200 flex flex-col bg-white ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {/* Header & Rounded-full Search bar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" />
                {t('msg_title')}
              </h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200/50">
                {conversations.length}
              </span>
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('msg_search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 border border-slate-200/80 rounded-full text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">{t('msg_no_messages')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('msg_no_messages_desc')}</p>
              </div>
            ) : (
              filteredConvos.map((convo) => {
                const isActive = selectedConvo?.id === convo.id;
                const isOnline = true; // Online indicator enabled for active contacts

                return (
                  <div
                    key={convo.id}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all group relative ${
                      isActive
                        ? 'bg-blue-50/80 border-l-4 border-blue-600 shadow-2xs font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => openConversation(convo)}
                  >
                    {/* Circle Avatar with Online Green Dot */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-sm font-bold text-blue-700 overflow-hidden">
                        {convo.targetUser?.avatar ? (
                          <img src={convo.targetUser.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(convo.targetUser?.fullName || '')
                        )}
                      </div>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-600/20" />
                      )}
                    </div>

                    {/* Chat details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs truncate ${isActive ? 'font-bold text-blue-950' : 'font-semibold text-slate-900'}`}>
                          {convo.targetUser?.fullName || t('msg_role_buyer')}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {convo.lastMessageAt ? formatTime(convo.lastMessageAt) : ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs truncate max-w-[180px] ${isActive ? 'text-blue-900 font-medium' : 'text-slate-500 font-normal'}`}>
                          {convo.lastMessage || t('msg_no_message_content')}
                        </p>
                        {/* Red Badge Count */}
                        {convo.unreadCount > 0 && (
                          <span className="shrink-0 ml-2 bg-red-500 text-white text-[11px] font-bold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center shadow-xs">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Role Pill */}
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                          {convo.targetUser?.role === 'SUPPLIER' ? t('msg_role_supplier') : convo.targetUser?.role === 'ADMIN' ? 'Admin' : t('msg_role_buyer')}
                        </span>
                      </div>
                    </div>

                    {/* Hover Trash Action */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(convo.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all shrink-0 ml-1"
                      title="Xóa cuộc trò chuyện"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ==================== CỘT PHẢI: CHAT WINDOW ==================== */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <>
              {/* Header: Circle Avatar + Pastel Role Badge + Action Buttons */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => { setSelectedConvo(null); if (pollingRef.current) clearInterval(pollingRef.current); }} className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={18} />
                  </button>
                  
                  {/* Circle Avatar with Online Green Dot */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-sm font-bold text-blue-700 overflow-hidden">
                      {selectedConvo.targetUser?.avatar ? (
                        <img src={selectedConvo.targetUser.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(selectedConvo.targetUser?.fullName || '')
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-600/20" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {selectedConvo.targetUser?.fullName || t('msg_role_buyer')}
                      </h3>
                      {/* Role Badge Pastel */}
                      <span className="bg-blue-100 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200/50 shrink-0">
                        {selectedConvo.targetUser?.role === 'SUPPLIER' ? t('msg_role_supplier') : selectedConvo.targetUser?.role === 'ADMIN' ? 'Admin' : t('msg_role_buyer')}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Đang hoạt động
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button onClick={() => triggerCall('phone')} title="Gọi điện" className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <Phone size={18} />
                  </button>
                  <button onClick={() => triggerCall('video')} title="Video call" className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <Video size={18} />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(selectedConvo.id)} title="Xóa trò chuyện" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Timeline */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-blue-600" size={28} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                    <MessageSquare size={36} className="mb-2 text-slate-300" />
                    <p className="text-sm font-medium">{t('msg_start_chatting')}</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?.id === user?.id || msg.senderId === user?.id;
                    const attachment = parseAttachment(msg.content);
                    const cleanText = msg.content.replace(/\[ATTACHMENT\][^\n]*/g, '').trim();

                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[82%] sm:max-w-[65%] p-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-xs'
                            : 'bg-white border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs'
                        }`}>
                          {cleanText && <p className="whitespace-pre-wrap">{cleanText}</p>}
                          {attachment && renderFileCard(attachment, isMe)}

                          <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                            isMe ? 'text-blue-100' : 'text-slate-400'
                          }`}>
                            <span>{formatTime(msg.createdAt)}</span>
                            {isMe && <CheckCheck size={13} className="text-blue-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar Bottom */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
                {/* File Attachment Pill */}
                {attachedFile && (
                  <div className="mb-2.5 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-medium">
                    <Paperclip size={14} />
                    <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="hover:text-red-500 ml-1">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Emoji Bar */}
                {showEmojiPicker && (
                  <div className="mb-2.5 p-2 bg-white border border-slate-200 rounded-full shadow-lg flex items-center gap-2 text-base animate-toast-in overflow-x-auto">
                    {['😊', '👍', '🤝', '📄', '📦', '🔥', '🎉', '❤️', '✅', '🙏'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => { setNewMessage(prev => prev + ' ' + emoji); setShowEmojiPicker(false); }}
                        className="hover:scale-125 transition-transform p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  {/* Rounded-full Input Field with Utility Icons Inside */}
                  <div className="flex-1 flex items-center bg-white border border-slate-200/90 shadow-2xs rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('msg_type_message')}
                      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 py-1.5 px-1"
                      autoFocus
                    />

                    {/* Utility Icons: File, Image, Emoji */}
                    <div className="flex items-center gap-1 text-slate-400 shrink-0">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Đính kèm tài liệu (PDF, PNG, CAD...)"
                        className="p-1.5 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Paperclip size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Gửi hình ảnh"
                        className="p-1.5 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Image size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        title="Biểu tượng cảm xúc"
                        className="p-1.5 hover:text-amber-500 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Smile size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Circle Blue Send Button */}
                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && !attachedFile) || sending}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all shrink-0 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    title="Gửi tin nhắn"
                  >
                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State when no conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare size={36} className="text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('msg_select_conversation')}</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                {t('msg_select_conversation_desc')}
              </p>
            </div>
          )}
        </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl animate-toast-in">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <Trash2 size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">{t('msg_delete_title')}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('msg_delete_desc')}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {t('msg_cancel_btn')}
              </button>
              <button
                onClick={() => handleDeleteConversation(showDeleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
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
