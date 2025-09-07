import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { clsx } from 'clsx';
import { useThemeAware } from '../../hooks/useTheme';

interface UnifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'confirm' | 'warning' | 'success' | 'info';
  
  // Para variant 'confirm'
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmVariant?: 'primary' | 'secondary' | 'warning' | 'error';
  
  // Configuración adicional
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  preventClose?: boolean;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-4xl'
};

const variantIcons = {
  confirm: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  default: null
};

const variantColors = {
  confirm: 'text-warning-500',
  warning: 'text-warning-500',
  success: 'text-secondary-500',
  info: 'text-primary-500',
  default: 'text-primary-500'
};

export function UnifiedModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  closeOnBackdrop = true,
  showCloseButton = true,
  preventClose = false
}: UnifiedModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = useThemeAware();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus en el modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, preventClose]);

  const handleBackdropClick = () => {
    if (closeOnBackdrop && !preventClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  const IconComponent = variantIcons[variant];
  const iconColor = variantColors[variant];

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
        
        {/* Modal container */}
        <div
          ref={modalRef}
          className={clsx(
            'relative transform overflow-hidden',
            `${theme.bg} border ${theme.border}`,
            'rounded-lg shadow-lg transition-all duration-300',
            'px-6 pb-6 pt-6 text-left',
            'sm:my-8 sm:w-full',
            sizeClasses[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* Header */}
          <div className={`flex items-center justify-between pb-4 border-b ${theme.border}`}>
            <div className="flex items-center">
              {IconComponent && (
                <IconComponent className={`w-6 h-6 mr-3 ${iconColor}`} />
              )}
              <h3 
                id="modal-title" 
                className={`font-sans text-xl font-bold ${theme.text}`}
              >
                {title}
              </h3>
            </div>
            
            {showCloseButton && !preventClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 -mr-2"
                aria-label="Cerrar modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          {/* Content */}
          <div className="mt-6">
            {children}
          </div>
          
          {/* Footer para variant confirm */}
          {variant === 'confirm' && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Componentes de conveniencia para casos específicos
export function ConfirmModal(props: Omit<UnifiedModalProps, 'variant'>) {
  return <UnifiedModal {...props} variant="confirm" />;
}

export function WarningModal(props: Omit<UnifiedModalProps, 'variant'>) {
  return <UnifiedModal {...props} variant="warning" />;
}

export function SuccessModal(props: Omit<UnifiedModalProps, 'variant'>) {
  return <UnifiedModal {...props} variant="success" />;
}

export function InfoModal(props: Omit<UnifiedModalProps, 'variant'>) {
  return <UnifiedModal {...props} variant="info" />;
}
