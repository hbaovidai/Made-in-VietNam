import React, { useState, useMemo } from 'react';
import { Conversation } from './types';
import { ConversationItem } from './ConversationItem';
import { Search, MessageSquare, Filter } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

type TabType = 'all' | 'unread' | 'starred';

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // 1. Filter by Search Query
      const matchesSearch =
        conv.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.inquiryId.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filter by Tab
      if (activeTab === 'unread') return conv.unreadCount > 0;
      if (activeTab === 'starred') return !!conv.isStarred;

      return true;
    });
  }, [conversations, searchQuery, activeTab]);

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* List Header */}
      <div className="p-4 border-b border-slate-200 shrink-0">

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Tìm cuộc trò chuyện, RFQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-2 pt-1 border-b border-slate-100 flex gap-1 shrink-0 bg-slate-50/50">
        {(['all', 'unread', 'starred'] as TabType[]).map((tab) => {
          const label = tab === 'all' ? 'Tất cả' : tab === 'unread' ? 'Chưa đọc' : 'Đã đánh dấu';
          const count = 
            tab === 'unread' 
              ? conversations.filter(c => c.unreadCount > 0).length 
              : tab === 'starred' 
                ? conversations.filter(c => c.isStarred).length
                : conversations.length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[11px] font-bold text-center border-b-2 transition-all relative ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-md'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{label}</span>
              {count > 0 && tab !== 'all' && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conversations List Scrollable */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === selectedId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Filter size={24} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-semibold">Không tìm thấy cuộc hội thoại nào</p>
            <p className="text-[10px] text-slate-400 mt-1">Thử đặt lại tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
}
