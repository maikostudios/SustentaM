import React from 'react';
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
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const columnHelper = createColumnHelper<Course>();

export function CourseTable({ courses, onEdit, onDelete }: CourseTableProps) {
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
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
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
  );
}