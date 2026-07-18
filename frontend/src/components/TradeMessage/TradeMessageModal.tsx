import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from './types';
import { mockConversations } from './mockData';
import { ConversationList } from './ConversationList';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TradeInfoPanel } from './TradeInfoPanel';
import { Minus, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface TradeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimizeToggle: (minimized: boolean) => void;
  isMinimized: boolean;
  selectedId?: string | null;
  onSelectId?: (id: string) => void;
}

export function TradeMessageModal({
  isOpen,
  onClose,
  onMinimizeToggle,
  isMinimized,
  selectedId: propSelectedId,
  onSelectId
}: TradeMessageModalProps) {
  const { isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>('conv-1');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [typingConvId, setTypingConvId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/messages/conversations/${user.id}`);
      const mapped = res.data.map((convo: any) => {
        const initials = convo.targetUser?.fullName
          ?.split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || '?';

        return {
          id: convo.id,
          supplierName: convo.targetUser?.fullName || 'Người dùng',
          verified: convo.targetUser?.role === 'SUPPLIER',
          avatar: convo.targetUser?.avatar,
          lastMessage: convo.lastMessage || 'Chưa có tin nhắn',
          lastMessageTime: convo.lastMessageAt
            ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
          unreadCount: convo.unreadCount || 0,
          isStarred: false,
          messages: [],
          inquiryId: convo.rfq ? convo.rfq.id : ('RFQ-' + convo.id.slice(0, 8).toUpperCase()),
          createdDate: convo.rfq
            ? new Date(convo.rfq.createdAt).toLocaleDateString('vi-VN')
            : (convo.lastMessageAt 
              ? new Date(convo.lastMessageAt).toLocaleDateString('vi-VN') 
              : new Date().toLocaleDateString('vi-VN')),
          status: convo.rfq ? convo.rfq.status : 'In Negotiation',
          quantity: convo.rfq ? `${convo.rfq.quantity} ${convo.rfq.quantityUnit || 'cái'}` : 'Liên hệ',
          targetPrice: convo.rfq ? (convo.rfq.budget || 'Thỏa thuận') : 'Thỏa thuận',
          productName: convo.rfq ? convo.rfq.productName : 'Yêu cầu báo giá B2B',
          productImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150',
          supplierLogo: '',
          supplierLocation: 'Vietnam',
          responseTime: '< 1h',
          responseRate: '98%',
          avatarBg: convo.targetUser?.role === 'SUPPLIER' ? 'bg-blue-600' : 'bg-green-600',
          avatarText: initials,
          country: convo.targetUser?.role === 'SUPPLIER' ? 'Việt Nam' : 'Người mua',
          yearsOnPlatform: 1,
          category: 'B2B/Vietnam',
          supplierId: convo.targetUser?.supplier?.id,
          hasRfq: !!convo.rfq
        };
      });

      setConversations(mapped);
      
      if (mapped.length > 0) {
        setSelectedId((prev) => {
          if (prev === 'conv-1' || !mapped.some(c => c.id === prev)) {
            return mapped[0].id;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to load conversations in workspace', err);
    }
  };

  const loadMessages = async (convoId: string) => {
    if (!user?.id || !convoId || convoId === 'conv-1') return;
    try {
      const res = await api.get(`/messages/conversations/${convoId}/history?userId=${user.id}`);
      const fetchedMsgs = res.data.reverse().map((m: any) => ({
        id: m.id,
        sender: m.senderId === user.id ? 'buyer' : 'supplier',
        type: 'text',
        content: m.content,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }));

      setConversations((prev) =>
        prev.map((c) => (c.id === convoId ? { ...c, messages: fetchedMsgs } : c))
      );
    } catch (err) {
      console.error('Failed to load messages history', err);
    }
  };

  // Sync prop selected ID
  useEffect(() => {
    if (propSelectedId && propSelectedId !== 'conv-1') {
      setSelectedId(propSelectedId);
    }
  }, [propSelectedId]);

  // Initial load when modal is opened or selectedId prop changes
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversations();
    }
  }, [isOpen, isAuthenticated, propSelectedId]);

  // Polling for selected conversation messages
  useEffect(() => {
    if (!isOpen || !isAuthenticated || !selectedId || selectedId === 'conv-1') {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    loadMessages(selectedId);

    pollingRef.current = setInterval(() => {
      loadMessages(selectedId);
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedId, isOpen, isAuthenticated]);

  // Active conversation helper
  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, typingConvId, isOpen]);

  // Handle window resizing to adjust default panel visibility
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowInfoPanel(false);
      } else {
        setShowInfoPanel(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Handle mobile responsive transitions
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    if (onSelectId) {
      onSelectId(id);
    }
    setMobileView('chat');

    // Mark as read in backend
    api.get(`/messages/conversations/${id}/history?userId=${user?.id}`).catch(() => {});

    // Mark as read in local state
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Toggle Star
  const handleToggleStar = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  // Send Message logic
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !selectedId || !user?.id) return;
    try {
      await api.post('/messages/send', {
        conversationId: selectedId,
        content: text.trim(),
        type: 'TEXT',
      });
      
      // Reload history and conversations immediately
      const historyRes = await api.get(`/messages/conversations/${selectedId}/history?userId=${user.id}`);
      const fetchedMsgs = historyRes.data.reverse().map((m: any) => ({
        id: m.id,
        sender: m.senderId === user.id ? 'buyer' : 'supplier',
        type: 'text',
        content: m.content,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }));

      setConversations(prev => prev.map(c => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: fetchedMsgs
          };
        }
        return c;
      }));
      
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  // Send Attachment logic
  const handleSendFile = async (fileName: string, fileSize: string) => {
    if (!selectedId || !user?.id) return;
    try {
      await api.post('/messages/send', {
        conversationId: selectedId,
        content: `📁 Sent file: ${fileName}`,
        type: 'TEXT',
      });
      
      loadMessages(selectedId);
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  // Render minimized state
  if (isMinimized) {
    const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
    return (
      <div
        onClick={() => onMinimizeToggle(false)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white shadow-xl px-3.5 py-2 z-[9999] flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 font-bold text-[11px] select-none animate-in fade-in slide-in-from-bottom-5"
      >
        <MessageSquare size={13} />
        <span>Trade Messenger</span>
        {totalUnread > 0 && (
          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 animate-pulse">
            {totalUnread}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 transition-all duration-300 z-[9999] select-none fixed bottom-6 right-6 w-full h-full md:w-[90vw] md:h-[75vh] lg:w-[900px] lg:h-[620px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] max-md:inset-0 max-md:w-full max-md:h-full`}
    >
      {/* Window Chrome Titlebar */}
      <div className="bg-[#0b162f] text-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 select-none border-b border-blue-950/40">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-400 fill-blue-400/15" />
          <span className="text-xs font-bold tracking-wide">
            Trade Messenger
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Minimize Action */}
          <button
            onClick={() => onMinimizeToggle(true)}
            className="p-1.5 hover:text-white hover:bg-slate-800 transition-all text-slate-400"
            title="Minimize Window"
          >
            <Minus size={14} />
          </button>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-red-600/90 transition-all text-slate-400"
            title="Close Workspace"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 3-Column Work Area */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">
              Đăng nhập để kiểm tra tin nhắn mới
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
              Vui lòng đăng nhập tài khoản của bạn để kết nối, đàm phán và gửi tin nhắn trực tiếp với nhà cung cấp.
            </p>
            <Link
              to="/login"
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-md hover:scale-105"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <>
            {/* COLUMN 1: Conversation List */}
            <div className={`shrink-0 w-full md:w-[260px] border-r border-slate-200 h-full ${
              mobileView === 'chat' ? 'hidden md:block' : 'block'
            }`}>
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={handleSelectConversation}
              />
            </div>

            {/* COLUMN 2: Chat Room Workspace */}
            <div className={`flex-1 flex flex-col h-full bg-slate-50 min-w-0 ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}>
              {/* Header */}
              {activeConv && (
                <ChatHeader
                  supplierName={activeConv.supplierName}
                  verified={activeConv.verified}
                  responseRate={activeConv.responseRate}
                  responseTime={activeConv.responseTime}
                  isStarred={!!activeConv.isStarred}
                  onToggleStar={() => handleToggleStar(activeConv.id)}
                  onBack={() => setMobileView('list')}
                  onToggleInfo={() => setShowInfoPanel(!showInfoPanel)}
                  showInfoActive={showInfoPanel}
                />
              )}

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                <div className="flex justify-center my-3 select-none">
                  <span className="bg-slate-200/60 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Hôm nay
                  </span>
                </div>

                {activeConv?.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Typing Indicator */}
                {activeConv && typingConvId === activeConv.id && (
                  <div className="flex flex-col mb-2 items-start animate-pulse">
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4, paddingLeft: 2 }}>
                      Đối tác đang nhập...
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3 py-2" style={{ maxWidth: 60 }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <ChatInput
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
              />
            </div>

            {/* COLUMN 3: Trade Information Panel */}
            {showInfoPanel && activeConv && (
              <div className={`shrink-0 w-full md:w-[240px] lg:w-[250px] h-full border-l border-slate-200 z-20 ${
                mobileView === 'chat' ? 'block md:block' : 'hidden md:block'
              }`}>
                {/* Close panel toggle for mobile overlays */}
                <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 md:hidden">
                  <span className="text-xs font-bold text-slate-700">Chi tiết cuộc trao đổi</span>
                  <button
                    onClick={() => setMobileView('chat')}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <X size={16} />
                  </button>
                </div>

                <TradeInfoPanel conversation={activeConv} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
