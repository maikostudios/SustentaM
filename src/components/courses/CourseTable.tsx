import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { Course } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const columnHelper = createColumnHelper<Course>();

export function CourseTable({ courses, onEdit, onDelete }: CourseTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contractorFilter, setContractorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener valores únicos para los filtros
  const uniqueContractors = useMemo(() => {
    const contractors = courses.map(course => course.contratista).filter(Boolean);
    return [...new Set(contractors)];
  }, [courses]);

  const uniqueTypes = useMemo(() => {
    const types = courses.map(course => course.tipo).filter(Boolean);
    return [...new Set(types)];
  }, [courses]);

  // Filtrar cursos
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Filtro de búsqueda general
      const matchesSearch = !searchTerm ||
        course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.contratista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por contratista
      const matchesContractor = !contractorFilter || course.contratista === contractorFilter;

      // Filtro por tipo
      const matchesType = !typeFilter || course.tipo === typeFilter;

      // Filtro por fechas
      const courseDate = new Date(course.fechaInicio);
      const fromDate = dateFromFilter ? new Date(dateFromFilter) : null;
      const toDate = dateToFilter ? new Date(dateToFilter) : null;

      const matchesDateFrom = !fromDate || courseDate >= fromDate;
      const matchesDateTo = !toDate || courseDate <= toDate;

      return matchesSearch && matchesContractor && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [courses, searchTerm, contractorFilter, typeFilter, dateFromFilter, dateToFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setContractorFilter('');
    setTypeFilter('');
    setDateFromFilter('');
    setDateToFilter('');
  };
  const columns = [
    columnHelper.accessor('codigo', {
      header: 'Código',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('nombre', {
      header: 'Nombre del Curso',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('duracionHoras', {
      header: 'Duración',
      cell: info => `${info.getValue()} horas`
    }),
    columnHelper.accessor('modalidad', {
      header: 'Modalidad',
      cell: info => info.getValue() === 'teams' ? 'Virtual (Teams)' : 'Presencial'
    }),
    columnHelper.accessor('fechaInicio', {
      header: 'Fecha Inicio',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('fechaFin', {
      header: 'Fecha Fin',
      cell: info => info.getValue()
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            aria-label={`Editar curso ${row.original.nombre}`}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(row.original.id)}
            aria-label={`Eliminar curso ${row.original.nombre}`}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    })
  ];

  const table = useReactTable({
    data: filteredCourses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="space-y-4">
      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {/* Buscador principal */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, código, contratista o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
            {(contractorFilter || typeFilter || dateFromFilter || dateToFilter) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-900"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Filtros avanzados */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contratista
              </label>
              <select
                value={contractorFilter}
                onChange={(e) => setContractorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los contratistas</option>
                {uniqueContractors.map(contractor => (
                  <option key={contractor} value={contractor}>
                    {contractor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Curso
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredCourses.length} de {courses.length} cursos
          {(searchTerm || contractorFilter || typeFilter || dateFromFilter || dateToFilter) && (
            <span className="ml-2 text-blue-600">
              (filtrado)
            </span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200" role="table">
        <caption className="sr-only">
          Lista de cursos disponibles con opciones de edición y eliminación
        </caption>
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, index) => (
            <tr 
              key={row.id}
              className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay cursos registrados</p>
        </div>
      )}
      </div>
    </div>
  );
}