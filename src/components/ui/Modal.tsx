import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus management
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }

      // Escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop con transición suave */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal container con sombras sutiles y bordes redondeados 4px */}
        <div
          ref={modalRef}
          className={clsx(
            'relative transform overflow-hidden',
            'bg-background-secondary dark:bg-dark-secondary',
            'rounded-lg border border-border-light dark:border-dark-border',
            'shadow-lg transition-all duration-300',
            'px-6 pb-6 pt-6 text-left',
            'sm:my-8 sm:w-full',
            sizeClasses[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header con tipografía consistente */}
          <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-dark-border">
            <h3
              id="modal-title"
              className="font-sans text-xl font-bold text-text-primary dark:text-dark-primary"
            >
              {title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 -mr-2"
              aria-label="Cerrar modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Content con espaciado consistente */}
          <div className="mt-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}