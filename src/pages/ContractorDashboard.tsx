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
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Panel de Contratista
                  {user?.empresa && (
                    <span className="block text-lg font-normal text-gray-600 mt-1">
                      {user.empresa}
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900">Cursos Activos</h3>
                    <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900">Sesiones</h3>
                    <p className="text-3xl font-bold text-green-600">{sessions.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900">Mis Participantes</h3>
                    <p className="text-3xl font-bold text-purple-600">{filteredParticipantsForDashboard.length}</p>
                    <p className="text-sm text-purple-600 mt-1">de {user?.empresa}</p>
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
        <CourseCalendar onSelectSession={handleSelectSession} />
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSession(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Volver al Calendario</span>
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedSession.course.nombre}</h2>
              <p className="text-gray-600">Código: {selectedSession.course.codigo}</p>
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