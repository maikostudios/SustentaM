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

  // Detectar ancho disponible del contenedor
  useEffect(() => {
    const updateWidth = () => {
      // Calcular ancho disponible considerando el estado del menú
      const viewportWidth = window.innerWidth;
      const sidebarWidth = isMenuCollapsed ? 80 : 280; // Ancho del sidebar
      const padding = 64; // Padding del contenedor (32px * 2)
      const availableWidth = viewportWidth - sidebarWidth - padding;
      setContainerWidth(availableWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isMenuCollapsed]);

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

    // Si no tenemos el ancho del contenedor aún, usar valores por defecto
    if (containerWidth === 0) {
      return {
        courseWidth: 160,
        hoursWidth: 50,
        dayWidth: 28,
        gridTemplate: `160px 50px repeat(${totalDays}, 28px)`,
        totalWidth: 160 + 50 + (totalDays * 28),
        totalDays,
        containerWidth: 0,
        menuState: isMenuCollapsed ? 'COLLAPSED' : 'EXPANDED'
      };
    }

    // Tamaños base adaptativos - REDUCIDO para más espacio a los días
    const BASE_SIZES = {
      courseWidth: Math.max(140, Math.min(180, containerWidth * 0.15)), // 15% del ancho disponible, min 140px, max 180px
      hoursWidth: 50, // Fijo para horas
    };

    // Calcular ancho disponible para días
    const availableForDays = containerWidth - BASE_SIZES.courseWidth - BASE_SIZES.hoursWidth;
    const dayWidth = Math.max(24, Math.floor(availableForDays / totalDays)); // Mínimo 24px por día

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

  // Obtener sesiones para una fecha específica
  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return sessions.filter(session => session.fecha === dateStr);
  };

  // Obtener curso por ID
  const getCourseForSession = (session: Session) => {
    return courses.find(course => course.id === session.courseId);
  };

  // Obtener color según modalidad y tipo de matriz - SOLO modalidades válidas
  const getModalityColor = (modalidad: string, matrixType: 'propios-ecc' | 'propios') => {
    const baseColors = {
      'propios-ecc': {
        presencial: 'bg-blue-500 hover:bg-blue-600 border-blue-600',
        teams: 'bg-green-500 hover:bg-green-600 border-green-600'
      },
      'propios': {
        presencial: 'bg-purple-500 hover:bg-purple-600 border-purple-600',
        teams: 'bg-indigo-500 hover:bg-indigo-600 border-indigo-600'
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

  // Renderizar matriz - UX/UI completamente mejorado
  const renderMatrix = (matrixCourses: Course[], title: string, matrixType: 'propios-ecc' | 'propios', bgColor: string) => (
    <div className={`rounded-2xl shadow-2xl p-8 ${bgColor} border-4 ${matrixType === 'propios-ecc' ? 'border-blue-300 dark:border-blue-700' : 'border-purple-300 dark:border-purple-700'}`}>
      <div className={`${theme.bg} rounded-2xl p-8 shadow-inner`}>
        <div className="flex items-center justify-center mb-8">
          <h3 className={`text-3xl font-black text-center ${matrixType === 'propios-ecc' ? 'text-blue-900 dark:text-blue-400' : 'text-purple-900 dark:text-purple-400'}`}>
            {title}
          </h3>
          {isMenuCollapsed && (
            <div className="ml-4 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm font-bold rounded-full border-2 border-green-300 dark:border-green-700 animate-pulse">
              🚀 MODO EXPANDIDO
            </div>
          )}
        </div>

        {/* Tabla optimizada - AJUSTE AUTOMÁTICO */}
        <div
          className="w-full overflow-x-auto"
          style={{
            width: '100%',
            maxWidth: `${gridConfig.totalWidth}px`
          }}
        >
          {/* Encabezados optimizados - ADAPTATIVO al estado del menú */}
          <div className="grid gap-1 mb-3" style={{ gridTemplateColumns: gridConfig.gridTemplate }}>
            <div className={`p-3 text-center text-sm font-black text-white rounded-lg shadow-lg ${matrixType === 'propios-ecc' ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800' : 'bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800'}`}>
              📚 CURSOS
            </div>
            <div className={`p-3 text-center text-sm font-black text-white rounded-lg shadow-lg ${matrixType === 'propios-ecc' ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800' : 'bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800'}`}>
              ⏰ H
            </div>
            {days.map((date, index) => {
              const holidayName = getHolidayName(date);
              const isHolidayDay = isHoliday(date);
              const isWeekendDay = isWeekend(date);
              const dayOfWeek = format(date, 'EEE', { locale: es });

              // Determinar el estilo según el tipo de día y matriz
              let dayStyle = '';
              if (isHolidayDay) {
                // Solo feriados legales en rojo
                dayStyle = 'bg-gradient-to-b from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 text-red-800 dark:text-red-400 border-2 border-red-400 dark:border-red-700';
              } else if (isWeekendDay) {
                // Sábados y domingos en gris
                dayStyle = `bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 ${theme.textSecondary} border-2 ${theme.border}`;
              } else {
                // Días normales con colores según la matriz
                if (matrixType === 'propios-ecc') {
                  dayStyle = 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 text-blue-800 dark:text-blue-400 border-2 border-blue-400 dark:border-blue-700';
                } else {
                  dayStyle = 'bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50 text-purple-800 dark:text-purple-400 border-2 border-purple-400 dark:border-purple-700';
                }
              }

              return (
                <div
                  key={index}
                  className={`p-2 text-center text-xs font-bold rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${dayStyle}`}
                  title={holidayName || `${dayOfWeek} ${format(date, 'dd/MM/yyyy')}`}
                >
                  <div className="text-xs font-medium">{dayOfWeek.slice(0, 1)}</div>
                  <div className="text-sm font-black">{format(date, 'd')}</div>
                  {/* Eliminamos la "F" de feriados para hacer los boxes más cuadrados */}
                </div>
              );
            })}
          </div>

          {/* Filas de cursos mejoradas */}
          <div className="space-y-4">
            {matrixCourses.map((course, courseIndex) => (
              <div key={course.id} className="grid gap-1" style={{ gridTemplateColumns: gridConfig.gridTemplate }}>
                {/* Información del curso optimizada - ICONO EN ESQUINA SUPERIOR DERECHA */}
                <div className={`p-1.5 rounded-lg border-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] relative ${
                  matrixType === 'propios-ecc'
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border-blue-300 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-900/40'
                    : 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border-purple-300 dark:border-purple-700 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-900/40'
                }`}>
                  {/* ICONO DE MODALIDAD EN ESQUINA SUPERIOR DERECHA - MÁS CERCA */}
                  <div className="absolute -top-0.5 -right-0.5 z-10">
                    <span className={`px-1 py-0.5 rounded-full text-xs font-bold text-white shadow-lg border border-white ${
                      course.modalidad === 'presencial'
                        ? (matrixType === 'propios-ecc' ? 'bg-blue-600' : 'bg-purple-600')
                        : (matrixType === 'propios-ecc' ? 'bg-green-600' : 'bg-indigo-600')
                    }`}>
                      {course.modalidad === 'teams' ? 'ON' : 'PR'}
                    </span>
                  </div>

                  {/* CONTENIDO DEL CURSO - MINIMALISTA SIN VIÑETAS */}
                  <div className="flex items-start pr-4">
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-xs ${theme.text}`} title={course.nombre}>
                        {course.codigo}
                      </div>
                      <div className={`text-xs ${theme.textSecondary} font-medium leading-tight mt-1`} style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // REDUCIDO de 3 a 2 líneas para ahorrar espacio
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.1'
                      }}>
                        {course.nombre}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horas mejoradas */}
                <div className={`p-1.5 text-center rounded-lg border-2 shadow-md font-bold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  matrixType === 'propios-ecc'
                    ? 'bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-400'
                    : 'bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-400'
                }`}>
                  <div className="text-xs font-black">{course.duracion || '8'}</div>
                  <div className="text-xs font-medium">H</div>
                </div>

                {/* Días del mes con UX mejorado */}
                {days.map((date, dayIndex) => {
                  const sessionsForDate = getSessionsForDate(date);
                  const courseSessionsForDate = sessionsForDate.filter(s => s.courseId === course.id);
                  const hasSession = courseSessionsForDate.length > 0;
                  // Simular algunas sesiones para demostración (patrón más realista)
                  // Solo permitir sesiones en días que no sean feriados
                  const simulatedSession = !isHoliday(date) && (
                    (dayIndex + courseIndex) % 8 === 0 ||
                    (dayIndex + courseIndex) % 12 === 0 ||
                    (dayIndex === 5 && courseIndex < 3) ||
                    (dayIndex === 15 && courseIndex >= 3)
                  );
                  const showSession = hasSession || simulatedSession;

                  return (
                    <div
                      key={dayIndex}
                      className={`h-8 border-2 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer relative group ${
                        isHoliday(date)
                          ? 'bg-gradient-to-b from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 border-red-400 dark:border-red-700'
                          : isWeekend(date)
                            ? `bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border ${theme.border}`
                            : showSession
                              ? `${theme.bg} border ${theme.border} shadow-lg transform hover:scale-110 hover:z-10 hover:shadow-xl`
                              : matrixType === 'propios-ecc'
                                ? 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 border-blue-400 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800 dark:hover:to-blue-700 hover:shadow-md'
                                : 'bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50 border-purple-400 dark:border-purple-700 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800 dark:hover:to-purple-700 hover:shadow-md'
                      }`}
                      onClick={() => {
                        if (showSession && !isHoliday(date)) {
                          // Si hay sesión real, usar esa; si no, crear una simulada
                          const sessionToUse = courseSessionsForDate[0] || {
                            id: `sim-${course.id}-${dayIndex}`,
                            courseId: course.id,
                            fecha: format(date, 'yyyy-MM-dd'),
                            startTime: '09:00',
                            endTime: '17:00',
                            // CRÍTICO: Usar la misma lógica que courseStore para capacidad
                            capacity: course.modalidad === 'teams' ? 200 : 30,
                            seats: [] // Sesión simulada, se generarán dinámicamente
                          };

                          // DEBUG: Log para verificar capacidad
                          logger.info('MatrixCalendar', 'Sesión seleccionada', {
                            courseId: course.id,
                            courseName: course.nombre,
                            modalidad: course.modalidad,
                            capacity: sessionToUse.capacity,
                            isSimulated: !courseSessionsForDate[0]
                          });

                          onSessionSelect(sessionToUse as Session, course);
                        }
                      }}
                      title={
                        isHoliday(date)
                          ? getHolidayName(date) || 'Feriado'
                          : isWeekend(date)
                            ? 'Fin de semana'
                            : showSession
                              ? `🎯 ${course.nombre}\n📅 ${format(date, 'dd/MM/yyyy')}\n🕘 09:00 - 17:00\n📍 ${course.modalidad}\n\n👆 Click para inscribir participantes`
                              : `📅 ${format(date, 'dd/MM/yyyy')}\n💡 Disponible para programar\n${course.nombre}`
                      }
                    >
                      {showSession && !isHoliday(date) && (
                        <>
                          {/* Círculo principal con color sólido de modalidad */}
                          <div className={`w-6 h-6 rounded-full shadow-lg border-2 border-white transform transition-all duration-300 group-hover:scale-125 ${
                            course.modalidad === 'presencial'
                              ? (matrixType === 'propios-ecc' ? 'bg-blue-500' : 'bg-purple-500')
                              : (matrixType === 'propios-ecc' ? 'bg-green-500' : 'bg-indigo-500')
                          }`}>
                          </div>

                          {/* Indicador de hover */}
                          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </>
                      )}

                      {/* Eliminamos los símbolos ❌ de feriados según las especificaciones */}
                      {!showSession && !isHoliday(date) && !isWeekend(date) && (
                        <div className={`w-4 h-4 border-2 ${theme.border} rounded-full opacity-30 group-hover:opacity-60 transition-all duration-300`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Título oculto para presentación al cliente */}
      {false && (
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>
            CALENDARIO DE CAPACITACIÓN Y ENTRENAMIENTO
          </h2>
          <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
            EN SEGURIDAD Y SALUD OCUPACIONAL
          </h3>
        </div>
      )}

        {/* DEBUG: Verificación de ajuste automático - OCULTO PARA PRESENTACIÓN AL CLIENTE */}
        {false && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-xl">
            <div className="text-center">
              <div className="text-lg font-black text-green-800 dark:text-green-400 mb-2">
                🎯 CALENDARIO ADAPTATIVO - AJUSTE AUTOMÁTICO
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm font-bold text-green-700 dark:text-green-400">
                <div className="space-y-1">
                  <div>📅 Días: {gridConfig.totalDays}</div>
                  <div>📐 Día: {gridConfig.dayWidth}px</div>
                  <div>📊 Curso: {gridConfig.courseWidth}px</div>
                </div>
                <div className="space-y-1">
                  <div>⏰ Horas: {gridConfig.hoursWidth}px</div>
                  <div>📏 Contenedor: {gridConfig.containerWidth}px</div>
                  <div>📐 Total: {gridConfig.totalWidth}px</div>
                </div>
                <div className="space-y-1">
                  <div>🖥️ Viewport: {window.innerWidth}px</div>
                  <div>📱 Menú: {gridConfig.menuState}</div>
                  <div>🔍 Zoom: {Math.round(window.devicePixelRatio * 100)}%</div>
                </div>
                <div className="space-y-1">
                  <div>📏 Total: {gridConfig.totalWidth}px</div>
                  <div>🎛️ Menú: {gridConfig.menuState}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-center">
                    {gridConfig.totalDays === 31 ? '✅ 31 DÍAS' : `❌ ${gridConfig.totalDays} DÍAS`}
                  </div>
                  <div className="text-center">
                    {isMenuCollapsed ? '🚀 EXPANDIDO' : '📱 COMPACTO'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

      {/* Matrices con transición fluida */}
      <div className={`transition-all duration-300 ease-in-out ${
        isTransitioning ? 'opacity-60 scale-98 blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}>
        {/* Matriz PROPIOS Y ECC */}
        {renderMatrix(propiosYEccCourses, 'PROPIOS Y ECC', 'propios-ecc', 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/30')}

        {/* Matriz PROPIOS */}
        {renderMatrix(propiosCourses, 'PROPIOS', 'propios', 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30')}
      </div>

      {/* Leyenda ultra moderna */}
      <div className={`bg-gradient-to-br ${theme.bg} to-gray-50 dark:to-gray-800 rounded-3xl shadow-2xl p-10 border-4 ${theme.border}`}>
        <h4 className={`text-4xl font-black ${theme.text} mb-8 text-center`}>
          🎨 Guía Visual del Calendario
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* PROPIOS Y ECC */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-2xl p-8 border-4 border-blue-300 dark:border-blue-700 shadow-xl">
            <h5 className="font-black text-blue-900 dark:text-blue-400 mb-6 text-2xl text-center">
              🔵 PROPIOS Y ECC
            </h5>
            <div className="space-y-4">
              <div className={`flex items-center space-x-4 p-3 ${theme.bg} rounded-xl shadow-md`}>
                <div className="w-12 h-12 rounded-xl bg-blue-500 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <span className={`text-lg font-bold ${theme.text}`}>🏢 Presencial</span>
                  <div className={`text-sm ${theme.textSecondary}`}>Capacitación en instalaciones</div>
                </div>
              </div>
              <div className={`flex items-center space-x-4 p-3 ${theme.bg} rounded-xl shadow-md`}>
                <div className="w-12 h-12 rounded-xl bg-green-500 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <span className={`text-lg font-bold ${theme.text}`}>💻 Online</span>
                  <div className={`text-sm ${theme.textSecondary}`}>Capacitación virtual</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-xl bg-teal-500 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-800">🔄 Híbrido</span>
                  <div className="text-sm text-gray-600">Modalidad mixta</div>
                </div>
              </div>
            </div>
          </div>

          {/* PROPIOS */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-2xl p-8 border-4 border-purple-300 dark:border-purple-700 shadow-xl">
            <h5 className="font-black text-purple-900 dark:text-purple-400 mb-6 text-2xl text-center">
              🟣 PROPIOS
            </h5>
            <div className="space-y-4">
              <div className={`flex items-center space-x-4 p-3 ${theme.bg} rounded-xl shadow-md`}>
                <div className="w-12 h-12 rounded-xl bg-purple-500 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <span className={`text-lg font-bold ${theme.text}`}>🏢 Presencial</span>
                  <div className={`text-sm ${theme.textSecondary}`}>Capacitación en instalaciones</div>
                </div>
              </div>
              <div className={`flex items-center space-x-4 p-3 ${theme.bg} rounded-xl shadow-md`}>
                <div className="w-12 h-12 rounded-xl bg-indigo-500 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <span className={`text-lg font-bold ${theme.text}`}>💻 Online</span>
                  <div className={`text-sm ${theme.textSecondary}`}>Capacitación virtual</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-xl bg-violet-500 shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-800">🔄 Híbrido</span>
                  <div className="text-sm text-gray-600">Modalidad mixta</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional mejorada */}
        <div className={`mt-10 pt-8 border-t-4 ${theme.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-2 p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <div className="text-3xl">🏖️</div>
              <span className="text-lg font-bold text-red-700">Feriados</span>
              <span className="text-sm text-red-600 text-center">Días no laborables</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="text-3xl">📅</div>
              <span className="text-lg font-bold text-gray-700">Fines de semana</span>
              <span className="text-sm text-gray-600 text-center">Sábados y domingos</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="w-12 h-12 bg-white border-4 border-green-400 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-green-700">Sesión activa</span>
              <span className="text-sm text-green-600 text-center">Click para inscribir</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-3xl">👆</div>
              <span className="text-lg font-bold text-blue-700">Interactivo</span>
              <span className="text-sm text-blue-600 text-center">Hover para detalles</span>
            </div>
          </div>

          <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-300 dark:border-blue-700">
            <p className={`text-xl font-bold ${theme.text}`}>
              🎯 <strong>¡Haz clic en los círculos blancos</strong> para acceder a la inscripción de participantes
            </p>
            <p className={`text-lg ${theme.textSecondary} mt-2`}>
              Pasa el mouse sobre las celdas para ver información detallada del curso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
