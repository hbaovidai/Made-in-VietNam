import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

// ============================================================
// Modal Component
// ============================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

const SIZE_MAP = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
  hideCloseButton = false,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          'relative bg-canvas border border-hairline w-full animate-modal-content',
          'max-h-[90vh] flex flex-col',
          SIZE_MAP[size]
        )}
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-hairline">
            <div className="flex-1 min-w-0">
              {title && <h3 className="text-lg font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{title}</h3>}
              {description && <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{description}</p>}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="shrink-0 p-2 -mr-2 -mt-1 text-ink-subtle hover:text-ink hover:bg-surface-2 active:scale-95 transition-all"
                style={{ borderRadius: 0 }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-hairline flex items-center justify-end gap-3 bg-surface-1" style={{ borderRadius: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Confirm Dialog — Convenience wrapper
// ============================================================
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'danger',
}: ConfirmDialogProps) {
  const confirmClass = variant === 'danger' ? 'btn-danger' : variant === 'warning' ? 'btn-gold' : 'btn-primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost" style={{ borderRadius: 0 }}>
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={confirmClass}
            style={{ borderRadius: 0 }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-sm text-ink-muted leading-relaxed" style={{ letterSpacing: '0.16px' }}>{message}</p>
    </Modal>
  );
}
