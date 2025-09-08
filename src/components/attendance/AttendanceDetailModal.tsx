import React, { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  CalendarDaysIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/ToastContext';

interface AttendanceSession {
  id: string;
  fecha: string;
  tema: string;
  duracion: number;
  asistio: boolean;
  observaciones?: string;
}

interface ParticipantAttendance {
  participantId: string;
  participantName: string;
  participantRut: string;
  courseId: string;
  courseName: string;
  sessions: AttendanceSession[];
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
}

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: {
    id: string;
    nombre: string;
    rut: string;
    curso: string;
  } | null;
  onUpdateAttendance: (participantId: string, sessionId: string, attended: boolean) => void;
}

// Datos mock de sesiones para demostración
const MOCK_SESSIONS: AttendanceSession[] = [
  {
    id: '1',
    fecha: '2024-08-01',
    tema: 'Introducción al curso',
    duracion: 120,
    asistio: true,
    observaciones: 'Participación activa'
  },
  {
    id: '2',
    fecha: '2024-08-03',
    tema: 'Fundamentos básicos',
    duracion: 90,
    asistio: true
  },
  {
    id: '3',
    fecha: '2024-08-05',
    tema: 'Práctica dirigida',
    duracion: 150,
    asistio: false,
    observaciones: 'Justificó ausencia por motivos médicos'
  },
  {
    id: '4',
    fecha: '2024-08-08',
    tema: 'Evaluación intermedia',
    duracion: 120,
    asistio: true
  },
  {
    id: '5',
    fecha: '2024-08-10',
    tema: 'Proyecto práctico',
    duracion: 180,
    asistio: true,
    observaciones: 'Excelente trabajo en equipo'
  },
  {
    id: '6',
    fecha: '2024-08-12',
    tema: 'Revisión y feedback',
    duracion: 90,
    asistio: false
  },
  {
    id: '7',
    fecha: '2024-08-15',
    tema: 'Taller avanzado',
    duracion: 120,
    asistio: true
  },
  {
    id: '8',
    fecha: '2024-08-17',
    tema: 'Evaluación final',
    duracion: 150,
    asistio: true,
    observaciones: 'Presentación sobresaliente'
  }
];

export function AttendanceDetailModal({ 
  isOpen, 
  onClose, 
  participant, 
  onUpdateAttendance 
}: AttendanceDetailModalProps) {
  const [sessions, setSessions] = useState<AttendanceSession[]>(MOCK_SESSIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const notifications = useNotifications();

  // Filtrar sesiones por término de búsqueda
  const filteredSessions = useMemo(() => {
    if (!searchTerm) return sessions;
    
    const term = searchTerm.toLowerCase();
    return sessions.filter(session =>
      session.tema.toLowerCase().includes(term) ||
      session.fecha.includes(term) ||
      session.observaciones?.toLowerCase().includes(term)
    );
  }, [sessions, searchTerm]);

  // Calcular estadísticas
  const attendedSessions = sessions.filter(s => s.asistio).length;
  const attendancePercentage = (attendedSessions / sessions.length) * 100;

  const handleToggleAttendance = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, asistio: !session.asistio }
        : session
    ));

    const session = sessions.find(s => s.id === sessionId);
    if (participant && session) {
      onUpdateAttendance(participant.id, sessionId, !session.asistio);
      
      notifications.success(
        'Asistencia actualizada',
        `Se ${!session.asistio ? 'marcó' : 'desmarcó'} la asistencia para "${session.tema}"`
      );
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (!participant) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Detalle de Asistencia" 
      size="xl"
    >
      <div className="space-y-6">
        {/* Header con información del participante */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              <div>
                <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">{participant.nombre}</h3>
                <p className="font-sans text-sm text-gray-600 dark:text-gray-400">RUT: {participant.rut}</p>
                <div className="flex items-center mt-1">
                  <AcademicCapIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" />
                  <span className="font-sans text-sm text-gray-600 dark:text-gray-400">{participant.curso}</span>
                </div>
              </div>
            </div>
            
            {/* Estadísticas de asistencia */}
            <div className="text-right">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(attendancePercentage)}`}>
                {attendancePercentage.toFixed(1)}% Asistencia
              </div>
              <p className="font-sans text-xs text-gray-500 dark:text-gray-400 mt-1">
                {attendedSessions} de {sessions.length} sesiones
              </p>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Buscar por tema, fecha u observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Resumen estadístico */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              <div className="ml-3">
                <div className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">{sessions.length}</div>
                <div className="font-sans text-xs text-gray-600 dark:text-gray-400">Total Sesiones</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
              <div className="ml-3">
                <div className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">{attendedSessions}</div>
                <div className="font-sans text-xs text-gray-600 dark:text-gray-400">Asistidas</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />
              <div className="ml-3">
                <div className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">{sessions.length - attendedSessions}</div>
                <div className="font-sans text-xs text-gray-600 dark:text-gray-400">Ausencias</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              <div className="ml-3">
                <div className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {sessions.filter(s => s.asistio).reduce((total, s) => total + s.duracion, 0)}
                </div>
                <div className="font-sans text-xs text-gray-600 dark:text-gray-400">Min. Asistidas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de sesiones */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Observaciones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(session.fecha).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {session.tema}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {session.duracion} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {session.asistio ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className={`text-sm font-medium ${
                          session.asistio ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {session.asistio ? 'Presente' : 'Ausente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {session.observaciones || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAttendance(session.id)}
                        className={session.asistio ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}
                      >
                        {session.asistio ? 'Marcar Ausente' : 'Marcar Presente'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-8">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="font-sans mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No se encontraron sesiones</h3>
              <p className="font-sans mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay sesiones registradas.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
