import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';
import { XMarkIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export function LogViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState(logger.getLogs());

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...logger.getLogs()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Ver logs de debug"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      case 'DEBUG': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold text-gray-900">🔍 Debug Logs</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              logger.clearLogs();
              setLogs([]);
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Limpiar logs"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Cerrar"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No hay logs disponibles
          </div>
        ) : (
          logs.slice(-50).map((log, index) => (
            <div key={index} className="border border-gray-200 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="font-medium text-gray-900 mb-1">
                [{log.component}] {log.message}
              </div>
              {log.data && (
                <div className="text-gray-600 bg-gray-50 p-1 rounded text-xs overflow-x-auto">
                  <pre>{JSON.stringify(log.data, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-600 text-center">
          Total logs: {logs.length} | Mostrando últimos 50
        </div>
      </div>
    </div>
  );
}
