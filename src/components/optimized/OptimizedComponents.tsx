import React, { memo, useMemo, useCallback } from 'react';
import { Course, Participant } from '../../types';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// Optimized Course Card with React.memo
interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  onViewDetails?: (course: Course) => void;
  isLoading?: boolean;
}

export const OptimizedCourseCard = memo<CourseCardProps>(({ 
  course, 
  onEdit, 
  onDelete, 
  onViewDetails,
  isLoading = false 
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(course);
  }, [onEdit, course]);

  const handleDelete = useCallback(() => {
    onDelete?.(course.id);
  }, [onDelete, course.id]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(course);
  }, [onViewDetails, course]);

  const statusColor = useMemo(() => {
    switch (course.estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [course.estado]);

  const formattedDate = useMemo(() => {
    return new Date(course.fechaInicio).toLocaleDateString('es-CL');
  }, [course.fechaInicio]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{course.nombre}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {course.estado}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p><span className="font-medium">Fecha:</span> {formattedDate}</p>
        <p><span className="font-medium">Duración:</span> {course.duracion} horas</p>
        <p><span className="font-medium">Modalidad:</span> {course.modalidad}</p>
      </div>

      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={handleViewDetails}>
          Ver Detalles
        </Button>
        <Button size="sm" variant="secondary" onClick={handleEdit}>
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={handleDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  );
});

OptimizedCourseCard.displayName = 'OptimizedCourseCard';

// Optimized Participant Row with React.memo
interface ParticipantRowProps {
  participant: Participant;
  onEdit?: (participant: Participant) => void;
  onToggleStatus?: (participantId: string) => void;
  isSelected?: boolean;
  onSelect?: (participantId: string) => void;
}

export const OptimizedParticipantRow = memo<ParticipantRowProps>(({ 
  participant, 
  onEdit, 
  onToggleStatus,
  isSelected = false,
  onSelect 
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(participant);
  }, [onEdit, participant]);

  const handleToggleStatus = useCallback(() => {
    onToggleStatus?.(participant.id);
  }, [onToggleStatus, participant.id]);

  const handleSelect = useCallback(() => {
    onSelect?.(participant.id);
  }, [onSelect, participant.id]);

  const statusColor = useMemo(() => {
    switch (participant.estado) {
      case 'aprobado': return 'text-green-600 bg-green-50';
      case 'reprobado': return 'text-red-600 bg-red-50';
      case 'en_progreso': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }, [participant.estado]);

  const attendancePercentage = useMemo(() => {
    return Math.round((participant.asistencia / 100) * 100);
  }, [participant.asistencia]);

  return (
    <tr className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{participant.nombre}</div>
        <div className="text-sm text-gray-500">{participant.rut}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{participant.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{attendancePercentage}%</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{participant.nota || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
          {participant.estado}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button size="sm" variant="outline" onClick={handleEdit} className="mr-2">
          Editar
        </Button>
        <Button size="sm" variant="secondary" onClick={handleToggleStatus}>
          Cambiar Estado
        </Button>
      </td>
    </tr>
  );
});

OptimizedParticipantRow.displayName = 'OptimizedParticipantRow';

// Optimized Stats Card with React.memo
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  isLoading?: boolean;
}

export const OptimizedStatsCard = memo<StatsCardProps>(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  color = 'blue',
  isLoading = false 
}) => {
  const colorClasses = useMemo(() => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600'
    };
    return colors[color];
  }, [color]);

  if (isLoading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {Icon && (
              <div className={`p-2 rounded-md ${colorClasses}`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && (
                <dd className="text-sm text-gray-500">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
});

OptimizedStatsCard.displayName = 'OptimizedStatsCard';

// Optimized List with virtualization for large datasets
interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}

export function VirtualizedList<T>({ 
  items, 
  renderItem, 
  itemHeight, 
  containerHeight,
  className = '' 
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div 
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
