import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// FullCalendar CSS will be handled by the component's inline styles
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session } from '../../types';
import { useCourseStore } from '../../store/courseStore';
import { Button } from '../ui/Button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarDaysIcon,
  UsersIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface FullCourseCalendarProps {
  onCourseSelect: (course: Course, session: Session) => void;
  selectedCourse?: Course;
}

export function FullCourseCalendar({ onCourseSelect, selectedCourse }: FullCourseCalendarProps) {
  const { courses, sessions, loadCourses, loadSessions } = useCourseStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek'>('dayGridMonth');

  useEffect(() => {
    loadCourses();
    loadSessions();
  }, [loadCourses, loadSessions]);

  // Convertir cursos y sesiones a eventos de FullCalendar
  const events = sessions.map(session => {
    const course = courses.find(c => c.id === session.courseId);
    if (!course) return null;

    // Determinar color según tipo de curso (simulado)
    const isOwnCourse = course.codigo.startsWith('PROP-'); // Simulación: cursos propios empiezan con PROP-
    const backgroundColor = isOwnCourse ? '#3B82F6' : '#6B7280'; // Azul para propios, gris para externos
    const borderColor = isOwnCourse ? '#1D4ED8' : '#4B5563';

    return {
      id: session.id,
      title: `${course.nombre} (${course.modalidad})`,
      start: session.fecha,
      backgroundColor,
      borderColor,
      textColor: '#FFFFFF',
      extendedProps: {
        course,
        session,
        capacity: session.capacity,
        enrolled: session.enrolledCount || 0,
        modalidad: course.modalidad,
        codigo: course.codigo,
        isOwnCourse
      }
    };
  }).filter(Boolean);

  const handleEventClick = (clickInfo: any) => {
    const { course, session } = clickInfo.event.extendedProps;
    onCourseSelect(course, session);
  };

  const handleDateClick = (dateClickInfo: any) => {
    // Buscar si hay eventos en esta fecha
    const dateEvents = events.filter(event => 
      event && format(parseISO(event.start), 'yyyy-MM-dd') === dateClickInfo.dateStr
    );
    
    if (dateEvents.length === 1) {
      const event = dateEvents[0];
      const { course, session } = event.extendedProps;
      onCourseSelect(course, session);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const { capacity, enrolled, modalidad, isOwnCourse } = eventInfo.event.extendedProps;
    
    return (
      <div className="p-1 text-xs">
        <div className="font-semibold truncate">{eventInfo.event.title}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="flex items-center">
            <UsersIcon className="w-3 h-3 mr-1" />
            {enrolled}/{capacity}
          </span>
          <span className="text-xs opacity-75">
            {modalidad === 'presencial' ? '🏢' : '💻'}
          </span>
        </div>
        {isOwnCourse && (
          <div className="text-xs opacity-75">Propio</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header con controles */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Calendario de Cursos
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'dayGridMonth' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('dayGridMonth')}
            >
              Mes
            </Button>
            <Button
              variant={view === 'timeGridWeek' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('timeGridWeek')}
            >
              Semana
            </Button>
          </div>
        </div>

        {/* Leyenda de colores */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Cursos Propios</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
            <span>Cursos Externos</span>
          </div>
          <div className="flex items-center text-gray-600">
            <InformationCircleIcon className="w-4 h-4 mr-1" />
            <span>Haz clic en un evento para inscribir participantes</span>
          </div>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="p-4">
        <style>{`
          .fc {
            font-family: inherit;
          }
          .fc-button {
            background-color: #3B82F6;
            border-color: #3B82F6;
            color: white;
          }
          .fc-button:hover {
            background-color: #2563EB;
            border-color: #2563EB;
          }
          .fc-button-primary:not(:disabled):active,
          .fc-button-primary:not(:disabled).fc-button-active {
            background-color: #1D4ED8;
            border-color: #1D4ED8;
          }
          .fc-today-button {
            background-color: #6B7280;
            border-color: #6B7280;
          }
          .fc-today-button:hover {
            background-color: #4B5563;
            border-color: #4B5563;
          }
          .fc-daygrid-event {
            border-radius: 6px;
            border-left-width: 4px;
          }
          .fc-event-title {
            font-weight: 500;
          }
          .fc-col-header-cell {
            background-color: #F9FAFB;
            font-weight: 600;
            color: #374151;
          }
          .fc-daygrid-day-number {
            color: #111827;
            font-weight: 500;
          }
          .fc-day-today {
            background-color: #EFF6FF;
          }
          .fc-day-today .fc-daygrid-day-number {
            color: #2563EB;
            font-weight: 700;
          }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          locale="es"
          height="auto"
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventDisplay="block"
          displayEventTime={false}
          dayHeaderFormat={{ weekday: 'short' }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
          }}
          // Accesibilidad
          eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          dayCellClassNames="hover:bg-gray-50 transition-colors"
          // Navegación por teclado
          selectMirror={true}
          selectable={true}
          // Responsive
          aspectRatio={window.innerWidth < 768 ? 1.0 : 1.35}
        />
      </div>

      {/* Información del curso seleccionado */}
      {selectedCourse && (
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Curso Seleccionado: {selectedCourse.nombre}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">Código:</span> {selectedCourse.codigo}
            </div>
            <div>
              <span className="font-medium">Modalidad:</span> {selectedCourse.modalidad}
            </div>
            <div>
              <span className="font-medium">Duración:</span> {selectedCourse.duracionHoras}h
            </div>
            <div>
              <span className="font-medium">Capacidad:</span> {selectedCourse.modalidad === 'presencial' ? '30' : '200'} personas
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
