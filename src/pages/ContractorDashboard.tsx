import React, { useState, useEffect } from 'react';
import { useCourseStore } from '../store/courseStore';
import { Course, Session, EnrollmentData } from '../types';
import { ContractorLayout } from '../components/layout/ContractorLayout';
import { HelpModal } from '../components/help/HelpModal';
import { SeatMap } from '../components/enrollment/SeatMap';
import { ParticipantsList } from '../components/enrollment/ParticipantsList';
import { ManualEnrollmentForm } from '../components/enrollment/ManualEnrollmentForm';
import { BulkUploadDialog } from '../components/enrollment/BulkUploadDialog';
import { LazyCalendar, CalendarSkeleton, LazyReports, ReportsSkeleton } from '../components/lazy/LazyComponents';
import { CourseCalendar } from '../components/calendar/CourseCalendar';
import { useAuthStore } from '../store/authStore';
import { logger } from '../utils/logger';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { ArrowLeftIcon, ComputerDesktopIcon, BuildingOfficeIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useThemeAware } from '../hooks/useTheme';

export function ContractorDashboard() {
  const [activeSection, setActiveSection] = useState('calendar');
  const [selectedSession, setSelectedSession] = useState<{ session: Session; course: Course } | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    logger.info('ContractorDashboard', 'Componente ContractorDashboard montado', { activeSection });
  }, []);

  useEffect(() => {
    logger.debug('ContractorDashboard', 'Sección activa cambiada', { activeSection });
  }, [activeSection]);

  const { user } = useAuthStore();
  const {
    courses,
    sessions,
    participants,
    fetchCourses,
    fetchSessions,
    fetchParticipants,
    fetchParticipantsBySession,
    addParticipants
  } = useCourseStore();
  const theme = useThemeAware();

  useEffect(() => {
    fetchCourses();
    fetchSessions();
    fetchParticipants();
  }, [fetchCourses, fetchSessions, fetchParticipants]);

  const handleSelectSession = (session: Session, course: Course) => {
    logger.info('ContractorDashboard', 'Sesión seleccionada', {
      courseId: course.id,
      courseName: course.nombre,
      sessionId: session.id,
      sessionDate: session.fecha
    });
    setSelectedSession({ session, course });
    fetchParticipantsBySession(session.id);
  };

  const handleBackToCalendar = () => {
    setSelectedSession(null);
  };

  const handleManualEnrollment = async (data: EnrollmentData) => {
    if (selectedSession) {
      await addParticipants(selectedSession.session.id, [data]);
      setShowManualForm(false);
      fetchParticipantsBySession(selectedSession.session.id);
    }
  };

  const handleBulkEnrollment = async (participantsData: EnrollmentData[]) => {
    if (selectedSession) {
      await addParticipants(selectedSession.session.id, participantsData);
      setShowBulkUpload(false);
      fetchParticipantsBySession(selectedSession.session.id);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        const filteredParticipantsForDashboard = getFilteredParticipants();
        return (
          <div className="space-y-6">
            <div className={`${theme.bg} overflow-hidden shadow-lg rounded-xl border ${theme.border} transition-all duration-300 hover:shadow-xl`}>
              <div className="p-8">
                <div className="mb-8">
                  <h2 className={`text-3xl font-black ${theme.text} font-sans mb-2`}>
                    Panel de Contratista
                  </h2>
                  {user?.empresa && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <span className={`text-lg font-medium ${theme.textSecondary} font-sans`}>
                        {user.empresa}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Cursos Activos */}
                  <div className={`${theme.isDark ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20' : 'bg-gradient-to-br from-blue-50 to-blue-100'} p-6 rounded-xl border-2 ${theme.isDark ? 'border-blue-700/50' : 'border-blue-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${theme.isDark ? 'bg-blue-600' : 'bg-blue-500'} shadow-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className={`px-3 py-1 ${theme.isDark ? 'bg-blue-800/50' : 'bg-blue-200'} rounded-full`}>
                        <span className={`text-xs font-bold ${theme.isDark ? 'text-blue-300' : 'text-blue-800'}`}>ACTIVOS</span>
                      </div>
                    </div>
                    <h3 className={`text-lg font-bold ${theme.isDark ? 'text-blue-300' : 'text-blue-900'} font-sans mb-2`}>Cursos Activos</h3>
                    <p className={`text-4xl font-black ${theme.isDark ? 'text-blue-400' : 'text-blue-600'} font-sans`}>{courses.length}</p>
                    <p className={`text-sm ${theme.isDark ? 'text-blue-400/70' : 'text-blue-700'} font-medium mt-2`}>Disponibles para inscripción</p>
                  </div>

                  {/* Sesiones */}
                  <div className={`${theme.isDark ? 'bg-gradient-to-br from-green-900/30 to-green-800/20' : 'bg-gradient-to-br from-green-50 to-green-100'} p-6 rounded-xl border-2 ${theme.isDark ? 'border-green-700/50' : 'border-green-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${theme.isDark ? 'bg-green-600' : 'bg-green-500'} shadow-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className={`px-3 py-1 ${theme.isDark ? 'bg-green-800/50' : 'bg-green-200'} rounded-full`}>
                        <span className={`text-xs font-bold ${theme.isDark ? 'text-green-300' : 'text-green-800'}`}>PROGRAMADAS</span>
                      </div>
                    </div>
                    <h3 className={`text-lg font-bold ${theme.isDark ? 'text-green-300' : 'text-green-900'} font-sans mb-2`}>Sesiones</h3>
                    <p className={`text-4xl font-black ${theme.isDark ? 'text-green-400' : 'text-green-600'} font-sans`}>{sessions.length}</p>
                    <p className={`text-sm ${theme.isDark ? 'text-green-400/70' : 'text-green-700'} font-medium mt-2`}>Fechas programadas</p>
                  </div>

                  {/* Mis Participantes */}
                  <div className={`${theme.isDark ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20' : 'bg-gradient-to-br from-purple-50 to-purple-100'} p-6 rounded-xl border-2 ${theme.isDark ? 'border-purple-700/50' : 'border-purple-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${theme.isDark ? 'bg-purple-600' : 'bg-purple-500'} shadow-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className={`px-3 py-1 ${theme.isDark ? 'bg-purple-800/50' : 'bg-purple-200'} rounded-full`}>
                        <span className={`text-xs font-bold ${theme.isDark ? 'text-purple-300' : 'text-purple-800'}`}>MI EMPRESA</span>
                      </div>
                    </div>
                    <h3 className={`text-lg font-bold ${theme.isDark ? 'text-purple-300' : 'text-purple-900'} font-sans mb-2`}>Mis Participantes</h3>
                    <p className={`text-4xl font-black ${theme.isDark ? 'text-purple-400' : 'text-purple-600'} font-sans`}>{filteredParticipantsForDashboard.length}</p>
                    <p className={`text-sm ${theme.isDark ? 'text-purple-400/70' : 'text-purple-700'} font-medium mt-2`}>de {user?.empresa}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return renderCalendarView();

      case 'enrollment':
        return renderEnrollmentView();

      case 'reports':
        const filteredParticipants = getFilteredParticipants();
        return <LazyReports participants={filteredParticipants} courses={courses} hidePerformanceMetrics={true} />;

      default:
        return renderCalendarView();
    }
  };

  const getSessionParticipants = () => {
    if (!selectedSession) return [];
    return participants.filter(p => p.sessionId === selectedSession.session.id);
  };

  const getExistingRuts = () => {
    return getSessionParticipants().map(p => p.rut);
  };

  // Filtrar participantes por empresa del contratista logueado
  const getFilteredParticipants = () => {
    if (!user || user.rol !== 'contratista' || !user.empresa) {
      return participants; // Si no es contratista o no tiene empresa, devolver todos
    }
    return participants.filter(p => p.contractor === user.empresa);
  };

  const renderCalendarView = () => {
    logger.debug('ContractorDashboard', 'Renderizando vista de calendario', { hasSelectedSession: !!selectedSession });

    if (selectedSession) {
      return renderEnrollmentView();
    }

    return (
      <div className="space-y-6">
        <CourseCalendar
          onSelectSession={handleSelectSession}
          courses={courses}
          sessions={sessions}
        />
      </div>
    );
  };

  const renderEnrollmentView = () => {
    if (!selectedSession) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Inscripciones</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Selecciona un curso del calendario para gestionar inscripciones.</p>
          </div>
        </div>
      );
    }

    const sessionParticipants = participants.filter(p =>
      p.sessionId === selectedSession.session.id
    );

    return (
      <div className="space-y-6">
        {/* Header del Curso Mejorado */}
        <div className={`${theme.bg} rounded-lg shadow-sm border ${theme.border} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSession(null)}
              className={`flex items-center space-x-2 ${theme.textSecondary} hover:${theme.text}`}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Volver al Calendario</span>
            </Button>
          </div>

          {/* Información del Curso */}
          <div className="space-y-4">
            <div>
              <h2 className={`text-2xl font-bold ${theme.text} font-sans`}>
                {selectedSession.course.nombre}
              </h2>
              <p className={`${theme.textSecondary} font-sans text-sm mt-1`}>
                Código: {selectedSession.course.codigo}
              </p>
            </div>

            {/* Detalles del Curso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Modalidad */}
              <div className="flex items-center space-x-3">
                {selectedSession.course.modalidad === 'presencial' ? (
                  <BuildingOfficeIcon className={`w-5 h-5 ${theme.textSecondary}`} />
                ) : (
                  <ComputerDesktopIcon className={`w-5 h-5 ${theme.textSecondary}`} />
                )}
                <div>
                  <p className={`text-xs ${theme.textMuted} font-sans uppercase tracking-wide`}>
                    Modalidad
                  </p>
                  <p className={`text-sm font-medium ${theme.text} font-sans`}>
                    {selectedSession.course.modalidad === 'presencial' ? 'Presencial' : 'Online'}
                  </p>
                </div>
              </div>

              {/* Duración */}
              <div className="flex items-center space-x-3">
                <ClockIcon className={`w-5 h-5 ${theme.textSecondary}`} />
                <div>
                  <p className={`text-xs ${theme.textMuted} font-sans uppercase tracking-wide`}>
                    Duración
                  </p>
                  <p className={`text-sm font-medium ${theme.text} font-sans`}>
                    {selectedSession.course.duracionHoras} horas
                  </p>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center space-x-3">
                <CalendarDaysIcon className={`w-5 h-5 ${theme.textSecondary}`} />
                <div>
                  <p className={`text-xs ${theme.textMuted} font-sans uppercase tracking-wide`}>
                    Fecha
                  </p>
                  <p className={`text-sm font-medium ${theme.text} font-sans`}>
                    {new Date(selectedSession.session.fecha).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Participantes - Lado Izquierdo */}
          <div>
            <ParticipantsList
              participants={sessionParticipants}
              capacity={selectedSession.session.capacity}
              onManualEnrollment={() => setShowManualForm(true)}
              onBulkUpload={() => setShowBulkUpload(true)}
            />
          </div>

          {/* Mapa de Butacas - Lado Derecho */}
          <div>
            <SeatMap
              session={selectedSession.session}
              participants={sessionParticipants}
              showActions={false}
            />
          </div>
        </div>
      </div>
    );
  };

  const getBreadcrumbs = () => {
    switch (activeSection) {
      case 'dashboard':
        return [{ label: 'Dashboard', current: true }];
      case 'calendar':
        return selectedSession
          ? [
              { label: 'Dashboard', href: '#' },
              { label: 'Calendario', href: '#' },
              { label: selectedSession.course.nombre, current: true }
            ]
          : [
              { label: 'Dashboard', href: '#' },
              { label: 'Calendario', current: true }
            ];
      case 'enrollment':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Inscripciones', current: true }
        ];
      case 'reports':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Reportes', current: true }
        ];
      default:
        return [];
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Panel de Contratista';
      case 'calendar':
        return selectedSession ? `Inscripciones - ${selectedSession.course.nombre}` : 'Calendario de Cursos';
      case 'enrollment':
        return 'Gestión de Inscripciones';
      case 'reports':
        return 'Mis Reportes';
      default:
        return 'Panel de Contratista';
    }
  };

  return (
    <ContractorLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      breadcrumbs={getBreadcrumbs()}
      title={getSectionTitle()}
      onHelpClick={() => setShowHelp(true)}
    >
      {renderContent()}
      {/* Manual Enrollment Modal */}
      <Modal
        isOpen={showManualForm}
        onClose={() => setShowManualForm(false)}
        title="Inscripción Manual"
      >
        <ManualEnrollmentForm
          onSubmit={handleManualEnrollment}
          onCancel={() => setShowManualForm(false)}
          existingRuts={getExistingRuts()}
          contractorCompany={user?.empresa}
        />
      </Modal>

      {/* Bulk Upload Modal */}
      <BulkUploadDialog
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkEnrollment}
        capacity={selectedSession?.session.capacity || 30}
        currentOccupancy={participants.filter(p => p.sessionId === selectedSession?.course.id).length}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        userRole="contratista"
      />
    </ContractorLayout>
  );
}