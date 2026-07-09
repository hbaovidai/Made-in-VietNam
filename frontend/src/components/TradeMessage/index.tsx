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
      />
    </>
  );
}
export default TradeMessenger;
