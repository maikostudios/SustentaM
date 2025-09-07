import React, { useState, useEffect } from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session } from '../../types';
import { useCourseStore } from '../../store/courseStore';
import { Button } from '../ui/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { MatrixCalendar } from './MatrixCalendar';
import { CalendarViewSelector, CalendarViewType } from './CalendarViewSelector';
import { logger } from '../../utils/logger';
import { isHoliday, getHolidayName, isWeekend, isNonWorkingDay } from '../../utils/holidays';
import { useMenuContext } from '../../contexts/MenuContext';

interface CourseCalendarProps {
  onSelectSession: (session: Session, course: Course) => void;
}

export function CourseCalendar({ onSelectSession }: CourseCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('traditional');
  const { courses, sessions, fetchCourses, fetchSessions } = useCourseStore();
  const { isMenuCollapsed } = useMenuContext();

  useEffect(() => {
    logger.info('CourseCalendar', 'Componente CourseCalendar montado');
    logger.debug('CourseCalendar', 'Estado inicial', { viewType, currentDate });
    fetchCourses();
    fetchSessions();
  }, [fetchCourses, fetchSessions]);

  useEffect(() => {
    logger.debug('CourseCalendar', 'Datos actualizados', {
      coursesCount: courses.length,
      sessionsCount: sessions.length,
      viewType
    });
  }, [courses, sessions, viewType]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    logger.info('CourseCalendar', `Navegando al mes ${direction}`, { newDate: newDate.toISOString() });
    setCurrentDate(newDate);
  };

  const handleViewChange = (newViewType: CalendarViewType) => {
    logger.info('CourseCalendar', 'Cambiando vista de calendario', { from: viewType, to: newViewType });
    setViewType(newViewType);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, 'dd-MM-yyyy');
    return sessions.filter(session => session.fecha === dateStr);
  };

  const getCourseForSession = (session: Session) => {
    return courses.find(course => course.id === session.courseId);
  };

  const getModalityColor = (modalidad: string) => {
    return modalidad === 'teams' 
      ? 'bg-green-500 hover:bg-green-600' 
      : 'bg-blue-500 hover:bg-blue-600';
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-red-600">
          Calendario de Cursos
        </h2>

        {/* Selector de vista */}
        <div className="flex items-center space-x-4">
          <CalendarViewSelector
            currentView={viewType}
            onViewChange={handleViewChange}
          />

          {/* Navegación de mes */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              aria-label="Mes anterior"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <span className="text-lg font-medium min-w-48 text-center">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              aria-label="Mes siguiente"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Renderizado condicional según el tipo de vista */}
      {viewType === 'matrix' ? (
        <MatrixCalendar
          courses={courses}
          sessions={sessions}
          currentDate={currentDate}
          onSessionSelect={onSelectSession}
          onNavigateMonth={navigateMonth}
        />
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50 rounded-md">
                {day}
              </div>
            ))}
          </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-3 min-h-[140px]" />;
          }

          const sessionsForDate = getSessionsForDate(date);
          const isToday = isSameDay(date, new Date());
          const holidayName = getHolidayName(date);
          const isNonWorking = isNonWorkingDay(date);

          return (
            <div
              key={date.toISOString()}
              className={`p-3 min-h-[140px] border-2 rounded-lg transition-all duration-200 ${
                isNonWorking
                  ? 'bg-red-50 border-red-200'
                  : isToday
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              title={holidayName || undefined}
            >
              <div className={`text-sm font-semibold mb-3 ${
                isNonWorking
                  ? 'text-red-700'
                  : isToday
                    ? 'text-blue-700'
                    : 'text-gray-900'
              }`}>
                {date.getDate()}
                {holidayName && (
                  <div className="text-xs text-red-600 font-normal mt-1">
                    {holidayName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {sessionsForDate.slice(0, 2).map(session => {
                  const course = getCourseForSession(session);
                  if (!course) return null;

                  return (
                    <button
                      key={session.id}
                      onClick={() => onSelectSession(session, course)}
                      className={`w-full text-xs p-2 rounded-md text-white text-left transition-all duration-200 hover:scale-105 hover:shadow-md ${getModalityColor(course.modalidad)}`}
                      title={`${course.nombre} - ${course.modalidad}`}
                      aria-label={`Seleccionar sesión ${course.nombre} del ${session.fecha}`}
                    >
                      <div className="font-medium truncate">{course.codigo}</div>
                      <div className="text-xs opacity-90 truncate mt-1">{course.nombre}</div>
                    </button>
                  );
                })}
                {sessionsForDate.length > 2 && (
                  <div className="text-xs text-gray-500 text-center py-1 bg-gray-50 rounded">
                    +{sessionsForDate.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Presencial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Virtual (Teams)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}