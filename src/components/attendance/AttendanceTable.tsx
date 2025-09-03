import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { Participant } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PencilIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface AttendanceTableProps {
  participants: Participant[];
  onUpdateAttendance: (participantId: string, asistencia: number, nota: number) => void;
  onImportAttendance: () => void;
  onImportGrades: () => void;
  onExportReport: () => void;
}

const columnHelper = createColumnHelper<Participant>();

export function AttendanceTable({
  participants,
  onUpdateAttendance,
  onImportAttendance,
  onImportGrades,
  onExportReport
}: AttendanceTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ asistencia: number; nota: number }>({
    asistencia: 0,
    nota: 0
  });

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id);
    setEditData({
      asistencia: participant.asistencia,
      nota: participant.nota
    });
  };

  const handleSave = () => {
    if (editingId) {
      onUpdateAttendance(editingId, editData.asistencia, editData.nota);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ asistencia: 0, nota: 0 });
  };

  const columns = [
    columnHelper.accessor('nombre', {
      header: 'Nombre',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('rut', {
      header: 'RUT',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('contractor', {
      header: 'Contratista',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('asistencia', {
      header: 'Asistencia (%)',
      cell: ({ row }) => {
        const participant = row.original;
        const isEditing = editingId === participant.id;
        
        if (isEditing) {
          return (
            <input
              type="number"
              min="0"
              max="100"
              value={editData.asistencia}
              onChange={(e) => setEditData({ ...editData, asistencia: Number(e.target.value) })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              aria-label="Porcentaje de asistencia"
            />
          );
        }
        
        return (
          <span className={`font-medium ${
            participant.asistencia >= 50 ? 'text-green-600' : 'text-red-600'
          }`}>
            {participant.asistencia}%
          </span>
        );
      }
    }),
    columnHelper.accessor('nota', {
      header: 'Nota',
      cell: ({ row }) => {
        const participant = row.original;
        const isEditing = editingId === participant.id;
        
        if (isEditing) {
          return (
            <input
              type="number"
              min="1"
              max="7"
              step="0.1"
              value={editData.nota}
              onChange={(e) => setEditData({ ...editData, nota: Number(e.target.value) })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              aria-label="Nota"
            />
          );
        }
        
        return (
          <span className={`font-medium ${
            participant.nota >= 4.0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {participant.nota.toFixed(1)}
          </span>
        );
      }
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: info => {
        const estado = info.getValue();
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            estado === 'aprobado' ? 'bg-green-100 text-green-800' :
            estado === 'reprobado' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </span>
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const participant = row.original;
        const isEditing = editingId === participant.id;
        
        if (isEditing) {
          return (
            <div className="flex space-x-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
              >
                Guardar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          );
        }
        
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(participant)}
            aria-label={`Editar asistencia de ${participant.nombre}`}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        );
      }
    })
  ];

  const table = useReactTable({
    data: participants,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Asistencia y Calificaciones
        </h2>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onImportAttendance}
            className="flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            <span>Importar Asistencia</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onImportGrades}
            className="flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            <span>Importar Notas</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={onExportReport}
            className="flex items-center space-x-2"
            disabled={participants.length === 0}
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Exportar PDF</span>
          </Button>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
            <div className="text-sm text-gray-600">Total Inscritos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {participants.filter(p => p.estado === 'aprobado').length}
            </div>
            <div className="text-sm text-gray-600">Aprobados</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {participants.filter(p => p.estado === 'reprobado').length}
            </div>
            <div className="text-sm text-gray-600">Reprobados</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {participants.length > 0 
                ? `${(participants.reduce((acc, p) => acc + p.asistencia, 0) / participants.length).toFixed(1)}%`
                : '0%'
              }
            </div>
            <div className="text-sm text-gray-600">Asistencia Promedio</div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <caption className="sr-only">
            Tabla de asistencia y calificaciones de participantes
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
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {participants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay participantes registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}