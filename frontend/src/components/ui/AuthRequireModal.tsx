import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthRequireModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function AuthRequireModal({ isOpen, onClose, message }: AuthRequireModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { from: location } });
  };

  const handleRegister = () => {
    onClose();
    navigate('/register', { state: { from: location } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8 mt-2">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <LogIn size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('login_to_continue')}</h3>
          <p className="text-sm text-slate-500">
            {message || t('login_prompt_msg')}
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors shadow-sm"
          >
            {t('login_now')}
          </button>
          <button 
            onClick={handleRegister}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            {t('create_new_account')}
          </button>
        </div>
      </div>
    </div>
  );
}
