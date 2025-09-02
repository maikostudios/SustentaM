import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Hook para debounce de búsquedas
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para throttle de eventos
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Hook para memoización de cálculos pesados
export function useExpensiveCalculation<T, D extends readonly unknown[]>(
  calculation: () => T,
  deps: D
): T {
  return useMemo(calculation, deps);
}

// Hook para lazy loading de datos
interface UseLazyDataOptions<T> {
  fetchData: () => Promise<T>;
  dependencies?: any[];
  enabled?: boolean;
  cacheTime?: number;
}

interface LazyDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLazyData<T>({
  fetchData,
  dependencies = [],
  enabled = true,
  cacheTime = 5 * 60 * 1000 // 5 minutos
}: UseLazyDataOptions<T>): LazyDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    // Verificar cache
    if (cacheRef.current) {
      const isExpired = Date.now() - cacheRef.current.timestamp > cacheTime;
      if (!isExpired) {
        setData(cacheRef.current.data);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchData();
      setData(result);
      cacheRef.current = { data: result, timestamp: Date.now() };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [fetchData, enabled, cacheTime]);

  useEffect(() => {
    refetch();
  }, [refetch, ...dependencies]);

  return { data, loading, error, refetch };
}

// Hook para paginación optimizada
interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1
}: UsePaginationOptions): PaginationState {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage
  };
}

// Hook para filtrado y búsqueda optimizada
interface UseFilteredDataOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  searchTerm: string;
  filters?: Record<string, any>;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}

export function useFilteredData<T>({
  data,
  searchFields,
  searchTerm,
  filters = {},
  sortBy,
  sortOrder = 'asc'
}: UseFilteredDataOptions<T>): T[] {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  return useMemo(() => {
    let filteredData = [...data];

    // Aplicar búsqueda
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredData = filteredData.filter(item => {
          const itemValue = (item as any)[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    // Aplicar ordenamiento
    if (sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, debouncedSearchTerm, searchFields, filters, sortBy, sortOrder]);
}

// Hook para intersection observer (lazy loading de imágenes/componentes)
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting];
}

// Hook para medir performance de componentes
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} - Render #${renderCount.current} took ${renderTime}ms`);
    }
    
    renderStartTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (action: string, startTime: number) => {
      const duration = Date.now() - startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} - ${action} took ${duration}ms`);
      }
    }
  };
}

// Hook para gestión de estado local optimizada
export function useOptimizedState<T>(
  initialState: T,
  equalityFn?: (prev: T, next: T) => boolean
): [T, (newState: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const previousState = useRef<T>(initialState);

  const optimizedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      // Usar función de igualdad personalizada o comparación por referencia
      const areEqual = equalityFn 
        ? equalityFn(previousState.current, nextState)
        : previousState.current === nextState;

      if (areEqual) {
        return prevState; // No actualizar si son iguales
      }

      previousState.current = nextState;
      return nextState;
    });
  }, [equalityFn]);

  return [state, optimizedSetState];
}

// Hook para batch de actualizaciones
export function useBatchedUpdates() {
  const [updates, setUpdates] = useState<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updateFn: () => void) => {
    setUpdates(prev => [...prev, updateFn]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setUpdates(currentUpdates => {
        currentUpdates.forEach(fn => fn());
        return [];
      });
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
}
