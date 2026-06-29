import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAppearance } from '../contexts/AppearanceContext';

interface PopupData {
  image: string;
  title: string;
  message: string;
  link: string;
  buttonText: string;
  showOnce: boolean;
  startDate: string;
  endDate: string;
}

export function PromoPopup() {
  const { settings } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Parse popup data
  const popupData: PopupData | null = React.useMemo(() => {
    if (settings.popup_enabled !== 'true' || !settings.popup_data) return null;
    try {
      return JSON.parse(settings.popup_data);
    } catch {
      return null;
    }
  }, [settings.popup_enabled, settings.popup_data]);

  useEffect(() => {
    if (!popupData) {
      setIsOpen(false);
      return;
    }

    // 1. Check Date Active (Local Date string-based comparison to prevent timezone issues)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (popupData.startDate && popupData.startDate > todayStr) return;
    if (popupData.endDate && popupData.endDate < todayStr) return;

    // 2. Check "Show Once" from sessionStorage using title/message hash to reset when changed
    if (popupData.showOnce) {
      const dismissKey = `promo_popup_seen_${popupData.title || ''}_${popupData.message || ''}`;
      if (sessionStorage.getItem(dismissKey) === 'true') {
        return;
      }
    }

    // Delay showing popup slightly for better user experience (1s)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [popupData]);

  if (!isOpen || !popupData) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (popupData.showOnce) {
      const dismissKey = `promo_popup_seen_${popupData.title || ''}_${popupData.message || ''}`;
      sessionStorage.setItem(dismissKey, 'true');
    }
  };

  const handleAction = () => {
    handleClose();
    if (popupData.link) {
      if (popupData.link.startsWith('http')) {
        window.open(popupData.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(popupData.link);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 scale-100 flex flex-col animate-[scaleIn_0.3s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Close promotion dialog"
        >
          <X size={18} />
        </button>

        {/* Banner Image */}
        {popupData.image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
            <img 
              src={popupData.image} 
              alt={popupData.title || 'Khuyến mãi'} 
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          // Fallback simple header gradient if no image uploaded
          <div className="h-24 w-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white text-3xl">
            ✨
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {popupData.title || 'Thông báo mới!'}
          </h3>
          <p className="text-sm text-slate-600 mb-6 whitespace-pre-line leading-relaxed">
            {popupData.message}
          </p>

          {/* Action Button */}
          <button
            onClick={handleAction}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--color-primary, #003366)',
              boxShadow: '0 4px 12px var(--color-primary-light, rgba(0, 51, 102, 0.2))' 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light, #004080)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary, #003366)'}
          >
            {popupData.buttonText || 'Xem ngay'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
