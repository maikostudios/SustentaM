import React, { useState } from 'react';
import { clsx } from 'clsx';
import { FilterConfig } from '../../hooks/useAdvancedSearch';
import { Button } from '../ui/Button';
import { EnhancedInput } from '../ui/EnhancedInput';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';

interface AdvancedFiltersProps<T> {
  filterConfigs: FilterConfig<T>[];
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export function AdvancedFilters<T>({
  filterConfigs,
  filters,
  onFilterChange,
  onRemoveFilter,
  onClearFilters,
  className = ''
}: AdvancedFiltersProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  ).length;

  const basicFilters = filterConfigs.filter(config => 
    ['text', 'select'].includes(config.type)
  );
  
  const advancedFilters = filterConfigs.filter(config => 
    !['text', 'select'].includes(config.type)
  );

  const renderFilterInput = (config: FilterConfig<T>) => {
    const key = String(config.key);
    const value = filters[key];

    switch (config.type) {
      case 'text':
        return (
          <EnhancedInput
            key={key}
            label={config.label}
            value={value || ''}
            onChange={(newValue) => onFilterChange(key, newValue)}
            placeholder={config.placeholder}
            className="w-full"
          />
        );

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <select
              value={value || ''}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Todos</option>
              {config.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <EnhancedInput
            key={key}
            type="date"
            label={config.label}
            value={value || ''}
            onChange={(newValue) => onFilterChange(key, newValue)}
            className="w-full"
          />
        );

      case 'number':
        return (
          <EnhancedInput
            key={key}
            type="number"
            label={config.label}
            value={value || ''}
            onChange={(newValue) => onFilterChange(key, Number(newValue))}
            placeholder={config.placeholder}
            min={config.min}
            max={config.max}
            className="w-full"
          />
        );

      case 'boolean':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <select
              value={value === undefined ? '' : String(value)}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange(key, val === '' ? undefined : val === 'true');
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Todos</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        );

      case 'range':
        const rangeValue = value || { min: config.min, max: config.max };
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <EnhancedInput
                type="number"
                placeholder="Mín"
                value={rangeValue.min || ''}
                onChange={(newValue) => onFilterChange(key, {
                  ...rangeValue,
                  min: Number(newValue)
                })}
                min={config.min}
                max={config.max}
              />
              <EnhancedInput
                type="number"
                placeholder="Máx"
                value={rangeValue.max || ''}
                onChange={(newValue) => onFilterChange(key, {
                  ...rangeValue,
                  max: Number(newValue)
                })}
                min={config.min}
                max={config.max}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFiltersCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                Limpiar todo
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <ChevronDownIcon 
                className={clsx('h-4 w-4 transition-transform', {
                  'rotate-180': isExpanded
                })} 
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === undefined || value === null || value === '') return null;
              
              const config = filterConfigs.find(c => String(c.key) === key);
              if (!config) return null;
              
              let displayValue = String(value);
              if (config.type === 'range' && typeof value === 'object') {
                displayValue = `${value.min || 'Min'} - ${value.max || 'Max'}`;
              } else if (config.type === 'select' && config.options) {
                const option = config.options.find(opt => opt.value === value);
                displayValue = option?.label || displayValue;
              }
              
              return (
                <div
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <span className="font-medium">{config.label}:</span>
                  <span className="ml-1">{displayValue}</span>
                  <button
                    onClick={() => onRemoveFilter(key)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Panel de filtros expandido */}
      {isExpanded && (
        <div className="p-4">
          {/* Tabs */}
          {advancedFilters.length > 0 && (
            <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('basic')}
                className={clsx(
                  'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'basic'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Básicos
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={clsx(
                  'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'advanced'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Avanzados
              </button>
            </div>
          )}

          {/* Filtros básicos */}
          {(activeTab === 'basic' || advancedFilters.length === 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {basicFilters.map(config => renderFilterInput(config))}
            </div>
          )}

          {/* Filtros avanzados */}
          {activeTab === 'advanced' && advancedFilters.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedFilters.map(config => renderFilterInput(config))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para filtros rápidos
interface QuickFiltersProps<T> {
  filterConfigs: FilterConfig<T>[];
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  className?: string;
}

export function QuickFilters<T>({
  filterConfigs,
  filters,
  onFilterChange,
  className = ''
}: QuickFiltersProps<T>) {
  const quickFilters = filterConfigs.filter(config => 
    config.type === 'select' && config.options && config.options.length <= 5
  );

  if (quickFilters.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {quickFilters.map(config => {
        const key = String(config.key);
        const value = filters[key];
        
        return (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{config.label}:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => onFilterChange(key, '')}
                className={clsx(
                  'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                  !value
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Todos
              </button>
              {config.options?.map(option => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(key, option.value)}
                  className={clsx(
                    'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                    value === option.value
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
