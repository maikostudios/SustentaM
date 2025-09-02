import React, { useState, useMemo } from 'react';
import { AdvancedTable } from '../search/AdvancedTable';
import { GlobalSearch } from '../search/GlobalSearch';
import { FilterConfig } from '../../hooks/useAdvancedSearch';
import { Button } from '../ui/Button';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  TableCellsIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Datos de ejemplo para la demostración
const generateMockParticipants = (count: number) => {
  const nombres = ['Juan Pérez', 'María González', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Silva', 'Carmen López', 'Pedro Sánchez', 'Laura Torres'];
  const empresas = ['TechCorp', 'InnovaSoft', 'DataSystems', 'CloudTech', 'DevSolutions'];
  const estados = ['activo', 'inactivo', 'pendiente'];
  const modalidades = ['presencial', 'virtual', 'híbrido'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: `participant-${index}`,
    nombre: nombres[index % nombres.length] + ` ${index + 1}`,
    email: `usuario${index + 1}@${empresas[index % empresas.length].toLowerCase()}.com`,
    empresa: empresas[index % empresas.length],
    telefono: `+56 9 ${Math.floor(Math.random() * 90000000) + 10000000}`,
    estado: estados[index % estados.length],
    modalidad: modalidades[index % modalidades.length],
    fechaRegistro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    puntuacion: Math.floor(Math.random() * 100),
    activo: Math.random() > 0.3,
    edad: Math.floor(Math.random() * 40) + 20,
    experiencia: Math.floor(Math.random() * 15) + 1
  }));
};

const generateMockCourses = (count: number) => {
  const cursos = ['Excel Avanzado', 'Python Básico', 'Marketing Digital', 'Gestión de Proyectos', 'Análisis de Datos'];
  const modalidades = ['presencial', 'virtual', 'híbrido'];
  const estados = ['activo', 'completado', 'cancelado'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: `course-${index}`,
    nombre: `${cursos[index % cursos.length]} ${index + 1}`,
    descripcion: `Descripción del curso ${cursos[index % cursos.length]} nivel ${index % 3 === 0 ? 'básico' : index % 3 === 1 ? 'intermedio' : 'avanzado'}`,
    modalidad: modalidades[index % modalidades.length],
    estado: estados[index % estados.length],
    duracion: [8, 16, 24, 32, 40][index % 5],
    fechaInicio: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    capacidad: [15, 20, 25, 30][index % 4],
    inscritos: Math.floor(Math.random() * 30),
    costo: [0, 50000, 100000, 150000, 200000][index % 5],
    instructor: `Instructor ${index + 1}`
  }));
};

export function SearchDemo() {
  const [activeDemo, setActiveDemo] = useState<'table' | 'global'>('table');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // Datos de ejemplo
  const participants = useMemo(() => generateMockParticipants(150), []);
  const courses = useMemo(() => generateMockCourses(50), []);

  // Configuración de columnas para participantes
  const participantColumns = [
    {
      key: 'nombre' as const,
      label: 'Nombre',
      sortable: true,
      width: '20%'
    },
    {
      key: 'email' as const,
      label: 'Email',
      sortable: true,
      width: '25%'
    },
    {
      key: 'empresa' as const,
      label: 'Empresa',
      sortable: true,
      width: '15%'
    },
    {
      key: 'estado' as const,
      label: 'Estado',
      sortable: true,
      width: '10%',
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
      key: 'puntuacion' as const,
      label: 'Puntuación',
      sortable: true,
      width: '10%',
      align: 'center' as const
    },
    {
      key: 'fechaRegistro' as const,
      label: 'Fecha Registro',
      sortable: true,
      width: '15%'
    },
    {
      key: 'activo' as const,
      label: 'Activo',
      sortable: true,
      width: '5%',
      render: (value: boolean) => (
        <span className={`inline-block w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
      )
    }
  ];

  // Configuración de filtros para participantes
  const participantFilters: FilterConfig<any>[] = [
    {
      key: 'nombre',
      type: 'text',
      label: 'Nombre',
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'empresa',
      type: 'select',
      label: 'Empresa',
      options: [
        { value: 'TechCorp', label: 'TechCorp' },
        { value: 'InnovaSoft', label: 'InnovaSoft' },
        { value: 'DataSystems', label: 'DataSystems' },
        { value: 'CloudTech', label: 'CloudTech' },
        { value: 'DevSolutions', label: 'DevSolutions' }
      ]
    },
    {
      key: 'estado',
      type: 'select',
      label: 'Estado',
      options: [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'pendiente', label: 'Pendiente' }
      ]
    },
    {
      key: 'modalidad',
      type: 'select',
      label: 'Modalidad',
      options: [
        { value: 'presencial', label: 'Presencial' },
        { value: 'virtual', label: 'Virtual' },
        { value: 'híbrido', label: 'Híbrido' }
      ]
    },
    {
      key: 'puntuacion',
      type: 'range',
      label: 'Puntuación',
      min: 0,
      max: 100
    },
    {
      key: 'edad',
      type: 'range',
      label: 'Edad',
      min: 18,
      max: 65
    },
    {
      key: 'fechaRegistro',
      type: 'date',
      label: 'Fecha de Registro'
    },
    {
      key: 'activo',
      type: 'boolean',
      label: 'Usuario Activo'
    }
  ];

  // Configuración de columnas para cursos
  const courseColumns = [
    {
      key: 'nombre' as const,
      label: 'Curso',
      sortable: true,
      width: '25%'
    },
    {
      key: 'modalidad' as const,
      label: 'Modalidad',
      sortable: true,
      width: '12%'
    },
    {
      key: 'estado' as const,
      label: 'Estado',
      sortable: true,
      width: '12%',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'activo' ? 'bg-green-100 text-green-800' :
          value === 'completado' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'duracion' as const,
      label: 'Duración (h)',
      sortable: true,
      width: '10%',
      align: 'center' as const
    },
    {
      key: 'capacidad' as const,
      label: 'Capacidad',
      sortable: true,
      width: '10%',
      align: 'center' as const
    },
    {
      key: 'inscritos' as const,
      label: 'Inscritos',
      sortable: true,
      width: '10%',
      align: 'center' as const
    },
    {
      key: 'fechaInicio' as const,
      label: 'Fecha Inicio',
      sortable: true,
      width: '12%'
    },
    {
      key: 'costo' as const,
      label: 'Costo',
      sortable: true,
      width: '9%',
      render: (value: number) => value === 0 ? 'Gratis' : `$${value.toLocaleString()}`
    }
  ];

  // Datasets para búsqueda global
  const globalSearchDatasets = [
    {
      name: 'Participantes',
      data: participants,
      searchFields: ['nombre', 'email', 'empresa'],
      icon: () => <span>👤</span>,
      color: 'blue'
    },
    {
      name: 'Cursos',
      data: courses,
      searchFields: ['nombre', 'descripcion', 'instructor'],
      icon: () => <span>📚</span>,
      color: 'green'
    }
  ];

  const handleExport = (data: any[]) => {
    console.log('Exportando datos:', data);
    // Aquí implementarías la lógica de exportación real
    alert(`Exportando ${data.length} elementos`);
  };

  const handleGlobalSearchResult = (result: any, datasetName: string) => {
    console.log('Resultado seleccionado:', result, 'del dataset:', datasetName);
    alert(`Seleccionaste: ${result.nombre} de ${datasetName}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
          Demo de Búsqueda y Filtros Avanzados
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Demostración completa del sistema de búsqueda global, filtros avanzados, 
          ordenamiento por columnas y paginación mejorada.
        </p>
      </div>

      {/* Selector de demo */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveDemo('table')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
            activeDemo === 'table'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TableCellsIcon className="w-4 h-4" />
          <span>Tabla Avanzada</span>
        </button>
        <button
          onClick={() => setActiveDemo('global')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
            activeDemo === 'global'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <GlobeAltIcon className="w-4 h-4" />
          <span>Búsqueda Global</span>
        </button>
      </div>

      {/* Demo de tabla avanzada */}
      {activeDemo === 'table' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-blue-900 font-medium mb-2">Tabla Avanzada con Filtros</h4>
            <p className="text-blue-800 text-sm">
              Tabla con búsqueda en tiempo real, filtros avanzados, ordenamiento por columnas, 
              selección múltiple, vista de grid/tabla y exportación.
            </p>
          </div>

          <AdvancedTable
            data={participants}
            columns={participantColumns}
            searchConfig={{
              searchFields: ['nombre', 'email', 'empresa'],
              highlightMatches: true,
              caseSensitive: false
            }}
            filterConfigs={participantFilters}
            itemsPerPage={15}
            selectable={true}
            title="Participantes"
            description="Lista completa de participantes con filtros avanzados"
            onRowClick={(item) => console.log('Fila clickeada:', item)}
            onRowSelect={setSelectedItems}
            onExport={handleExport}
            emptyMessage="No se encontraron participantes"
          />

          {selectedItems.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="text-green-900 font-medium">Elementos Seleccionados:</h5>
              <p className="text-green-800 text-sm">
                {selectedItems.length} participantes seleccionados
              </p>
            </div>
          )}
        </div>
      )}

      {/* Demo de búsqueda global */}
      {activeDemo === 'global' && (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-green-900 font-medium mb-2">Búsqueda Global</h4>
            <p className="text-green-800 text-sm">
              Búsqueda unificada en múltiples datasets con resultados ordenados por relevancia, 
              sugerencias de búsqueda y navegación por teclado.
            </p>
          </div>

          <div className="max-w-2xl">
            <GlobalSearch
              datasets={globalSearchDatasets}
              onResultClick={handleGlobalSearchResult}
              placeholder="Buscar participantes, cursos, instructores..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h5 className="font-medium text-gray-900 mb-3">Participantes Disponibles</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {participants.slice(0, 10).map(participant => (
                  <div key={participant.id} className="text-sm text-gray-600">
                    {participant.nombre} - {participant.empresa}
                  </div>
                ))}
                <div className="text-xs text-gray-500 pt-2">
                  +{participants.length - 10} participantes más...
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h5 className="font-medium text-gray-900 mb-3">Cursos Disponibles</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {courses.slice(0, 10).map(course => (
                  <div key={course.id} className="text-sm text-gray-600">
                    {course.nombre} - {course.modalidad}
                  </div>
                ))}
                <div className="text-xs text-gray-500 pt-2">
                  +{courses.length - 10} cursos más...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de características */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="text-gray-900 font-medium mb-3 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          Características Implementadas:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-gray-700 text-sm space-y-1">
            <li>✅ Búsqueda en tiempo real con debounce</li>
            <li>✅ Filtros avanzados por tipo de dato</li>
            <li>✅ Ordenamiento por columnas</li>
            <li>✅ Paginación inteligente</li>
            <li>✅ Selección múltiple</li>
            <li>✅ Vista de tabla y grid</li>
          </ul>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>✅ Búsqueda global multi-dataset</li>
            <li>✅ Resaltado de coincidencias</li>
            <li>✅ Filtros rápidos</li>
            <li>✅ Exportación de datos</li>
            <li>✅ Configuración de columnas</li>
            <li>✅ Navegación por teclado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
