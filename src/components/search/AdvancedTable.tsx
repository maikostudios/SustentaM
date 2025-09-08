import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { useAdvancedSearch, FilterConfig } from '../../hooks/useAdvancedSearch';
import { usePagination } from '../../hooks/usePerformanceOptimization';
import { AdvancedFilters, QuickFilters } from './AdvancedFilters';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useThemeAware } from '../../hooks/useTheme';
import { 
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  Squares2X2Icon,
  DocumentArrowDownIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T, searchTerm?: string) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface AdvancedTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  searchConfig: {
    searchFields: (keyof T)[];
    globalSearch?: boolean;
    caseSensitive?: boolean;
    exactMatch?: boolean;
    highlightMatches?: boolean;
  };
  filterConfigs?: FilterConfig<T>[];
  itemsPerPage?: number;
  loading?: boolean;
  selectable?: boolean;
  onRowClick?: (item: T) => void;
  onRowSelect?: (selectedItems: T[]) => void;
  onExport?: (data: T[]) => void;
  className?: string;
  emptyMessage?: string;
  title?: string;
  description?: string;
}

export function AdvancedTable<T extends { id: string }>({
  data,
  columns,
  searchConfig,
  filterConfigs = [],
  itemsPerPage = 20,
  loading = false,
  selectable = false,
  onRowClick,
  onRowSelect,
  onExport,
  className = '',
  emptyMessage = 'No hay datos disponibles',
  title,
  description
}: AdvancedTableProps<T>) {
  const theme = useThemeAware();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showSettings, setShowSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map(col => col.key))
  );

  // Hook de búsqueda avanzada
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    sortConfig,
    toggleSort,
    selectedItems,
    selectItem,
    selectAll,
    clearSelection,
    data: processedData,
    stats,
    isSelected,
    getSelectedItems,
    getSortDirection,
    highlightMatch
  } = useAdvancedSearch(data, searchConfig, filterConfigs);

  // Paginación
  const pagination = usePagination({
    totalItems: processedData.length,
    itemsPerPage
  });

  // Datos de la página actual
  const currentPageData = useMemo(() => {
    return processedData.slice(pagination.startIndex, pagination.endIndex);
  }, [processedData, pagination.startIndex, pagination.endIndex]);

  // Columnas visibles
  const visibleColumnsArray = useMemo(() => {
    return columns.filter(col => visibleColumns.has(col.key));
  }, [columns, visibleColumns]);

  const handleColumnVisibilityChange = (columnKey: keyof T, visible: boolean) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (visible) {
        newSet.add(columnKey);
      } else {
        newSet.delete(columnKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === currentPageData.length) {
      clearSelection();
    } else {
      currentPageData.forEach(item => selectItem(item.id));
    }
  };

  const handleExport = () => {
    const dataToExport = selectedItems.size > 0 ? getSelectedItems() : processedData;
    onExport?.(dataToExport);
  };

  const renderCell = (item: T, column: Column<T>) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item, searchTerm);
    }
    
    if (searchConfig.highlightMatches && searchTerm) {
      return (
        <span 
          dangerouslySetInnerHTML={{ 
            __html: highlightMatch(String(value || ''), searchTerm) 
          }} 
        />
      );
    }
    
    return String(value || '');
  };

  if (loading) {
    return (
      <div className={`${theme.bg} shadow rounded-lg ${theme.border} border ${className}`}>
        <div className="p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className={`mt-4 ${theme.textSecondary}`}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bg} shadow rounded-lg ${theme.border} border ${className}`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${theme.border}`}>
        <div className="flex flex-col space-y-4">
          {/* Título y descripción */}
          {(title || description) && (
            <div>
              {title && (
                <h2 className={`text-lg font-semibold ${theme.text}`}>{title}</h2>
              )}
              {description && (
                <p className={`text-sm ${theme.textSecondary} mt-1`}>{description}</p>
              )}
            </div>
          )}

          {/* Barra de búsqueda principal */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className={`h-5 w-5 ${theme.textSecondary}`} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${theme.border} rounded-md leading-5 ${theme.bg} ${theme.placeholder} focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${theme.text}`}
                />
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center space-x-2">
              {/* Modo de vista */}
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={clsx(
                    'px-3 py-2 text-sm font-medium border rounded-l-md',
                    viewMode === 'table'
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                      : `${theme.bg} ${theme.border} ${theme.text} hover:${theme.bgHover}`
                  )}
                >
                  <Bars3Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'px-3 py-2 text-sm font-medium border-t border-r border-b rounded-r-md',
                    viewMode === 'grid'
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                      : `${theme.bg} ${theme.border} ${theme.text} hover:${theme.bgHover}`
                  )}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
              </div>

              {/* Exportar */}
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={processedData.length === 0}
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              )}

              {/* Configuración */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtros rápidos */}
          {filterConfigs.length > 0 && (
            <QuickFilters
              filterConfigs={filterConfigs}
              filters={filters}
              onFilterChange={setFilter}
            />
          )}

          {/* Estadísticas */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>
                {stats.filteredItems.toLocaleString()} de {stats.totalItems.toLocaleString()} elementos
              </span>
              {stats.selectedItems > 0 && (
                <span className="text-blue-600">
                  {stats.selectedItems} seleccionados
                </span>
              )}
              {stats.activeFilters > 0 && (
                <span className="text-orange-600">
                  {stats.activeFilters} filtros activos
                </span>
              )}
            </div>

            {selectedItems.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-red-600 hover:text-red-700"
              >
                Limpiar selección
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros avanzados */}
      {filterConfigs.length > 0 && (
        <AdvancedFilters
          filterConfigs={filterConfigs}
          filters={filters}
          onFilterChange={setFilter}
          onRemoveFilter={removeFilter}
          onClearFilters={clearFilters}
        />
      )}

      {/* Panel de configuración */}
      {showSettings && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Columnas visibles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {columns.map(column => (
              <label key={String(column.key)} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visibleColumns.has(column.key)}
                  onChange={(e) => handleColumnVisibilityChange(column.key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {processedData.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <MagnifyingGlassIcon className={`mx-auto h-12 w-12 ${theme.textSecondary}`} />
          <h3 className={`mt-2 text-sm font-medium ${theme.text}`}>
            {stats.hasSearch || stats.activeFilters > 0 ? 'No se encontraron resultados' : emptyMessage}
          </h3>
          {(stats.hasSearch || stats.activeFilters > 0) && (
            <p className={`mt-1 text-sm ${theme.textSecondary}`}>
              Intenta ajustar los filtros o términos de búsqueda
            </p>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Vista de tabla */
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${theme.border}`}>
            <thead className={`${theme.bgSecondary}`}>
              <tr>
                {selectable && (
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme.textSecondary} uppercase tracking-wider`}>
                    <input
                      type="checkbox"
                      checked={currentPageData.length > 0 && currentPageData.every(item => isSelected(item.id))}
                      onChange={handleSelectAll}
                      className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${theme.border} rounded`}
                    />
                  </th>
                )}
                {visibleColumnsArray.map(column => (
                  <th
                    key={String(column.key)}
                    className={clsx(
                      `px-6 py-3 text-xs font-medium ${theme.textSecondary} uppercase tracking-wider`,
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && `cursor-pointer hover:${theme.bgHover}`
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && toggleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          {getSortDirection(column.key) === 'asc' ? (
                            <ArrowUpIcon className="h-3 w-3" />
                          ) : getSortDirection(column.key) === 'desc' ? (
                            <ArrowDownIcon className="h-3 w-3" />
                          ) : (
                            <div className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`${theme.bg} divide-y ${theme.border}`}>
              {currentPageData.map(item => (
                <tr
                  key={item.id}
                  className={clsx(
                    `hover:${theme.bgHover} cursor-pointer`,
                    isSelected(item.id) && 'bg-blue-50 dark:bg-blue-900/30'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected(item.id)}
                        onChange={() => selectItem(item.id)}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${theme.border} rounded`}
                      />
                    </td>
                  )}
                  {visibleColumnsArray.map(column => (
                    <td
                      key={String(column.key)}
                      className={clsx(
                        `px-6 py-4 whitespace-nowrap text-sm ${theme.text}`,
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Vista de grid */
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentPageData.map(item => (
              <div
                key={item.id}
                className={clsx(
                  `p-4 border ${theme.border} rounded-lg hover:shadow-md transition-shadow cursor-pointer ${theme.bg}`,
                  isSelected(item.id) && 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected(item.id)}
                      onChange={() => selectItem(item.id)}
                      className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${theme.border} rounded`}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {visibleColumnsArray.slice(0, 3).map(column => (
                    <div key={String(column.key)}>
                      <div className={`text-xs font-medium ${theme.textSecondary} uppercase tracking-wide`}>
                        {column.label}
                      </div>
                      <div className={`text-sm ${theme.text}`}>
                        {renderCell(item, column)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className={`px-6 py-3 border-t ${theme.border}`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${theme.text}`}>
              Mostrando {pagination.startIndex + 1} a {pagination.endIndex} de {processedData.length} resultados
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.previousPage}
                disabled={!pagination.hasPreviousPage}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-700">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.nextPage}
                disabled={!pagination.hasNextPage}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
