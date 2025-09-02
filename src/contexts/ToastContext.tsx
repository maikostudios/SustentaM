import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, ToastType, ToastPosition } from '../components/ui/Toast';

interface ToastContextType {
  addToast: (toast: {
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
  }) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
  updateToast: (id: string, updates: any) => void;
  success: (title: string, message?: string, options?: any) => string;
  error: (title: string, message?: string, options?: any) => string;
  warning: (title: string, message?: string, options?: any) => string;
  info: (title: string, message?: string, options?: any) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  defaultPosition = 'bottom-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const toast = useToast();

  // Limitar número máximo de toasts
  const addToastWithLimit = (toastData: any) => {
    if (toast.toasts.length >= maxToasts) {
      // Remover el toast más antiguo
      const oldestToast = toast.toasts[0];
      if (oldestToast) {
        toast.removeToast(oldestToast.id);
      }
    }
    
    return toast.addToast({
      position: defaultPosition,
      ...toastData
    });
  };

  const contextValue: ToastContextType = {
    addToast: addToastWithLimit,
    removeToast: toast.removeToast,
    removeAllToasts: toast.removeAllToasts,
    updateToast: toast.updateToast,
    success: (title, message, options) => addToastWithLimit({ 
      type: 'success', 
      title, 
      message, 
      ...options 
    }),
    error: (title, message, options) => addToastWithLimit({ 
      type: 'error', 
      title, 
      message, 
      persistent: true, // Los errores son persistentes por defecto
      ...options 
    }),
    warning: (title, message, options) => addToastWithLimit({ 
      type: 'warning', 
      title, 
      message, 
      ...options 
    }),
    info: (title, message, options) => addToastWithLimit({ 
      type: 'info', 
      title, 
      message, 
      ...options 
    })
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <toast.ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

// Hook de conveniencia que funciona tanto con contexto como sin él
export function useNotifications() {
  try {
    return useToastContext();
  } catch {
    // Fallback si no hay contexto
    const toast = useToast();
    return {
      addToast: toast.addToast,
      removeToast: toast.removeToast,
      removeAllToasts: toast.removeAllToasts,
      updateToast: toast.updateToast,
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info
    };
  }
}

// Utilidades para notificaciones comunes
export const NotificationTemplates = {
  saveSuccess: (itemName: string = 'elemento') => ({
    type: 'success' as ToastType,
    title: 'Guardado exitoso',
    message: `${itemName} se ha guardado correctamente.`,
    duration: 3000
  }),

  saveError: (error?: string) => ({
    type: 'error' as ToastType,
    title: 'Error al guardar',
    message: error || 'Ha ocurrido un error inesperado. Inténtalo nuevamente.',
    persistent: true
  }),

  deleteSuccess: (itemName: string = 'elemento') => ({
    type: 'success' as ToastType,
    title: 'Eliminado exitoso',
    message: `${itemName} se ha eliminado correctamente.`,
    duration: 3000
  }),

  deleteError: (error?: string) => ({
    type: 'error' as ToastType,
    title: 'Error al eliminar',
    message: error || 'No se pudo eliminar el elemento. Inténtalo nuevamente.',
    persistent: true
  }),

  uploadSuccess: (fileName: string) => ({
    type: 'success' as ToastType,
    title: 'Archivo subido',
    message: `${fileName} se ha subido correctamente.`,
    duration: 4000
  }),

  uploadError: (fileName: string, error?: string) => ({
    type: 'error' as ToastType,
    title: 'Error al subir archivo',
    message: error || `No se pudo subir ${fileName}.`,
    persistent: true
  }),

  networkError: () => ({
    type: 'error' as ToastType,
    title: 'Error de conexión',
    message: 'Verifica tu conexión a internet e inténtalo nuevamente.',
    persistent: true,
    action: {
      label: 'Reintentar',
      onClick: () => window.location.reload()
    }
  }),

  sessionExpired: () => ({
    type: 'warning' as ToastType,
    title: 'Sesión expirada',
    message: 'Tu sesión ha expirado. Serás redirigido al login.',
    persistent: true
  }),

  maintenanceMode: () => ({
    type: 'info' as ToastType,
    title: 'Mantenimiento programado',
    message: 'El sistema estará en mantenimiento en 10 minutos.',
    persistent: true
  })
};
