import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorType, ErrorSeverity } from '../../hooks/useErrorHandling';
import { Button } from '../ui/Button';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  HomeIcon,
  BugAntIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  showErrorDetails?: boolean;
  level?: 'page' | 'section' | 'component';
  name?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      errorInfo,
      errorId
    });

    // Crear objeto de error estructurado
    const appError: AppError = {
      id: errorId,
      type: this.classifyError(error),
      severity: this.getSeverity(error),
      message: error.message,
      details: error.stack,
      stack: error.stack,
      timestamp: new Date(),
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.name || 'Unknown',
        level: this.props.level || 'component',
        retryCount: this.state.retryCount,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    // Llamar callback de error si existe
    this.props.onError?.(appError);

    // Log del error
    console.group(`🚨 Error Boundary [${this.props.name || 'Unknown'}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Reportar error crítico
    if (appError.severity === 'critical') {
      this.reportCriticalError(appError);
    }
  }

  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('chunk') || message.includes('loading')) {
      return 'network';
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'authorization';
    }
    if (stack.includes('react') || stack.includes('component')) {
      return 'client';
    }
    return 'unknown';
  }

  private getSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }
    if (this.props.level === 'page') {
      return 'high';
    }
    if (this.props.level === 'section') {
      return 'medium';
    }
    return 'low';
  }

  private reportCriticalError(error: AppError) {
    // En una implementación real, esto enviaría el error a un servicio de monitoreo
    console.error('🔥 Critical Error Reported:', error);
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));

    // Auto-retry después de un delay
    this.retryTimeoutId = window.setTimeout(() => {
      if (this.state.hasError) {
        this.handleRetry();
      }
    }, 2000 * Math.pow(2, this.state.retryCount));
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorToClipboard = async () => {
    const errorDetails = {
      id: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      // Mostrar feedback visual
      console.log('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { enableRetry = true, maxRetries = 3, showErrorDetails = false } = this.props;
      const canRetry = enableRetry && this.state.retryCount < maxRetries;
      const isPageLevel = this.props.level === 'page';

      return (
        <div className={`flex items-center justify-center p-8 ${
          isPageLevel ? 'min-h-screen bg-gray-50' : 'min-h-96 bg-red-50 border border-red-200 rounded-lg'
        }`}>
          <div className="text-center max-w-md">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
              isPageLevel ? 'bg-red-100' : 'bg-red-200'
            } mb-4`}>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>

            <h2 className={`${isPageLevel ? 'text-2xl' : 'text-lg'} font-bold text-gray-900 mb-2`}>
              {isPageLevel ? 'Algo salió mal' : 'Error en el componente'}
            </h2>

            <p className="text-gray-600 mb-6">
              {isPageLevel 
                ? 'Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.'
                : 'Este componente no se pudo cargar correctamente.'
              }
            </p>

            {showErrorDetails && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-2">Detalles del Error:</h4>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorId && (
                  <p className="text-xs text-gray-500 mt-2">
                    ID: {this.state.errorId}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  className="flex items-center"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Reintentar {this.state.retryCount > 0 && `(${this.state.retryCount}/${maxRetries})`}
                </Button>
              )}

              {isPageLevel ? (
                <>
                  <Button
                    onClick={this.handleReload}
                    variant="secondary"
                    className="flex items-center"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Recargar Página
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    variant="ghost"
                    className="flex items-center"
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Ir al Inicio
                  </Button>
                </>
              ) : (
                <Button
                  onClick={this.handleReload}
                  variant="secondary"
                  className="flex items-center"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Recargar
                </Button>
              )}

              {showErrorDetails && (
                <Button
                  onClick={this.copyErrorToClipboard}
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                  Copiar Error
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  <BugAntIcon className="h-4 w-4 inline mr-1" />
                  Detalles de Desarrollo
                </summary>
                <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs font-mono overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error?.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">{this.state.error?.stack}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver componentes con Error Boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook para usar Error Boundary programáticamente
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const captureError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    setError(errorObj);
  }, []);

  return { captureError };
}
