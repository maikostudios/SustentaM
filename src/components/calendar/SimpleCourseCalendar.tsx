import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session } from '../../types';
import { mockCourses, mockSessions } from '../../lib/mockData';
import { Button } from '../ui/Button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SimpleCourseCalendarProps {
  onCourseSelect?: (course: Course, session: Session) => void;
  selectedCourse?: Course;
}

export function SimpleCourseCalendar({ onCourseSelect, selectedCourse }: SimpleCourseCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [courses] = useState<Course[]>(mockCourses);
  const [sessions] = useState<Session[]>(mockSessions);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Obtener eventos del calendario
  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return sessions.filter(session => session.fecha === dateStr);
  };

  // Obtener curso por ID
  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  // Generar días del mes
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtener color por modalidad
  const getModalityColor = (modalidad: string) => {
    switch (modalidad) {
      case 'presencial':
        return 'bg-blue-500 text-white';
      case 'teams':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del calendario */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2" />
              Calendario de Cursos
            </h2>
            <Button onClick={goToToday} variant="secondary" size="sm">
              Hoy
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={goToPreviousMonth} variant="ghost" size="sm">
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
            <Button onClick={goToNextMonth} variant="ghost" size="sm">
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="p-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border border-gray-100 cursor-pointer transition-colors ${
                  isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600 font-bold' : 
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                  {isToday && (
                    <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                  )}
                </div>

                {/* Eventos del día */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((session) => {
                    const course = getCourseById(session.courseId);
                    if (!course) return null;

                    return (
                      <div
                        key={session.id}
                        className={`text-xs p-1 rounded cursor-pointer transition-opacity hover:opacity-80 ${getModalityColor(course.modalidad)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCourseSelect?.(course, session);
                        }}
                        title={`${course.nombre} - ${session.horaInicio || ''} ${session.horaFin ? `a ${session.horaFin}` : ''}`}
                      >
                        <div className="font-medium truncate">{course.nombre}</div>
                        {session.horaInicio && (
                          <div className="flex items-center mt-1">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {session.horaInicio}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Presencial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Teams</span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Haz clic en un curso para ver detalles</span>
          </div>
        </div>
      </div>

      {/* Panel de detalles del día seleccionado */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Cursos del {format(selectedDate, 'dd \'de\' MMMM', { locale: es })}
          </h3>
          
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500">No hay cursos programados para este día.</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map((session) => {
                const course = getCourseById(session.courseId);
                if (!course) return null;

                return (
                  <div
                    key={session.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => onCourseSelect?.(course, session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course.nombre}</h4>
                        <p className="text-sm text-gray-600 mt-1">{course.codigo}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getModalityColor(course.modalidad)}`}>
                            {course.modalidad}
                          </span>
                          {session.horaInicio && (
                            <span className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {session.horaInicio} - {session.horaFin}
                            </span>
                          )}
                          <span className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-1" />
                            {session.capacity} cupos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SimpleCourseCalendar;
