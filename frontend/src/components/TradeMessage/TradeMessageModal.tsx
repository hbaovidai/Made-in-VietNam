import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from './types';
import { mockConversations } from './mockData';
import { ConversationList } from './ConversationList';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TradeInfoPanel } from './TradeInfoPanel';
import { Minus, X, MessageSquare } from 'lucide-react';

interface TradeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimizeToggle: (minimized: boolean) => void;
  isMinimized: boolean;
}

export function TradeMessageModal({
  isOpen,
  onClose,
  onMinimizeToggle,
  isMinimized
}: TradeMessageModalProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string>('conv-1');
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [typingConvId, setTypingConvId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setMobileView('chat');

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
  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      type: 'text',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // 1. Append Buyer Message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Simulate Status changes: sent -> read after 1s
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMessage.id ? { ...m, status: 'read' as const } : m
              )
            };
          }
          return c;
        })
      );
    }, 1000);

    // 2. Simulate Supplier Typing & Autoreply
    setTypingConvId(selectedId);
    setTimeout(() => {
      setTypingConvId(null);

      // Generate context-aware reply
      let replyText = "Thank you for your message. Let me review this detail with our commercial department and get back to you with a formal update.";
      if (text.toLowerCase().includes('price') || text.toLowerCase().includes('discount') || text.toLowerCase().includes('cheap')) {
        replyText = `Regarding the target price, we want to support your order of ${activeConv.quantity}. Let me consult with the production director about raw material bulk discounts. I will send you an optimized offer today.`;
      } else if (text.toLowerCase().includes('sample') || text.toLowerCase().includes('test')) {
        replyText = "We would be happy to prepare physical samples for your inspection. Please confirm your delivery address and DHL/FedEx account number.";
      } else if (text.toLowerCase().includes('lead time') || text.toLowerCase().includes('delivery') || text.toLowerCase().includes('time')) {
        const quotMsg = activeConv.messages.find(m => m.type === 'quotation_summary');
        const leadTime = quotMsg?.quotationSummary?.leadTime || '15 days';
        replyText = `Our standard lead time for this volume is ${leadTime}. We can prioritize production scheduling if this is urgent.`;
      }

      const supplierReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'supplier',
        type: 'text',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, supplierReply]
            };
          }
          return c;
        })
      );
    }, 2200);
  };

  // Send Attachment logic
  const handleSendFile = (fileName: string, fileSize: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      type: 'file',
      fileInfo: {
        name: fileName,
        size: fileSize
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessage: `📁 Sent file: ${fileName}`,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Simulate reply to document
    setTypingConvId(selectedId);
    setTimeout(() => {
      setTypingConvId(null);
      const supplierReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'supplier',
        type: 'text',
        content: `Thank you for sharing the document: "${fileName}". Our engineering team will review these technical specifications immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessage: supplierReply.content,
              lastMessageTime: 'Just now',
              messages: [...c.messages, supplierReply]
            };
          }
          return c;
        })
      );
    }, 2000);
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
            Trade Messenger Workspace
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

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <div className="flex justify-center my-3 select-none">
              <span className="bg-slate-200/60 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Today
              </span>
            </div>

            {activeConv.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {typingConvId === activeConv.id && (
              <div className="flex flex-col mb-2 items-start animate-pulse">
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4, paddingLeft: 2 }}>
                  Supplier is typing...
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
        {showInfoPanel && (
          <div className={`shrink-0 w-full md:w-[240px] lg:w-[250px] h-full border-l border-slate-200 z-20 ${
            mobileView === 'chat' ? 'block md:block' : 'hidden md:block'
          }`}>
            {/* Close panel toggle for mobile overlays */}
            <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 md:hidden">
              <span className="text-xs font-bold text-slate-700">Inquiry Workspace Details</span>
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

      </div>
    </div>
  );
}
