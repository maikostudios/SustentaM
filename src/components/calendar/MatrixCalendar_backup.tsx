import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Session } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { logger } from '../../utils/logger';
import { isHoliday, getHolidayName, isWeekend } from '../../utils/holidays';
import { useMenuContext } from '../../contexts/MenuContext';
import { useThemeAware } from '../../hooks/useTheme';

interface MatrixCalendarProps {
  courses: Course[];
  sessions: Session[];
  currentDate: Date;
  onSessionSelect: (session: Session, course: Course) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

export function MatrixCalendar({ courses, sessions, currentDate, onSessionSelect, onNavigateMonth }: MatrixCalendarProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const { isMenuCollapsed } = useMenuContext();
  const theme = useThemeAware();

  useEffect(() => {
    logger.info('MatrixCalendar', 'Componente MatrixCalendar montado', {
      coursesCount: courses.length,
      sessionsCount: sessions.length
    });
  }, []);

  // Función para obtener sesiones de una fecha específica
  const getSessionsForDate = (date: Date): Session[] => {
    return sessions.filter(session => {
      try {
        const sessionDate = new Date(session.fecha);
        return isSameDay(sessionDate, date);
      } catch (error) {
        logger.error('MatrixCalendar', 'Error parsing session date', { session, error });
        return false;
      }
    });
  };

  // Obtener días del mes
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Separar cursos por tipo - usar todos los cursos disponibles
  const propiosYEccCourses = courses.slice(0, 8); // Primeros 8 cursos para PROPIOS Y ECC
  const propiosCourses = courses.slice(0, 6); // Primeros 6 cursos para PROPIOS

  // Función para manejar navegación con transición fluida
  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNavigateMonth(direction);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  // SOLUCIÓN MEJORADA: Ajuste automático según resolución y zoom
  const getGridConfig = () => {
    const totalDays = days.length;

    // Si no tenemos el ancho del contenedor aún, usar valores por defecto ultra-optimizados
    if (containerWidth === 0) {
      return {
        courseWidth: 120,
        hoursWidth: 35,
        dayWidth: 28,
        gridTemplate: `120px 35px repeat(${totalDays}, 28px)`,
        totalWidth: 120 + 35 + (totalDays * 28),
        totalDays,
        containerWidth: 0,
        menuState: isMenuCollapsed ? 'COLLAPSED' : 'EXPANDED'
      };
    }

    // Tamaños base ultra-optimizados - OBJETIVO: 30 DÍAS VISIBLES
    const BASE_SIZES = {
      courseWidth: Math.max(100, Math.min(140, containerWidth * 0.10)), // 10% del ancho disponible, min 100px, max 140px
      hoursWidth: 35, // Ultra reducido para horas
    };

    // Calcular ancho disponible para días - OPTIMIZADO PARA 30 DÍAS
    const availableForDays = containerWidth - BASE_SIZES.courseWidth - BASE_SIZES.hoursWidth;
    const dayWidth = Math.max(26, Math.floor(availableForDays / totalDays)); // Mínimo 26px por día - balance entre legibilidad y cantidad

    const gridTemplate = `${BASE_SIZES.courseWidth}px ${BASE_SIZES.hoursWidth}px repeat(${totalDays}, ${dayWidth}px)`;

    return {
      courseWidth: BASE_SIZES.courseWidth,
      hoursWidth: BASE_SIZES.hoursWidth,
      dayWidth,
      gridTemplate,
      totalWidth: BASE_SIZES.courseWidth + BASE_SIZES.hoursWidth + (totalDays * dayWidth),
      totalDays,
      containerWidth,
      // Info para debug
      menuState: isMenuCollapsed ? 'COLLAPSED' : 'EXPANDED'
    };
  };

  const gridConfig = getGridConfig();

  // Función para obtener color de modalidad
  const getModalityColor = (modalidad: string, matrixType: 'propios-ecc' | 'propios') => {
    const baseColors = {
      'propios-ecc': {
        'presencial': 'bg-blue-500 hover:bg-blue-600 border-blue-600',
        'online': 'bg-green-500 hover:bg-green-600 border-green-600',
        'hibrido': 'bg-teal-500 hover:bg-teal-600 border-teal-600'
      },
      'propios': {
        'presencial': 'bg-purple-500 hover:bg-purple-600 border-purple-600',
        'online': 'bg-indigo-500 hover:bg-indigo-600 border-indigo-600',
        'hibrido': 'bg-violet-500 hover:bg-violet-600 border-violet-600'
      }
    };

    return baseColors[matrixType][modalidad.toLowerCase()] || 'bg-gray-500 hover:bg-gray-600 border-gray-600';
  };

  // Obtener estilo para días no laborables
  const getDayStyle = (date: Date) => {
    if (isHoliday(date)) {
      return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
    if (isWeekend(date)) {
      return `${theme.bgSecondary} border ${theme.border}`;
    }
    return `${theme.bg} border ${theme.border}`;
  };

  return (
    <div className="space-y-6">
      {/* Navegación de meses */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => handleNavigateMonth('prev')}
          disabled={isTransitioning}
          className={`p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110 ${
            isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Mes anterior"
        >
          <ChevronLeftIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </Button>

        <h4 className={`text-2xl font-black text-blue-600 dark:text-blue-400 min-w-64 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 transition-all duration-300 ${
          isTransitioning ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
        }`}>
          {format(currentDate, 'MMMM, yyyy', { locale: es }).toUpperCase()}
        </h4>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => handleNavigateMonth('next')}
          disabled={isTransitioning}
          className={`p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110 ${
            isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Mes siguiente"
        >
          <ChevronRightIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </Button>
      </div>

      {/* Calendario básico */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => (
            <div
              key={index}
              className={`p-3 text-center rounded-lg transition-colors ${getDayStyle(date)}`}
            >
              <div className="text-sm font-medium">{format(date, 'd')}</div>
              {getSessionsForDate(date).length > 0 && (
                <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
