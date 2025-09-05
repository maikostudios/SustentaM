import React, { useEffect } from 'react';
import { CalendarDaysIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { logger } from '../../utils/logger';

export type CalendarViewType = 'traditional' | 'matrix';

interface CalendarViewSelectorProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

export function CalendarViewSelector({ currentView, onViewChange }: CalendarViewSelectorProps) {
  useEffect(() => {
    logger.info('CalendarViewSelector', 'Componente CalendarViewSelector montado', { currentView });
  }, []);

  useEffect(() => {
    logger.debug('CalendarViewSelector', 'Vista actual cambiada', { currentView });
  }, [currentView]);

  const handleViewChange = (view: CalendarViewType) => {
    logger.info('CalendarViewSelector', 'Usuario cambió vista', { from: currentView, to: view });
    onViewChange(view);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => handleViewChange('traditional')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'traditional'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <CalendarDaysIcon className="w-4 h-4" />
        <span>Vista Tradicional</span>
      </button>

      <button
        onClick={() => handleViewChange('matrix')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'matrix'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <TableCellsIcon className="w-4 h-4" />
        <span>Vista Matriz</span>
      </button>
    </div>
  );
}
