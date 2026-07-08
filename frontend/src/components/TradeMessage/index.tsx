import React, { useState } from 'react';
import { TradeMessageButton } from './TradeMessageButton';
import { TradeMessageModal } from './TradeMessageModal';
import { useAuth } from '../../contexts/AuthContext';
export function TradeMessenger() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
        <TradeMessageButton onClick={handleOpen} unreadCount={isAuthenticated ? 3 : 0} />
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
