import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface TradeMessageButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

export function TradeMessageButton({ onClick, unreadCount = 3 }: TradeMessageButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9998] select-none">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-150">
          Trade Message / Tin nhắn giao dịch
          {/* Arrow */}
          <div className="absolute top-full right-5 -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        aria-label="Open Trade Messenger"
      >
        <MessageSquare size={26} className="group-hover:rotate-6 transition-transform" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
