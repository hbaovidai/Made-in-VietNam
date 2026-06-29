import React from 'react';
import { Conversation } from './types';
import { Check, CheckCheck } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const isLastMessageBuyer = lastMessage?.sender === 'buyer';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left' as const, display: 'flex', alignItems: 'center',
        gap: 10, padding: '10px 12px', borderBottom: '1px solid #f1f5f9',
        background: isActive ? '#eff6ff' : 'transparent', cursor: 'pointer',
        borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
        border: 'none', borderRight: 'none',
        borderBlockEnd: '1px solid #f1f5f9',
        transition: 'background .15s',
      }}
      onMouseOver={e => { if (!isActive) (e.currentTarget.style.background = '#f8fafc'); }}
      onMouseOut={e => { if (!isActive) (e.currentTarget.style.background = 'transparent'); }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 12,
        background: conversation.avatarBg || '#2563eb',
      }}>
        {conversation.avatarText}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {conversation.supplierName}
          </span>
          <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, flexShrink: 0, marginLeft: 6 }}>
            {conversation.lastMessageTime}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isLastMessageBuyer && (
            <span style={{ flexShrink: 0, color: '#94a3b8', display: 'flex' }}>
              {lastMessage.status === 'read' ? <CheckCheck size={12} style={{ color: '#3b82f6' }} /> : <Check size={12} />}
            </span>
          )}
          <span style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastMessage?.type === 'file' ? '📁 Attached a file' :
             lastMessage?.type === 'quotation_summary' ? '📋 Quotation' :
             lastMessage?.content}
          </span>
        </div>
      </div>

      {/* Unread badge */}
      {conversation.unreadCount > 0 && (
        <span style={{
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
          background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {conversation.unreadCount}
        </span>
      )}
    </button>
  );
}
