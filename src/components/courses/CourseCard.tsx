import React from 'react';
import { Course } from '../../types';
import { Button } from '../ui/Button';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UsersIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

interface CourseCardProps {
  course: Course;
  participantCount?: number;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function CourseCard({ 
  course, 
  participantCount = 0, 
  onSelect, 
  onEdit, 
  onDelete,
  showActions = false 
}: CourseCardProps) {
  const isVirtual = course.modalidad === 'teams';
  const capacity = isVirtual ? 200 : 30;
  const occupancyPercentage = (participantCount / capacity) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-sans text-sm font-medium text-gray-500 dark:text-gray-400">{course.codigo}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              isVirtual
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
            }`}>
              {isVirtual ? 'Virtual' : 'Presencial'}
            </span>
          </div>

          <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {course.nombre}
          </h3>

          <p className="font-sans text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {course.objetivos}
          </p>
        </div>

        {isVirtual ? (
          <ComputerDesktopIcon className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0" />
        ) : (
          <BuildingOfficeIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <CalendarDaysIcon className="w-4 h-4" />
          <span className="font-sans">{course.fechaInicio} - {course.fechaFin}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <ClockIcon className="w-4 h-4" />
          <span className="font-sans">{course.duracionHoras} horas</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <UsersIcon className="w-4 h-4" />
          <span className="font-sans">{participantCount}/{capacity} inscritos</span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className={`font-sans font-medium ${
            occupancyPercentage > 90 ? 'text-red-600 dark:text-red-400' :
            occupancyPercentage > 70 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {occupancyPercentage.toFixed(0)}% ocupación
          </span>
        </div>
      </div>

      {participantCount > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                occupancyPercentage > 90 ? 'bg-red-500' :
                occupancyPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {onSelect && (
          <Button onClick={onSelect} size="sm">
            Gestionar Inscripciones
          </Button>
        )}
        
        {showActions && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete}>
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}