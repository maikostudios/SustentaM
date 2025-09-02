import React, { memo, useMemo, useCallback, useState } from 'react';
import { 
  useFilteredData, 
  usePagination, 
  useDebounce, 
  usePerformanceMonitor 
} from '../../hooks/usePerformanceOptimization';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchFields: (keyof T)[];
  itemsPerPage?: number;
  loading?: boolean;
  onRowClick?: (item: T) => void;
  onRowSelect?: (selectedItems: T[]) => void;
  selectable?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function OptimizedTable<T extends { id: string }>({
  data,
  columns,
  searchFields,
  itemsPerPage = 10,
  loading = false,
  onRowClick,
  onRowSelect,
  selectable = false,
  className = '',
  emptyMessage = 'No hay datos disponibles'
}: OptimizedTableProps<T>) {
  const { logPerformance } = usePerformanceMonitor('OptimizedTable');
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof T | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Datos filtrados y ordenados
  const filteredData = useFilteredData({
    data,
    searchFields,
    searchTerm,
    sortBy,
    sortOrder
  });

  // Paginación
  const pagination = usePagination({
    totalItems: filteredData.length,
    itemsPerPage
  });

  // Datos de la página actual
  const currentPageData = useMemo(() => {
    const startTime = Date.now();
    const result = filteredData.slice(pagination.startIndex, pagination.endIndex);
    logPerformance('Data slicing', startTime);
    return result;
  }, [filteredData, pagination.startIndex, pagination.endIndex, logPerformance]);

  // Handlers optimizados
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    pagination.goToFirstPage();
  }, [pagination]);

  const handleSort = useCallback((column: keyof T) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    pagination.goToFirstPage();
  }, [sortBy, pagination]);

  const handleRowSelect = useCallback((itemId: string) => {
    if (!selectable) return;

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      
      // Notificar cambios
      const selectedData = data.filter(item => newSet.has(item.id));
      onRowSelect?.(selectedData);
      
      return newSet;
    });
  }, [selectable, data, onRowSelect]);

  const handleSelectAll = useCallback(() => {
    if (!selectable) return;

    const allCurrentIds = currentPageData.map(item => item.id);
    const allSelected = allCurrentIds.every(id => selectedItems.has(id));
    
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        allCurrentIds.forEach(id => newSet.delete(id));
      } else {
        allCurrentIds.forEach(id => newSet.add(id));
      }
      
      const selectedData = data.filter(item => newSet.has(item.id));
      onRowSelect?.(selectedData);
      
      return newSet;
    });
  }, [selectable, currentPageData, selectedItems, data, onRowSelect]);

  const handleRowClick = useCallback((item: T) => {
    onRowClick?.(item);
  }, [onRowClick]);

  // Renderizado de skeleton para loading
  const renderSkeleton = () => (
    <div className="animate-pulse">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={index} className="border-b border-gray-200">
          <div className="px-6 py-4 flex space-x-4">
            {columns.map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-white shadow rounded-lg ${className}`}>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center mb-4">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600">Cargando datos...</span>
          </div>
          {renderSkeleton()}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {/* Header con búsqueda y filtros */}
      <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
            
            {selectable && selectedItems.size > 0 && (
              <div className="text-sm text-gray-600">
                {selectedItems.size} seleccionado(s)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={currentPageData.length > 0 && currentPageData.every(item => selectedItems.has(item.id))}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortBy === column.key && (
                      sortOrder === 'asc' ? 
                        <ArrowUpIcon className="h-4 w-4" /> : 
                        <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentPageData.map((item) => (
                <OptimizedTableRow
                  key={item.id}
                  item={item}
                  columns={columns}
                  selectable={selectable}
                  selected={selectedItems.has(item.id)}
                  onSelect={() => handleRowSelect(item.id)}
                  onClick={() => handleRowClick(item)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {pagination.startIndex + 1} a {pagination.endIndex} de {filteredData.length} resultados
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

// Componente de fila optimizado con React.memo
interface OptimizedTableRowProps<T> {
  item: T;
  columns: Column<T>[];
  selectable: boolean;
  selected: boolean;
  onSelect: () => void;
  onClick: () => void;
}

const OptimizedTableRow = memo(<T extends { id: string }>({
  item,
  columns,
  selectable,
  selected,
  onSelect,
  onClick
}: OptimizedTableRowProps<T>) => {
  return (
    <tr 
      className={`hover:bg-gray-50 cursor-pointer ${selected ? 'bg-blue-50' : ''}`}
      onClick={onClick}
    >
      {selectable && (
        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </td>
      )}
      {columns.map((column) => (
        <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {column.render ? column.render((item as any)[column.key], item) : String((item as any)[column.key] || '')}
        </td>
      ))}
    </tr>
  );
}) as <T extends { id: string }>(props: OptimizedTableRowProps<T>) => JSX.Element;
