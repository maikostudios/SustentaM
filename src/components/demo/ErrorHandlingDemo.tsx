import React, { useState, useCallback } from 'react';
import { useErrorHandling, useAsyncError, useFormErrorHandling } from '../../hooks/useErrorHandling';
import { useLogger } from '../../services/errorLogger';
import { ErrorBoundary, useErrorBoundary } from '../error/ErrorBoundary';
import { Button } from '../ui/Button';
import { 
  ExclamationTriangleIcon, 
  BugAntIcon, 
  ShieldExclamationIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Componente que falla intencionalmente
function FailingComponent({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) {
    throw new Error('Este es un error intencional para demostrar el Error Boundary');
  }
  return <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
    ✅ Componente funcionando correctamente
  </div>;
}

// Componente que simula operaciones asíncronas
function AsyncOperationDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { executeAsync } = useAsyncError();
  const { retryOperation } = useErrorHandling();

  const simulateNetworkCall = useCallback(async (shouldFail: boolean = false) => {
    setLoading(true);
    setResult(null);

    const operation = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (shouldFail) {
        throw new Error('Simulación de error de red');
      }
      return 'Operación completada exitosamente';
    };

    const result = await executeAsync(operation, { operation: 'network-simulation' });
    setResult(result);
    setLoading(false);
  }, [executeAsync]);

  const simulateRetryOperation = useCallback(async () => {
    setLoading(true);
    setResult(null);

    try {
      let attempts = 0;
      const result = await retryOperation(async () => {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
        if (attempts < 3) {
          throw new Error(`Intento ${attempts} falló`);
        }
        return `Éxito después de ${attempts} intentos`;
      });
      setResult(result);
    } catch (error) {
      setResult('Operación falló después de todos los reintentos');
    } finally {
      setLoading(false);
    }
  }, [retryOperation]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Operaciones Asíncronas</h4>
      <div className="flex space-x-2">
        <Button
          onClick={() => simulateNetworkCall(false)}
          disabled={loading}
          size="sm"
        >
          Operación Exitosa
        </Button>
        <Button
          onClick={() => simulateNetworkCall(true)}
          disabled={loading}
          variant="danger"
          size="sm"
        >
          Simular Error
        </Button>
        <Button
          onClick={simulateRetryOperation}
          disabled={loading}
          variant="secondary"
          size="sm"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Con Reintentos
        </Button>
      </div>
      {loading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm">Procesando...</span>
        </div>
      )}
      {result && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">
          {result}
        </div>
      )}
    </div>
  );
}

// Componente para demostrar logging
function LoggingDemo() {
  const logger = useLogger();
  const [logs, setLogs] = useState<any[]>([]);

  const refreshLogs = useCallback(() => {
    const recentLogs = logger.getLogs(undefined, 10);
    setLogs(recentLogs);
  }, [logger]);

  const generateLogs = useCallback(() => {
    logger.debug('Este es un mensaje de debug', { component: 'LoggingDemo' });
    logger.info('Información importante', { action: 'user-interaction' });
    logger.warn('Advertencia sobre algo', { warning: 'potential-issue' });
    logger.error('Error simulado', { error: 'simulation' });
    refreshLogs();
  }, [logger, refreshLogs]);

  const clearLogs = useCallback(() => {
    logger.clearLogs();
    setLogs([]);
  }, [logger]);

  React.useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  const stats = logger.getStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Sistema de Logging</h4>
        <div className="flex space-x-2">
          <Button onClick={generateLogs} size="sm">
            Generar Logs
          </Button>
          <Button onClick={refreshLogs} variant="secondary" size="sm">
            Actualizar
          </Button>
          <Button onClick={clearLogs} variant="ghost" size="sm">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-blue-900 font-medium text-sm">Total</div>
          <div className="text-blue-700 text-lg font-bold">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-green-900 font-medium text-sm">Últimas 24h</div>
          <div className="text-green-700 text-lg font-bold">{stats.last24h}</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-yellow-900 font-medium text-sm">Última hora</div>
          <div className="text-yellow-700 text-lg font-bold">{stats.lastHour}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-red-900 font-medium text-sm">En cola</div>
          <div className="text-red-700 text-lg font-bold">{stats.queueSize}</div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
        <h5 className="font-medium text-gray-900 mb-2">Logs Recientes</h5>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay logs disponibles</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="text-xs font-mono">
                <span className={`inline-block px-2 py-1 rounded text-white text-xs font-bold mr-2 ${
                  log.level === 'error' ? 'bg-red-500' :
                  log.level === 'warn' ? 'bg-yellow-500' :
                  log.level === 'info' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}>
                  {log.level.toUpperCase()}
                </span>
                <span className="text-gray-600">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-gray-900 ml-2">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ErrorHandlingDemo() {
  const [activeDemo, setActiveDemo] = useState<'boundaries' | 'async' | 'logging' | 'stats'>('boundaries');
  const [shouldFail, setShouldFail] = useState(false);
  const { errors, getErrorStats, clearErrors } = useErrorHandling();
  const { captureError } = useErrorBoundary();

  const triggerProgrammaticError = useCallback(() => {
    captureError(new Error('Error capturado programáticamente'));
  }, [captureError]);

  const errorStats = getErrorStats();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShieldExclamationIcon className="w-6 h-6 mr-2" />
          Demo de Manejo de Errores
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Sistema robusto de manejo de errores con error boundaries, logging centralizado, 
          notificaciones de error y recuperación automática.
        </p>
      </div>

      {/* Selector de demo */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'boundaries', label: 'Error Boundaries', icon: ExclamationTriangleIcon },
          { id: 'async', label: 'Async Errors', icon: ArrowPathIcon },
          { id: 'logging', label: 'Logging', icon: DocumentTextIcon },
          { id: 'stats', label: 'Estadísticas', icon: ChartBarIcon }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveDemo(id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
              activeDemo === id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Error Boundaries Demo */}
      {activeDemo === 'boundaries' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-medium mb-4 flex items-center">
              <BugAntIcon className="h-5 w-5 mr-2" />
              Error Boundaries
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShouldFail(!shouldFail)}
                  variant={shouldFail ? "danger" : "secondary"}
                  size="sm"
                >
                  {shouldFail ? 'Reparar Componente' : 'Romper Componente'}
                </Button>
                
                <Button
                  onClick={triggerProgrammaticError}
                  variant="danger"
                  size="sm"
                >
                  Error Programático
                </Button>
              </div>

              <ErrorBoundary
                name="DemoErrorBoundary"
                level="section"
                enableRetry={true}
                maxRetries={3}
                showErrorDetails={true}
              >
                <FailingComponent shouldFail={shouldFail} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}

      {/* Async Errors Demo */}
      {activeDemo === 'async' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <AsyncOperationDemo />
          </div>
        </div>
      )}

      {/* Logging Demo */}
      {activeDemo === 'logging' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <LoggingDemo />
          </div>
        </div>
      )}

      {/* Estadísticas */}
      {activeDemo === 'stats' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Estadísticas de Errores</h4>
              <Button onClick={clearErrors} variant="ghost" size="sm">
                <TrashIcon className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-red-900 font-medium">Total de Errores</div>
                <div className="text-red-700 text-2xl font-bold">{errorStats.total}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-900 font-medium">Últimas 24h</div>
                <div className="text-orange-700 text-2xl font-bold">{errorStats.last24h}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-yellow-900 font-medium">Críticos</div>
                <div className="text-yellow-700 text-2xl font-bold">{errorStats.critical}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-gray-900">Errores por Tipo</h5>
              {Object.entries(errorStats.byType).length === 0 ? (
                <p className="text-gray-500 text-sm">No hay errores registrados</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(errorStats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errorStats.mostCommon && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-900 font-medium text-sm">Tipo más común:</div>
                <div className="text-blue-700 capitalize">{errorStats.mostCommon.replace('_', ' ')}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resumen de características */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="text-gray-900 font-medium mb-3 flex items-center">
          <ShieldExclamationIcon className="w-5 h-5 mr-2" />
          Características del Sistema de Manejo de Errores:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-gray-700 text-sm space-y-1">
            <li>✅ Error Boundaries con recuperación automática</li>
            <li>✅ Clasificación automática de errores</li>
            <li>✅ Logging centralizado con niveles</li>
            <li>✅ Reintentos automáticos configurables</li>
            <li>✅ Notificaciones de error contextuales</li>
            <li>✅ Captura de errores no manejados</li>
          </ul>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>✅ Persistencia en localStorage</li>
            <li>✅ Estadísticas y métricas de errores</li>
            <li>✅ Contexto detallado de errores</li>
            <li>✅ Hooks especializados por tipo</li>
            <li>✅ Configuración flexible</li>
            <li>✅ Modo desarrollo vs producción</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
