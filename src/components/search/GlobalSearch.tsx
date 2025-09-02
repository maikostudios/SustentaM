import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useGlobalSearch } from '../../hooks/useAdvancedSearch';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  DocumentIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface GlobalSearchProps {
  datasets: Array<{
    name: string;
    data: any[];
    searchFields: string[];
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  }>;
  onResultClick?: (result: any, datasetName: string) => void;
  placeholder?: string;
  className?: string;
}

export function GlobalSearch({
  datasets,
  onResultClick,
  placeholder = "Buscar en toda la aplicación...",
  className = ''
}: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    results,
    hasResults,
    resultsByDataset
  } = useGlobalSearch(datasets);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar teclas
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      
      // Ctrl/Cmd + K para abrir búsqueda
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length > 0);
    
    // Guardar en búsquedas recientes
    if (value.length > 2 && !recentSearches.includes(value)) {
      setRecentSearches(prev => [value, ...prev.slice(0, 4)]);
    }
  };

  const handleResultClick = (result: any, datasetName: string) => {
    setIsOpen(false);
    setSearchTerm('');
    onResultClick?.(result, datasetName);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getDatasetIcon = (datasetName: string) => {
    const dataset = datasets.find(d => d.name === datasetName);
    const IconComponent = dataset?.icon;
    
    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />;
    }
    
    // Iconos por defecto según el tipo
    switch (datasetName.toLowerCase()) {
      case 'cursos':
      case 'courses':
        return <AcademicCapIcon className="h-4 w-4" />;
      case 'usuarios':
      case 'users':
        return <UserIcon className="h-4 w-4" />;
      case 'reportes':
      case 'reports':
        return <ChartBarIcon className="h-4 w-4" />;
      default:
        return <DocumentIcon className="h-4 w-4" />;
    }
  };

  const getDatasetColor = (datasetName: string) => {
    const dataset = datasets.find(d => d.name === datasetName);
    return dataset?.color || 'blue';
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        
        {/* Indicador de atajo de teclado */}
        {!isOpen && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-sans font-medium text-gray-400">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Panel de resultados */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Búsquedas recientes */}
          {!searchTerm && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Búsquedas recientes
                </span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {searchTerm && (
            <div className="max-h-80 overflow-y-auto">
              {hasResults ? (
                Object.entries(resultsByDataset).map(([datasetName, datasetResults]) => (
                  <div key={datasetName} className="border-b border-gray-100 last:border-b-0">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className={`text-${getDatasetColor(datasetName)}-600`}>
                          {getDatasetIcon(datasetName)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          {datasetName} ({datasetResults.length})
                        </span>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {datasetResults.slice(0, 5).map((result, index) => (
                        <button
                          key={`${result.id}-${index}`}
                          onClick={() => handleResultClick(result, datasetName)}
                          className="w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${getDatasetColor(datasetName)}-100 flex items-center justify-center`}>
                              <div className={`text-${getDatasetColor(datasetName)}-600`}>
                                {getDatasetIcon(datasetName)}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">
                                {highlightMatch(result.nombre || result.name || result.title || 'Sin título', searchTerm)}
                              </div>
                              
                              {(result.descripcion || result.description || result.email) && (
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {highlightMatch(
                                    result.descripcion || result.description || result.email || '',
                                    searchTerm
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getDatasetColor(datasetName)}-100 text-${getDatasetColor(datasetName)}-800`}>
                                  {datasetName}
                                </span>
                                
                                {result.relevance && (
                                  <span className="text-xs text-gray-400">
                                    Relevancia: {result.relevance}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      
                      {datasetResults.length > 5 && (
                        <div className="px-3 py-2 text-center">
                          <span className="text-xs text-gray-500">
                            +{datasetResults.length - 5} resultados más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : searchTerm.length > 0 ? (
                <div className="px-3 py-8 text-center">
                  <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No se encontraron resultados
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Footer con ayuda */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Presiona Enter para buscar</span>
              <div className="flex items-center space-x-2">
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">↑↓</kbd>
                <span>navegar</span>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd>
                <span>cerrar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de búsqueda compacta para la barra de navegación
interface CompactSearchProps {
  onOpenFullSearch: () => void;
  className?: string;
}

export function CompactSearch({ onOpenFullSearch, className = '' }: CompactSearchProps) {
  return (
    <button
      onClick={onOpenFullSearch}
      className={clsx(
        'flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors',
        className
      )}
    >
      <MagnifyingGlassIcon className="h-4 w-4" />
      <span>Buscar...</span>
      <kbd className="ml-auto px-1 py-0.5 bg-gray-200 rounded text-xs">⌘K</kbd>
    </button>
  );
}
