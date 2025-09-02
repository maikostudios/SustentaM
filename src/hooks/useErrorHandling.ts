import { useState, useCallback, useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/ToastContext';

// Tipos de errores
export type ErrorType = 
  | 'network' 
  | 'validation' 
  | 'authentication' 
  | 'authorization' 
  | 'not_found' 
  | 'server' 
  | 'client' 
  | 'unknown';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  retryable?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export interface ErrorHandlingConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  showUserNotifications: boolean;
  logToConsole: boolean;
  logToStorage: boolean;
  reportToServer: boolean;
}

const DEFAULT_CONFIG: ErrorHandlingConfig = {
  enableLogging: true,
  enableReporting: true,
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  showUserNotifications: true,
  logToConsole: process.env.NODE_ENV === 'development',
  logToStorage: true,
  reportToServer: process.env.NODE_ENV === 'production'
};

// Hook principal para manejo de errores
export function useErrorHandling(config: Partial<ErrorHandlingConfig> = {}) {
  const [errors, setErrors] = useState<AppError[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const notifications = useNotifications();
  const configRef = useRef({ ...DEFAULT_CONFIG, ...config });
  const sessionId = useRef(crypto.randomUUID());

  // Generar ID único para errores
  const generateErrorId = useCallback(() => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Obtener contexto del error
  const getErrorContext = useCallback(() => {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: sessionId.current,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : undefined
    };
  }, []);

  // Clasificar tipo de error
  const classifyError = useCallback((error: Error | string): { type: ErrorType; severity: ErrorSeverity } => {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? '' : error.stack || '';

    // Network errors
    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
      return { type: 'network', severity: 'medium' };
    }

    // Authentication errors
    if (message.includes('unauthorized') || message.includes('authentication') || message.includes('login')) {
      return { type: 'authentication', severity: 'high' };
    }

    // Authorization errors
    if (message.includes('forbidden') || message.includes('permission') || message.includes('access denied')) {
      return { type: 'authorization', severity: 'high' };
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return { type: 'validation', severity: 'low' };
    }

    // Not found errors
    if (message.includes('not found') || message.includes('404')) {
      return { type: 'not_found', severity: 'medium' };
    }

    // Server errors
    if (message.includes('500') || message.includes('server error') || message.includes('internal')) {
      return { type: 'server', severity: 'high' };
    }

    // React errors
    if (stack.includes('React') || stack.includes('Component')) {
      return { type: 'client', severity: 'medium' };
    }

    // Critical errors
    if (message.includes('critical') || message.includes('fatal') || stack.includes('ReferenceError')) {
      return { type: 'unknown', severity: 'critical' };
    }

    return { type: 'unknown', severity: 'medium' };
  }, []);

  // Logging de errores
  const logError = useCallback((error: AppError) => {
    const config = configRef.current;

    // Log a consola
    if (config.logToConsole) {
      console.group(`🚨 Error [${error.severity.toUpperCase()}] - ${error.type}`);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Context:', error.context);
      if (error.stack) console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // Log a localStorage
    if (config.logToStorage) {
      try {
        const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
        const logs = [...existingLogs, error].slice(-100); // Mantener solo los últimos 100
        localStorage.setItem('error_logs', JSON.stringify(logs));
      } catch (e) {
        console.warn('Failed to save error to localStorage:', e);
      }
    }

    // Reportar al servidor (simulado)
    if (config.reportToServer && error.severity !== 'low') {
      // En una implementación real, esto enviaría el error a un servicio como Sentry
      console.log('📡 Reporting error to server:', error.id);
    }
  }, []);

  // Mostrar notificación al usuario
  const showUserNotification = useCallback((error: AppError) => {
    const config = configRef.current;
    
    if (!config.showUserNotifications) return;

    const getUserMessage = (error: AppError): { title: string; message: string } => {
      switch (error.type) {
        case 'network':
          return {
            title: 'Error de Conexión',
            message: 'Verifica tu conexión a internet e inténtalo nuevamente.'
          };
        case 'authentication':
          return {
            title: 'Error de Autenticación',
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          };
        case 'authorization':
          return {
            title: 'Acceso Denegado',
            message: 'No tienes permisos para realizar esta acción.'
          };
        case 'validation':
          return {
            title: 'Error de Validación',
            message: error.details || 'Por favor, verifica los datos ingresados.'
          };
        case 'not_found':
          return {
            title: 'Recurso No Encontrado',
            message: 'El elemento solicitado no existe o ha sido eliminado.'
          };
        case 'server':
          return {
            title: 'Error del Servidor',
            message: 'Ha ocurrido un error en el servidor. Inténtalo más tarde.'
          };
        default:
          return {
            title: 'Error Inesperado',
            message: 'Ha ocurrido un error inesperado. Si persiste, contacta al soporte.'
          };
      }
    };

    const { title, message } = getUserMessage(error);

    if (error.severity === 'critical') {
      notifications.error(title, message, {
        persistent: true,
        action: {
          label: 'Recargar Página',
          onClick: () => window.location.reload()
        }
      });
    } else if (error.severity === 'high') {
      notifications.error(title, message, { persistent: true });
    } else if (error.severity === 'medium') {
      notifications.warning(title, message);
    } else {
      notifications.info(title, message);
    }
  }, [notifications]);

  // Función principal para manejar errores
  const handleError = useCallback((
    error: Error | string,
    context?: Record<string, any>,
    options?: {
      retryable?: boolean;
      maxRetries?: number;
      showNotification?: boolean;
      severity?: ErrorSeverity;
      type?: ErrorType;
    }
  ): AppError => {
    const { type, severity } = options?.type && options?.severity 
      ? { type: options.type, severity: options.severity }
      : classifyError(error);

    const appError: AppError = {
      id: generateErrorId(),
      type,
      severity,
      message: typeof error === 'string' ? error : error.message,
      details: typeof error === 'string' ? undefined : error.stack,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: new Date(),
      context: { ...getErrorContext(), ...context },
      retryable: options?.retryable ?? (type === 'network' || type === 'server'),
      retryCount: 0,
      maxRetries: options?.maxRetries ?? configRef.current.maxRetries
    };

    setErrors(prev => [...prev, appError]);

    if (configRef.current.enableLogging) {
      logError(appError);
    }

    if (options?.showNotification !== false) {
      showUserNotification(appError);
    }

    return appError;
  }, [classifyError, generateErrorId, getErrorContext, logError, showUserNotification]);

  // Función para reintentar operaciones
  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    errorId?: string,
    customRetries?: number
  ): Promise<T> => {
    const config = configRef.current;
    const maxRetries = customRetries ?? config.maxRetries;
    let lastError: Error;

    setIsRetrying(true);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setIsRetrying(false);
        
        // Si había un error previo y ahora funciona, notificar éxito
        if (errorId) {
          notifications.success('Operación Exitosa', 'La operación se completó correctamente.');
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Esperar antes del siguiente intento
          await new Promise(resolve => 
            setTimeout(resolve, config.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    setIsRetrying(false);
    throw lastError!;
  }, [notifications]);

  // Limpiar errores antiguos
  const clearErrors = useCallback((olderThan?: Date) => {
    if (olderThan) {
      setErrors(prev => prev.filter(error => error.timestamp > olderThan));
    } else {
      setErrors([]);
    }
  }, []);

  // Obtener estadísticas de errores
  const getErrorStats = useCallback(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const recent = errors.filter(e => e.timestamp > last24h);
    const critical = errors.filter(e => e.severity === 'critical');
    const byType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<ErrorType, number>);

    return {
      total: errors.length,
      last24h: recent.length,
      lastHour: errors.filter(e => e.timestamp > lastHour).length,
      critical: critical.length,
      byType,
      mostCommon: Object.entries(byType).sort(([,a], [,b]) => b - a)[0]?.[0] as ErrorType
    };
  }, [errors]);

  // Limpiar errores antiguos automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      clearErrors(oneWeekAgo);
    }, 60 * 60 * 1000); // Cada hora

    return () => clearInterval(interval);
  }, [clearErrors]);

  return {
    // Estado
    errors,
    isRetrying,
    
    // Funciones principales
    handleError,
    retryOperation,
    clearErrors,
    
    // Utilidades
    getErrorStats,
    
    // Configuración
    updateConfig: (newConfig: Partial<ErrorHandlingConfig>) => {
      configRef.current = { ...configRef.current, ...newConfig };
    }
  };
}

// Hook para manejo de errores asíncronos
export function useAsyncError() {
  const { handleError } = useErrorHandling();

  const executeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return { executeAsync };
}

// Hook para manejo de errores en formularios
export function useFormErrorHandling() {
  const { handleError } = useErrorHandling();

  const handleFormError = useCallback((
    error: Error | string,
    fieldName?: string,
    formData?: Record<string, any>
  ) => {
    return handleError(error, {
      formField: fieldName,
      formData: formData ? Object.keys(formData) : undefined
    }, {
      type: 'validation',
      severity: 'low',
      showNotification: false
    });
  }, [handleError]);

  return { handleFormError };
}
