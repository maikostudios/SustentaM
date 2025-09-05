import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session } from '../../types';

interface MatrixCalendarProps {
  courses: Course[];
  sessions: Session[];
  currentDate: Date;
  onSessionSelect: (session: Session, course: Course) => void;
}

export function MatrixCalendar({ courses, sessions, currentDate, onSessionSelect }: MatrixCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Agrupar cursos por modalidad para mejor organización
  const presencialCourses = courses.filter(c => c.modalidad === 'presencial');
  const teamsCourses = courses.filter(c => c.modalidad === 'teams');

  const getSessionsForCourseAndDate = (courseId: string, date: Date) => {
    const dateStr = format(date, 'dd-MM-yyyy');
    return sessions.filter(session => 
      session.courseId === courseId && session.fecha === dateStr
    );
  };

  const getStatusColor = (courseId: string, date: Date) => {
    const courseSessions = getSessionsForCourseAndDate(courseId, date);
    if (courseSessions.length === 0) return null;

    const course = courses.find(c => c.id === courseId);
    if (!course) return null;

    // Colores según modalidad y estado
    if (course.modalidad === 'presencial') {
      return 'bg-blue-500'; // Azul para presencial
    } else {
      return 'bg-green-500'; // Verde para teams
    }
  };

  const handleSessionClick = (courseId: string, date: Date) => {
    const courseSessions = getSessionsForCourseAndDate(courseId, date);
    const course = courses.find(c => c.id === courseId);
    
    if (courseSessions.length > 0 && course) {
      onSessionSelect(courseSessions[0], course);
    }
  };

  const renderCourseRow = (course: Course) => (
    <div key={course.id} className="grid grid-cols-[280px_1fr] border-b border-gray-200 hover:bg-gray-50">
      {/* Información del curso */}
      <div className="p-2 border-r border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            course.modalidad === 'presencial' ? 'bg-blue-500' : 'bg-green-500'
          }`}></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {course.codigo}
            </p>
            <p className="text-xs text-gray-600 truncate leading-tight">
              {course.nombre}
            </p>
            <p className="text-xs text-gray-500">
              {course.duracionHoras}h
            </p>
          </div>
        </div>
      </div>

      {/* Grid de días */}
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(0, 1fr))` }}>
        {daysInMonth.map((date, index) => {
          const statusColor = getStatusColor(course.id, date);
          const courseSessions = getSessionsForCourseAndDate(course.id, date);
          const hasSession = courseSessions.length > 0;

          return (
            <div
              key={index}
              className={`h-8 border-r border-gray-100 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 ${
                hasSession ? 'bg-blue-50' : ''
              }`}
              onClick={() => hasSession && handleSessionClick(course.id, date)}
            >
              {hasSession && (
                <div className="flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                </div>
              )}

              {/* Tooltip con información de la sesión */}
              {hasSession && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {courseSessions[0].horaInicio} - {courseSessions[0].horaFin}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del calendario */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h2 className="text-lg font-bold text-center">
          CALENDARIO DE CAPACITACIÓN Y ENTRENAMIENTO
        </h2>
        <h3 className="text-base font-semibold text-center mt-1">
          {format(currentDate, 'MMMM, yyyy', { locale: es }).toUpperCase()}
        </h3>
      </div>

      {/* Header de días */}
      <div className="grid grid-cols-[280px_1fr] bg-gray-50 border-b border-gray-200">
        <div className="p-2 border-r border-gray-200">
          <span className="text-xs font-semibold text-gray-700">CURSOS</span>
        </div>
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(0, 1fr))` }}>
          {daysInMonth.map((date, index) => (
            <div key={index} className="h-8 border-r border-gray-200 flex flex-col items-center justify-center text-xs">
              <span className="font-medium text-gray-700 text-xs">
                {format(date, 'EEE', { locale: es }).charAt(0).toUpperCase()}
              </span>
              <span className="text-gray-600 text-xs">
                {format(date, 'd')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cursos Presenciales */}
      {presencialCourses.length > 0 && (
        <div>
          <div className="bg-blue-100 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-blue-800">CURSOS PRESENCIALES</h4>
          </div>
          {presencialCourses.map(renderCourseRow)}
        </div>
      )}

      {/* Cursos Teams/Online */}
      {teamsCourses.length > 0 && (
        <div>
          <div className="bg-green-100 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-green-800">CURSOS ONLINE (TEAMS)</h4>
          </div>
          {teamsCourses.map(renderCourseRow)}
        </div>
      )}

      {/* Leyenda */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Presencial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Teams/Online</span>
          </div>
          <div className="text-gray-600 text-xs">
            Haz clic en los puntos para acceder a la inscripción
          </div>
        </div>
      </div>
    </div>
  );
}
