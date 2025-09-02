import React, { useState, useMemo, useCallback } from 'react';
import { OptimizedTable } from '../optimized/OptimizedTable';
import { OptimizedStatsCard, OptimizedCourseCard, VirtualizedList } from '../optimized/OptimizedComponents';
import { 
  useDebounce, 
  useFilteredData, 
  usePagination, 
  useIntersectionObserver,
  usePerformanceMonitor 
} from '../../hooks/usePerformanceOptimization';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  ClockIcon,
  CpuChipIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// Datos de ejemplo para la demostración
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    name: `Elemento ${index + 1}`,
    email: `usuario${index + 1}@ejemplo.com`,
    status: ['activo', 'inactivo', 'pendiente'][index % 3],
    score: Math.floor(Math.random() * 100),
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    category: ['A', 'B', 'C'][index % 3]
  }));
};

const mockCourses = [
  {
    id: '1',
    nombre: 'Curso de React Avanzado',
    fechaInicio: '2024-01-15',
    duracion: 40,
    modalidad: 'presencial',
    estado: 'activo' as const
  },
  {
    id: '2',
    nombre: 'TypeScript para Desarrolladores',
    fechaInicio: '2024-02-01',
    duracion: 32,
    modalidad: 'virtual',
    estado: 'completado' as const
  },
  {
    id: '3',
    nombre: 'Optimización de Performance',
    fechaInicio: '2024-02-15',
    duracion: 24,
    modalidad: 'híbrido',
    estado: 'activo' as const
  }
];

export function PerformanceDemo() {
  const { renderCount, logPerformance } = usePerformanceMonitor('PerformanceDemo');
  
  const [dataSize, setDataSize] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // Datos generados con memoización
  const mockData = useMemo(() => {
    const startTime = Date.now();
    const data = generateMockData(dataSize);
    logPerformance('Data generation', startTime);
    return data;
  }, [dataSize, logPerformance]);

  // Búsqueda con debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Datos filtrados
  const filteredData = useFilteredData({
    data: mockData,
    searchFields: ['name', 'email'],
    searchTerm: debouncedSearchTerm
  });

  // Columnas de la tabla optimizada
  const tableColumns = useMemo(() => [
    {
      key: 'name' as const,
      label: 'Nombre',
      sortable: true,
      width: '25%'
    },
    {
      key: 'email' as const,
      label: 'Email',
      sortable: true,
      width: '30%'
    },
    {
      key: 'status' as const,
      label: 'Estado',
      sortable: true,
      width: '15%',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'activo' ? 'bg-green-100 text-green-800' :
          value === 'inactivo' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'score' as const,
      label: 'Puntuación',
      sortable: true,
      width: '15%'
    },
    {
      key: 'category' as const,
      label: 'Categoría',
      sortable: true,
      width: '15%'
    }
  ], []);

  // Handlers optimizados
  const handleDataSizeChange = useCallback((size: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setDataSize(size);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRowSelect = useCallback((items: any[]) => {
    setSelectedItems(items);
  }, []);

  // Intersection Observer para lazy loading
  const [lazyRef, isVisible] = useIntersectionObserver({
    threshold: 0.1
  });

  // Renderizado de elemento para lista virtualizada
  const renderVirtualItem = useCallback((item: any, index: number) => (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-500">{item.email}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'activo' ? 'bg-green-100 text-green-800' :
          item.status === 'inactivo' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
      </div>
    </div>
  ), []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <RocketLaunchIcon className="w-6 h-6 mr-2" />
          Demo de Optimizaciones de Rendimiento
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Demostración de las optimizaciones implementadas: lazy loading, React.memo, 
          debounce, virtualización, skeleton loaders y más.
        </p>
      </div>

      {/* Métricas de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OptimizedStatsCard
          title="Renders del Componente"
          value={renderCount}
          icon={CpuChipIcon}
          color="blue"
        />
        <OptimizedStatsCard
          title="Elementos en Datos"
          value={dataSize.toLocaleString()}
          icon={ChartBarIcon}
          color="green"
        />
        <OptimizedStatsCard
          title="Elementos Filtrados"
          value={filteredData.length.toLocaleString()}
          icon={UserGroupIcon}
          color="yellow"
        />
        <OptimizedStatsCard
          title="Elementos Seleccionados"
          value={selectedItems.length}
          icon={AcademicCapIcon}
          color="purple"
        />
      </div>

      {/* Controles de demostración */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h4 className="text-md font-medium text-gray-800 mb-4">Controles de Prueba</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDataSizeChange(100)}
            disabled={isLoading}
          >
            100 elementos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDataSizeChange(1000)}
            disabled={isLoading}
          >
            1,000 elementos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDataSizeChange(5000)}
            disabled={isLoading}
          >
            5,000 elementos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDataSizeChange(10000)}
            disabled={isLoading}
          >
            10,000 elementos
          </Button>
        </div>
        
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda con Debounce (300ms)
          </label>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabla optimizada */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-4">Tabla Optimizada con Paginación</h4>
        <OptimizedTable
          data={filteredData}
          columns={tableColumns}
          searchFields={['name', 'email']}
          itemsPerPage={20}
          loading={isLoading}
          selectable={true}
          onRowSelect={handleRowSelect}
          emptyMessage="No se encontraron elementos que coincidan con la búsqueda"
        />
      </div>

      {/* Lista virtualizada */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-4">Lista Virtualizada (Solo elementos visibles)</h4>
        <div className="bg-white rounded-lg shadow-sm border">
          <VirtualizedList
            items={filteredData.slice(0, 1000)} // Limitar para demo
            renderItem={renderVirtualItem}
            itemHeight={80}
            containerHeight={400}
            className="border rounded-lg"
          />
        </div>
      </div>

      {/* Cursos optimizados con React.memo */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-4">Componentes Optimizados con React.memo</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCourses.map(course => (
            <OptimizedCourseCard
              key={course.id}
              course={course}
              onEdit={(course) => console.log('Editar:', course)}
              onDelete={(id) => console.log('Eliminar:', id)}
              onViewDetails={(course) => console.log('Ver detalles:', course)}
            />
          ))}
        </div>
      </div>

      {/* Lazy loading con Intersection Observer */}
      <div ref={lazyRef}>
        <h4 className="text-md font-medium text-gray-800 mb-4">Lazy Loading con Intersection Observer</h4>
        {isVisible ? (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <h5 className="text-green-800 font-medium">Contenido cargado!</h5>
                <p className="text-green-600 text-sm">
                  Este contenido se cargó cuando entró en el viewport usando Intersection Observer.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-gray-600">Esperando a ser visible...</span>
            </div>
          </div>
        )}
      </div>

      {/* Resumen de optimizaciones */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h4 className="text-blue-900 font-medium mb-3">Optimizaciones Implementadas:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✅ Lazy loading de componentes pesados con Suspense</li>
          <li>✅ React.memo para evitar re-renders innecesarios</li>
          <li>✅ Debounce en búsquedas (300ms)</li>
          <li>✅ Virtualización para listas grandes</li>
          <li>✅ Paginación optimizada</li>
          <li>✅ Skeleton loaders durante carga</li>
          <li>✅ Intersection Observer para lazy loading</li>
          <li>✅ Memoización de cálculos pesados</li>
          <li>✅ Code splitting con chunks optimizados</li>
          <li>✅ Error boundaries para componentes lazy</li>
          <li>✅ Hooks personalizados para performance</li>
          <li>✅ Monitoreo de rendimiento en desarrollo</li>
        </ul>
      </div>
    </div>
  );
}
