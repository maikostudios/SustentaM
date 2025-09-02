import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './usePerformanceOptimization';

// Tipos para filtros avanzados
export interface FilterConfig<T> {
  key: keyof T;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'range';
  label: string;
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SearchConfig<T> {
  searchFields: (keyof T)[];
  globalSearch?: boolean;
  caseSensitive?: boolean;
  exactMatch?: boolean;
  highlightMatches?: boolean;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface AdvancedSearchState<T> {
  searchTerm: string;
  filters: Record<string, any>;
  sortConfig: SortConfig<T> | null;
  selectedItems: Set<string>;
}

// Hook principal para búsqueda avanzada
export function useAdvancedSearch<T extends { id: string }>(
  data: T[],
  searchConfig: SearchConfig<T>,
  filterConfigs: FilterConfig<T>[] = []
) {
  const [searchState, setSearchState] = useState<AdvancedSearchState<T>>({
    searchTerm: '',
    filters: {},
    sortConfig: null,
    selectedItems: new Set()
  });

  const debouncedSearchTerm = useDebounce(searchState.searchTerm, 300);

  // Función de búsqueda mejorada
  const searchFunction = useCallback((item: T, term: string): boolean => {
    if (!term.trim()) return true;

    const searchTerm = searchConfig.caseSensitive ? term : term.toLowerCase();
    
    return searchConfig.searchFields.some(field => {
      const value = item[field];
      if (value == null) return false;
      
      const stringValue = searchConfig.caseSensitive 
        ? String(value) 
        : String(value).toLowerCase();
      
      if (searchConfig.exactMatch) {
        return stringValue === searchTerm;
      }
      
      return stringValue.includes(searchTerm);
    });
  }, [searchConfig]);

  // Función de filtrado avanzado
  const filterFunction = useCallback((item: T, filters: Record<string, any>): boolean => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      
      const filterConfig = filterConfigs.find(config => String(config.key) === key);
      const itemValue = (item as any)[key];
      
      if (!filterConfig) return true;
      
      switch (filterConfig.type) {
        case 'text':
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        
        case 'select':
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        
        case 'boolean':
          return Boolean(itemValue) === Boolean(value);
        
        case 'number':
          return Number(itemValue) === Number(value);
        
        case 'date':
          const itemDate = new Date(itemValue);
          const filterDate = new Date(value);
          return itemDate.toDateString() === filterDate.toDateString();
        
        case 'range':
          const numValue = Number(itemValue);
          if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
            return numValue >= value.min && numValue <= value.max;
          }
          return true;
        
        default:
          return true;
      }
    });
  }, [filterConfigs]);

  // Función de ordenamiento
  const sortFunction = useCallback((a: T, b: T, sortConfig: SortConfig<T>): number => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    // Manejar valores nulos/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Comparación por tipo
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      const diff = aValue.getTime() - bValue.getTime();
      return sortConfig.direction === 'asc' ? diff : -diff;
    }
    
    // Comparación de strings
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }, []);

  // Datos procesados
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Aplicar búsqueda
    if (debouncedSearchTerm) {
      result = result.filter(item => searchFunction(item, debouncedSearchTerm));
    }
    
    // Aplicar filtros
    result = result.filter(item => filterFunction(item, searchState.filters));
    
    // Aplicar ordenamiento
    if (searchState.sortConfig) {
      result.sort((a, b) => sortFunction(a, b, searchState.sortConfig!));
    }
    
    return result;
  }, [data, debouncedSearchTerm, searchState.filters, searchState.sortConfig, searchFunction, filterFunction, sortFunction]);

  // Funciones de control
  const setSearchTerm = useCallback((term: string) => {
    setSearchState(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setFilter = useCallback((key: string, value: any) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setSearchState(prev => {
      const { [key]: removed, ...rest } = prev.filters;
      return { ...prev, filters: rest };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchState(prev => ({ ...prev, filters: {} }));
  }, []);

  const setSort = useCallback((key: keyof T, direction: 'asc' | 'desc') => {
    setSearchState(prev => ({
      ...prev,
      sortConfig: { key, direction }
    }));
  }, []);

  const clearSort = useCallback(() => {
    setSearchState(prev => ({ ...prev, sortConfig: null }));
  }, []);

  const toggleSort = useCallback((key: keyof T) => {
    setSearchState(prev => {
      if (prev.sortConfig?.key === key) {
        const newDirection = prev.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        return { ...prev, sortConfig: { key, direction: newDirection } };
      }
      return { ...prev, sortConfig: { key, direction: 'asc' } };
    });
  }, []);

  const selectItem = useCallback((id: string) => {
    setSearchState(prev => {
      const newSelected = new Set(prev.selectedItems);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { ...prev, selectedItems: newSelected };
    });
  }, []);

  const selectAll = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      selectedItems: new Set(processedData.map(item => item.id))
    }));
  }, [processedData]);

  const clearSelection = useCallback(() => {
    setSearchState(prev => ({ ...prev, selectedItems: new Set() }));
  }, []);

  // Estadísticas
  const stats = useMemo(() => ({
    totalItems: data.length,
    filteredItems: processedData.length,
    selectedItems: searchState.selectedItems.size,
    activeFilters: Object.keys(searchState.filters).filter(key => 
      searchState.filters[key] !== undefined && 
      searchState.filters[key] !== null && 
      searchState.filters[key] !== ''
    ).length,
    hasSearch: !!debouncedSearchTerm,
    hasSort: !!searchState.sortConfig
  }), [data.length, processedData.length, searchState.selectedItems.size, searchState.filters, debouncedSearchTerm, searchState.sortConfig]);

  // Función para resaltar coincidencias
  const highlightMatch = useCallback((text: string, searchTerm: string): string => {
    if (!searchConfig.highlightMatches || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, searchConfig.caseSensitive ? 'g' : 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, [searchConfig.highlightMatches, searchConfig.caseSensitive]);

  return {
    // Estado
    searchTerm: searchState.searchTerm,
    filters: searchState.filters,
    sortConfig: searchState.sortConfig,
    selectedItems: searchState.selectedItems,
    
    // Datos procesados
    data: processedData,
    stats,
    
    // Funciones de control
    setSearchTerm,
    setFilter,
    removeFilter,
    clearFilters,
    setSort,
    clearSort,
    toggleSort,
    selectItem,
    selectAll,
    clearSelection,
    highlightMatch,
    
    // Utilidades
    isSelected: (id: string) => searchState.selectedItems.has(id),
    getSelectedItems: () => data.filter(item => searchState.selectedItems.has(item.id)),
    getSortDirection: (key: keyof T) => 
      searchState.sortConfig?.key === key ? searchState.sortConfig.direction : null
  };
}

// Hook para búsqueda global en múltiples datasets
export function useGlobalSearch<T extends { id: string; type: string }>(
  datasets: Array<{ name: string; data: T[]; searchFields: (keyof T)[] }>
) {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const debouncedGlobalSearch = useDebounce(globalSearchTerm, 300);

  const globalResults = useMemo(() => {
    if (!debouncedGlobalSearch) return [];

    const results: Array<T & { datasetName: string; relevance: number }> = [];
    
    datasets.forEach(dataset => {
      dataset.data.forEach(item => {
        let relevance = 0;
        let matches = 0;
        
        dataset.searchFields.forEach(field => {
          const value = String(item[field] || '').toLowerCase();
          const searchLower = debouncedGlobalSearch.toLowerCase();
          
          if (value.includes(searchLower)) {
            matches++;
            // Calcular relevancia basada en posición de la coincidencia
            const index = value.indexOf(searchLower);
            relevance += index === 0 ? 10 : (index < 5 ? 5 : 1);
          }
        });
        
        if (matches > 0) {
          results.push({
            ...item,
            datasetName: dataset.name,
            relevance: relevance + matches
          });
        }
      });
    });
    
    // Ordenar por relevancia
    return results.sort((a, b) => b.relevance - a.relevance);
  }, [datasets, debouncedGlobalSearch]);

  return {
    searchTerm: globalSearchTerm,
    setSearchTerm: setGlobalSearchTerm,
    results: globalResults,
    hasResults: globalResults.length > 0,
    resultsByDataset: globalResults.reduce((acc, result) => {
      if (!acc[result.datasetName]) {
        acc[result.datasetName] = [];
      }
      acc[result.datasetName].push(result);
      return acc;
    }, {} as Record<string, typeof globalResults>)
  };
}
