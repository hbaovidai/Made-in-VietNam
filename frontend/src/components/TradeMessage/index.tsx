import React, { useState, useEffect } from 'react';
import { TradeMessageButton } from './TradeMessageButton';
import { TradeMessageModal } from './TradeMessageModal';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

export function TradeMessenger() {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get(`/messages/conversations/${user.id}`);
        const total = res.data.reduce((sum: number, convo: any) => sum + (convo.unreadCount || 0), 0);
        setUnreadCount(total);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    fetchUnreadCount();
    // Poll every 15 seconds to keep it updated
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, isOpen]);

  // Handle open-trade-chat custom event
  useEffect(() => {
    const handleOpenChat = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const { supplierUserId, initialMessage } = customEvent.detail || {};
      if (!supplierUserId || !isAuthenticated) return;

      setIsOpen(true);
      setIsMinimized(false);

      try {
        const convoRes = await api.post('/messages/conversations', {
          targetUserId: supplierUserId,
          initialMessage: initialMessage || 'Xin chào! 👋',
        });
        if (convoRes.data?.id) {
          setSelectedConvoId(convoRes.data.id);
        }
      } catch (err) {
        console.error('Failed to create/get conversation from event', err);
      }
    };

    window.addEventListener('open-trade-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-trade-chat', handleOpenChat);
    };
  }, [isAuthenticated]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimizeToggle = (minimized: boolean) => {
    setIsMinimized(minimized);
  };

  return (
    <>
      {/* Show floating button only when messenger is closed */}
      {!isOpen && (
        <TradeMessageButton onClick={handleOpen} unreadCount={unreadCount} />
      )}

      {/* Show messenger workspace when open */}
      <TradeMessageModal
        isOpen={isOpen}
        onClose={handleClose}
        isMinimized={isMinimized}
        onMinimizeToggle={handleMinimizeToggle}
        selectedId={selectedConvoId}
        onSelectId={(id) => setSelectedConvoId(id)}
      />
    </>
  );
}
export default TradeMessenger;
