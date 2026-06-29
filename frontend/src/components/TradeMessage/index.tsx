import React, { useState } from 'react';
import { TradeMessageButton } from './TradeMessageButton';
import { TradeMessageModal } from './TradeMessageModal';

export function TradeMessenger() {
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
        <TradeMessageButton onClick={handleOpen} unreadCount={3} />
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
