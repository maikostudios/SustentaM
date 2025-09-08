import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  position = 'bottom-right',
  persistent = false,
  action,
  onClose
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const theme = useThemeAware();

  useEffect(() => {
    // Entrada con delay para animación
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto-close solo si no es persistente
    let hideTimer: NodeJS.Timeout;
    if (!persistent && duration > 0) {
      hideTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [id, duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      success: `${theme.bg} border-green-200 dark:border-green-700 ${theme.text} shadow-lg`,
      error: `${theme.bg} border-red-200 dark:border-red-700 ${theme.text} shadow-lg`,
      warning: `${theme.bg} border-orange-200 dark:border-orange-700 ${theme.text} shadow-lg`,
      info: `${theme.bg} border-blue-200 dark:border-blue-700 ${theme.text} shadow-lg`
    };
    return baseStyles[type];
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position];
  };

  const getAnimationClasses = () => {
    const isTopPosition = position.includes('top');
    const isLeftPosition = position.includes('left');
    const isCenterPosition = position.includes('center');

    if (isCenterPosition) {
      return isVisible && !isExiting
        ? 'translate-y-0 opacity-100 scale-100'
        : `${isTopPosition ? '-translate-y-2' : 'translate-y-2'} opacity-0 scale-95`;
    }

    if (isLeftPosition) {
      return isVisible && !isExiting
        ? 'translate-x-0 opacity-100'
        : '-translate-x-full opacity-0';
    }

    return isVisible && !isExiting
      ? 'translate-x-0 opacity-100'
      : 'translate-x-full opacity-0';
  };

  return createPortal(
    <div
      className={`fixed ${getPositionClasses()} max-w-sm w-full transition-all duration-300 ease-in-out transform z-50 ${getAnimationClasses()}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getStyles()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{title}</p>
            {message && (
              <p className="text-sm opacity-90 mt-1">{message}</p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="text-sm font-medium underline hover:no-underline mt-2 block"
              >
                {action.label}
              </button>
            )}
          </div>
          {!persistent && (
            <button
              onClick={handleClose}
              className={`flex-shrink-0 ${theme.textMuted} hover:${theme.text} transition-colors`}
              aria-label="Cerrar notificación"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar para toasts con duración */}
        {!persistent && duration > 0 && (
          <div className={`mt-3 h-1 ${theme.bgSecondary} rounded-full overflow-hidden`}>
            <div
              className={`h-full ${theme.textMuted} opacity-60 transition-all ease-linear`}
              style={{
                width: isVisible ? '0%' : '100%',
                transitionDuration: `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const updateToast = (id: string, updates: Partial<Omit<ToastProps, 'id' | 'onClose'>>) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  };

  // Métodos de conveniencia
  const success = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'info', title, message, ...options });
  };

  // Agrupar toasts por posición para renderizado
  const groupedToasts = toasts.reduce((groups, toast) => {
    const position = toast.position || 'bottom-right';
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(toast);
    return groups;
  }, {} as Record<ToastPosition, ToastProps[]>);

  const ToastContainer = () => (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className="fixed pointer-events-none z-50">
          {positionToasts.map((toast, index) => (
            <div
              key={toast.id}
              className="pointer-events-auto"
              style={{
                marginBottom: position.includes('bottom') ? `${index * 8}px` : undefined,
                marginTop: position.includes('top') ? `${index * 8}px` : undefined,
              }}
            >
              <Toast {...toast} />
            </div>
          ))}
        </div>
      ))}
    </>
  );

  return {
    addToast,
    removeToast,
    removeAllToasts,
    updateToast,
    success,
    error,
    warning,
    info,
    ToastContainer,
    toasts
  };
}