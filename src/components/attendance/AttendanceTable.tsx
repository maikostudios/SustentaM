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
import { formatGradeAsPercentage, getGradeStatusClasses, isGradeApproved } from '../../utils/gradeUtils';
import { AttendanceDetailModal } from './AttendanceDetailModal';
import { PencilIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Modal } from '../ui/Modal';
import { useNotifications } from '../../contexts/ToastContext';
import { useForm } from 'react-hook-form';

interface AttendanceTableProps {
  participants: Participant[];
  onUpdateAttendance: (participantId: string, asistencia: number, calificacion: number) => void;
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
  const [showAttendanceDetail, setShowAttendanceDetail] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const notifications = useNotifications();

  // Usar react-hook-form para manejar los inputs de edición
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<{
    asistencia: number;
    calificacion: number;
  }>();

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id);
    // Establecer valores en el formulario
    setValue('asistencia', participant.asistencia);
    setValue('calificacion', participant.calificacion);
  };

  const onSubmitEdit = (data: { asistencia: number; calificacion: number }) => {
    if (editingId) {
      onUpdateAttendance(editingId, data.asistencia, data.calificacion);
      setEditingId(null);
      reset();

      notifications.showNotification({
        type: 'success',
        title: 'Datos Actualizados',
        message: 'Asistencia y calificación guardadas correctamente',
        duration: 3000
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  const handleShowAttendanceDetail = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowAttendanceDetail(true);
  };

  const handleUpdateSessionAttendance = (participantId: string, sessionId: string, attended: boolean) => {
    // Aquí se actualizaría la asistencia de la sesión específica
    // Por ahora solo mostramos el cambio en consola
    console.log(`Updating session ${sessionId} for participant ${participantId}: ${attended ? 'Present' : 'Absent'}`);
  };

  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (participantToDelete) {
      // Simular eliminación del registro
      notifications.success(
        'Registro eliminado',
        `El registro de ${participantToDelete.nombre} ha sido eliminado exitosamente.`
      );
      setShowDeleteModal(false);
      setParticipantToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setParticipantToDelete(null);
  };

  const columns = [
    columnHelper.accessor('nombre', {
      header: 'NOMBRE',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('rut', {
      header: 'RUT',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('contractor', {
      header: 'EMPRESA',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('asistencia', {
      header: 'ASISTENCIA',
      cell: ({ row }) => {
        const participant = row.original;
        const isEditing = editingId === participant.id;
        
        if (isEditing) {
          return (
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              {...register('asistencia', {
                valueAsNumber: true,
                min: { value: 0, message: 'Mínimo 0%' },
                max: { value: 100, message: 'Máximo 100%' },
                required: 'Asistencia requerida'
              })}
              onFocus={(e) => e.target.select()}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Porcentaje de asistencia"
              placeholder="0-100"
            />
          );
        }
        
        return (
          <span className={`font-medium px-2 py-1 rounded ${
            participant.asistencia >= 80
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {participant.asistencia}%
          </span>
        );
      }
    }),
    columnHelper.accessor('calificacion', {
      header: 'CALIFICACIÓN',
      cell: ({ row }) => {
        const participant = row.original;
        const isEditing = editingId === participant.id;

        if (isEditing) {
          return (
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              {...register('calificacion', {
                valueAsNumber: true,
                min: { value: 0, message: 'Mínimo 0%' },
                max: { value: 100, message: 'Máximo 100%' },
                required: 'Calificación requerida'
              })}
              onFocus={(e) => e.target.select()}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Calificación en porcentaje"
              placeholder="0-100"
            />
          );
        }

        // Como ya guardamos porcentajes directamente, no necesitamos conversión
        const percentage = participant.calificacion;
        const statusClasses = percentage >= 80
          ? { badge: 'bg-green-100 text-green-800' }
          : { badge: 'bg-red-100 text-red-800' };

        return (
          <span className={`font-medium px-2 py-1 rounded ${statusClasses.badge}`}>
            {percentage}%
          </span>
        );
      }
    }),
    columnHelper.accessor('estado', {
      header: 'ESTADO',
      cell: ({ row }) => {
        const participant = row.original;
        // Como usamos porcentajes directamente, aprobado es >= 80%
        const isApproved = participant.asistencia >= 80 && participant.calificacion >= 80;
        const estado = isApproved ? 'APROBADO' : 'REPROBADO';

        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {estado}
          </span>
        );
      }
    }),
    columnHelper.display({
      id: 'attendance-detail',
      header: 'DETALLE ASISTENCIA',
      cell: ({ row }) => {
        const participant = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShowAttendanceDetail(participant)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900"
            title="Ver detalle de asistencia por sesión"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Ver Detalle</span>
          </Button>
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
                onClick={handleSubmit(onSubmitEdit)}
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
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(participant)}
              aria-label={`Editar asistencia de ${participant.nombre}`}
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(participant)}
              aria-label={`Eliminar registro de ${participant.nombre}`}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
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
        <h2 className="section-title">
          ASISTENCIA Y CALIFICACIONES
        </h2>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onImportAttendance}
            className="flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            <span>IMPORTAR ASISTENCIA</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onImportGrades}
            className="flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            <span>IMPORTAR CALIFICACIONES</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={onExportReport}
            className="flex items-center space-x-2"
            disabled={participants.length === 0}
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>EXPORTAR PDF</span>
          </Button>
        </div>
      </div>

      {participants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="font-sans text-2xl font-bold text-blue-600 dark:text-blue-400">{participants.length}</div>
            <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Total Inscritos</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="font-sans text-2xl font-bold text-green-600 dark:text-green-400">
              {participants.filter(p => p.asistencia >= 80 && p.calificacion >= 80).length}
            </div>
            <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Aprobados</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="font-sans text-2xl font-bold text-red-600 dark:text-red-400">
              {participants.filter(p => p.asistencia < 80 || p.calificacion < 80).length}
            </div>
            <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Reprobados</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="font-sans text-2xl font-bold text-gray-600 dark:text-gray-300">
              {participants.length > 0
                ? `${(participants.reduce((acc, p) => acc + p.asistencia, 0) / participants.length).toFixed(1)}%`
                : '0%'
              }
            </div>
            <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Asistencia Promedio</div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <caption className="sr-only">
            Tabla de asistencia y calificaciones de participantes
          </caption>
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {participants.length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-gray-500 dark:text-gray-400">No hay participantes registrados</p>
          </div>
        )}
      </div>

      {/* Modal de detalle de asistencia */}
      <AttendanceDetailModal
        isOpen={showAttendanceDetail}
        onClose={() => {
          setShowAttendanceDetail(false);
          setSelectedParticipant(null);
        }}
        participant={selectedParticipant ? {
          id: selectedParticipant.id,
          nombre: selectedParticipant.nombre,
          rut: selectedParticipant.rut,
          curso: selectedParticipant.curso
        } : null}
        onUpdateAttendance={handleUpdateSessionAttendance}
      />

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            ¿Estás seguro que quieres eliminar el registro de{' '}
            <span className="font-semibold">{participantToDelete?.nombre}</span>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleCancelDelete}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Sí, confirmo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}