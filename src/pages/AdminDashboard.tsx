import React, { useState, useEffect } from 'react';
import { useCourseStore } from '../store/courseStore';
import { Course } from '../types';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CourseTable } from '../components/courses/CourseTable';
import { CourseForm } from '../components/courses/CourseForm';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { generateBulkCertificates, downloadBlob } from '../lib/pdfGenerator';
import { DeleteConfirmationModal } from '../components/ui/ConfirmationModal';
import { HelpModal } from '../components/help/HelpModal';
import { useNotifications, NotificationTemplates } from '../contexts/ToastContext';
import {
  LazyReports,
  LazyAttendanceImport,
  LazyCertificateGenerator,
  LazyCertificatePreviewComponent,
  LazyNotificationDemoComponent,
  DashboardSkeleton
} from '../components/lazy/LazyComponents';
import { PerformanceDemo } from '../components/demo/PerformanceDemo';
import { ValidationDemo } from '../components/demo/ValidationDemo';
import { SearchDemo } from '../components/demo/SearchDemo';
import { AccessibilityDemo } from '../components/demo/AccessibilityDemo';
import { ThemeDemo } from '../components/demo/ThemeDemo';
import { ErrorHandlingDemo } from '../components/demo/ErrorHandlingDemo';
import { ContractorManagement } from '../components/contractors/ContractorManagement';
import { SeatIconDemo } from '../components/demo/SeatIconDemo';

export function AdminDashboard() {
  // Component state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAttendanceImport, setShowAttendanceImport] = useState(false);
  const [showGradesImport, setShowGradesImport] = useState(false);
  const [showBulkCertificates, setShowBulkCertificates] = useState<Course | null>(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const notifications = useNotifications();

  const {
    courses,
    participants,
    loading,
    fetchCourses,
    fetchParticipants,
    addCourse,
    updateCourse,
    deleteCourse,
    updateAttendance
  } = useCourseStore();

  useEffect(() => {
    fetchCourses();
    fetchParticipants();
  }, [fetchCourses, fetchParticipants]);

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    setShowDeleteConfirm(courseId);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;

    const course = courses.find(c => c.id === showDeleteConfirm);
    const courseName = course?.nombre || 'curso';

    setDeleteLoading(true);
    try {
      await deleteCourse(showDeleteConfirm);
      fetchCourses();
      setShowDeleteConfirm(null);

      // Notificación de éxito
      notifications.success(
        'Curso eliminado',
        `El curso "${courseName}" se ha eliminado correctamente.`
      );
    } catch (error) {
      console.error('Error deleting course:', error);

      // Notificación de error
      notifications.error(
        'Error al eliminar curso',
        `No se pudo eliminar el curso "${courseName}". Inténtalo nuevamente.`
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCourseSubmit = async (data: any) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, data);
        notifications.success(
          'Curso actualizado',
          `El curso "${data.nombre}" se ha actualizado correctamente.`
        );
      } else {
        await addCourse(data);
        notifications.success(
          'Curso creado',
          `El curso "${data.nombre}" se ha creado correctamente.`
        );
      }
      setShowCourseForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      notifications.error(
        editingCourse ? 'Error al actualizar curso' : 'Error al crear curso',
        'Ha ocurrido un error inesperado. Inténtalo nuevamente.'
      );
    }
  };

  const handleGenerateCertificates = async (courseId?: string) => {
    const course = courseId ? courses.find(c => c.id === courseId) : courses[0];
    if (course) {
      const approvedParticipants = participants.filter(p =>
        p.sessionId === course.id && p.estado === 'aprobado'
      );

      if (approvedParticipants.length === 0) {
        notifications.warning(
          'Sin participantes aprobados',
          `No hay participantes aprobados en el curso "${course.nombre}" para generar certificados.`
        );
        return;
      }

      notifications.info(
        'Preparando generación',
        `Preparando la generación de ${approvedParticipants.length} certificados...`,
        { duration: 2000 }
      );

      setShowBulkCertificates(course);
    } else {
      notifications.error(
        'Curso no encontrado',
        'No se pudo encontrar el curso seleccionado.'
      );
    }
  };

  const handleImportAttendance = (attendanceData: any[]) => {
    try {
      let successCount = 0;
      let errorCount = 0;

      // Simulate importing attendance data
      attendanceData.forEach(data => {
        const participant = participants.find(p => p.rut === data.rut);
        if (participant) {
          updateAttendance(participant.id, data.asistencia, participant.nota);
          successCount++;
        } else {
          errorCount++;
        }
      });

      setShowAttendanceImport(false);

      // Notificaciones basadas en el resultado
      if (successCount > 0 && errorCount === 0) {
        notifications.success(
          'Asistencia importada',
          `Se importaron ${successCount} registros de asistencia correctamente.`
        );
      } else if (successCount > 0 && errorCount > 0) {
        notifications.warning(
          'Importación parcial',
          `Se importaron ${successCount} registros. ${errorCount} registros no pudieron procesarse.`
        );
      } else {
        notifications.error(
          'Error en importación',
          'No se pudo importar ningún registro de asistencia.'
        );
      }
    } catch (error) {
      console.error('Error importing attendance:', error);
      notifications.error(
        'Error en importación',
        'Ha ocurrido un error al importar la asistencia.'
      );
    }
  };

  const handleImportGrades = (gradesData: any[]) => {
    try {
      let successCount = 0;
      let errorCount = 0;

      // Simulate importing grades data
      gradesData.forEach(data => {
        const participant = participants.find(p => p.rut === data.rut);
        if (participant) {
          updateAttendance(participant.id, participant.asistencia, data.nota);
          successCount++;
        } else {
          errorCount++;
        }
      });

      setShowGradesImport(false);

      // Notificaciones basadas en el resultado
      if (successCount > 0 && errorCount === 0) {
        notifications.success(
          'Notas importadas',
          `Se importaron ${successCount} registros de notas correctamente.`
        );
      } else if (successCount > 0 && errorCount > 0) {
        notifications.warning(
          'Importación parcial',
          `Se importaron ${successCount} registros. ${errorCount} registros no pudieron procesarse.`
        );
      } else {
        notifications.error(
          'Error en importación',
          'No se pudo importar ningún registro de notas.'
        );
      }
    } catch (error) {
      console.error('Error importing grades:', error);
      notifications.error(
        'Error en importación',
        'Ha ocurrido un error al importar las notas.'
      );
    }
  };

  const handleExportReport = () => {
    try {
      // Simulate PDF export
      notifications.info(
        'Generando reporte',
        'El reporte se está generando. Te notificaremos cuando esté listo.',
        { duration: 3000 }
      );

      // Simular proceso de generación
      setTimeout(() => {
        notifications.success(
          'Reporte generado',
          'El reporte se ha generado correctamente y se ha descargado.',
          {
            action: {
              label: 'Ver carpeta',
              onClick: () => notifications.info('Abriendo carpeta de descargas...')
            }
          }
        );
      }, 2000);
    } catch (error) {
      notifications.error(
        'Error al generar reporte',
        'No se pudo generar el reporte. Inténtalo nuevamente.'
      );
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Header con tipografía consistente */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
              <div className="p-8">
                <h1 className="font-sans text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Bienvenido al Panel de Administración
                </h1>
                <p className="font-sans text-base text-gray-600 dark:text-gray-400">
                  Gestiona cursos, participantes y certificados desde este panel centralizado
                </p>
              </div>
            </div>

            {/* Métricas principales con nueva paleta de colores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Cursos - Color primario */}
              <div className="bg-background-secondary border border-border-light rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Total Cursos
                    </h3>
                    <p className="font-sans text-3xl font-bold text-primary-500 mt-2">
                      {courses.length}
                    </p>
                  </div>
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-primary-500 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Participantes - Color secundario (verde) */}
              <div className="bg-background-secondary border border-border-light rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Participantes
                    </h3>
                    <p className="font-sans text-3xl font-bold text-secondary-500 mt-2">
                      {participants.length}
                    </p>
                  </div>
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-secondary-500 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Aprobados - Color secundario (verde) */}
              <div className="bg-background-secondary border border-border-light rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Aprobados
                    </h3>
                    <p className="font-sans text-3xl font-bold text-secondary-500 mt-2">
                      {participants.filter(p => p.estado === 'aprobado').length}
                    </p>
                    <p className="font-sans text-sm text-text-muted mt-1">
                      {participants.length > 0
                        ? `${Math.round((participants.filter(p => p.estado === 'aprobado').length / participants.length) * 100)}% del total`
                        : 'Sin datos'
                      }
                    </p>
                  </div>
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-secondary-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Cursos</h2>
              <Button onClick={handleCreateCourse} className="flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                <span>Nuevo Curso</span>
              </Button>
            </div>

            <CourseTable
              courses={courses}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          </div>
        );
        
      case 'attendance':
        return (
          <AttendanceTable
            participants={participants}
            onUpdateAttendance={updateAttendance}
            onImportAttendance={() => setShowAttendanceImport(true)}
            onImportGrades={() => setShowGradesImport(true)}
            onExportReport={handleExportReport}
          />
        );
        
      case 'certificates':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Certificados</h2>
              <div className="space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Ayuda
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCertificatePreview(true)}
                >
                  Vista Previa
                </Button>
                <Button
                  onClick={handleGenerateCertificates}
                  disabled={participants.filter(p => p.estado === 'aprobado').length === 0}
                >
                  Generar Certificados
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <p className="font-sans text-gray-600 dark:text-gray-400 mb-4">
                Genere certificados para participantes aprobados de cualquier curso.
              </p>

              {participants.filter(p => p.estado === 'aprobado').length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-sans text-gray-500 dark:text-gray-400">No hay participantes aprobados para generar certificados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {participants.filter(p => p.estado === 'aprobado').length}
                    </div>
                    <div className="text-sm text-gray-600">Certificados Disponibles</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'contractors':
        return <ContractorManagement />;

      case 'reports':
        return (
          <LazyReports participants={participants} courses={courses} />
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sistema de Notificaciones</h2>
                <LazyNotificationDemoComponent />
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Optimizaciones de Rendimiento</h2>
                <PerformanceDemo />
              </div>
            </div>
          </div>
        );

      case 'validation':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Validación de Formularios</h2>
                <ValidationDemo />
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Búsqueda y Filtros Avanzados</h2>
                <SearchDemo />
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Accesibilidad (a11y)</h2>
                <AccessibilityDemo />
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sistema de Temas</h2>
                <ThemeDemo />
              </div>
            </div>
          </div>
        );

      case 'errors':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Manejo de Errores</h2>
                <ErrorHandlingDemo />
              </div>
            </div>
          </div>
        );

      case 'seat-icons':
        return (
          <div className="space-y-6">
            <SeatIconDemo />
          </div>
        );

      default:
        return null;
    }
  };

  const getBreadcrumbs = () => {
    switch (activeSection) {
      case 'dashboard':
        return [{ label: 'Dashboard', current: true }];
      case 'courses':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Gestión de Cursos', current: true }
        ];
      case 'attendance':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Asistencia y Notas', current: true }
        ];
      case 'certificates':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Certificados', current: true }
        ];
      case 'contractors':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Gestión de Contratistas', current: true }
        ];
      case 'reports':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Reportes', current: true }
        ];
      case 'notifications':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Notificaciones', current: true }
        ];
      case 'performance':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Rendimiento', current: true }
        ];
      case 'validation':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Validación', current: true }
        ];
      case 'search':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Búsqueda', current: true }
        ];
      case 'accessibility':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Accesibilidad', current: true }
        ];
      case 'theme':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Temas', current: true }
        ];
      case 'errors':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Errores', current: true }
        ];
      case 'seat-icons':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Iconos de Butacas', current: true }
        ];
      default:
        return [];
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Panel de Administración';
      case 'courses':
        return 'Gestión de Cursos';
      case 'attendance':
        return 'Asistencia y Notas';
      case 'certificates':
        return 'Gestión de Certificados';
      case 'contractors':
        return 'Gestión de Contratistas';
      case 'reports':
        return 'Reportes y Análisis';
      case 'notifications':
        return 'Sistema de Notificaciones';
      case 'performance':
        return 'Optimizaciones de Rendimiento';
      case 'validation':
        return 'Validación de Formularios';
      case 'search':
        return 'Búsqueda y Filtros Avanzados';
      case 'accessibility':
        return 'Accesibilidad (a11y)';
      case 'theme':
        return 'Sistema de Temas';
      case 'errors':
        return 'Manejo de Errores';
      case 'seat-icons':
        return 'Iconos de Butacas SVG';
      default:
        return 'Panel de Administración';
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      breadcrumbs={getBreadcrumbs()}
      title={getSectionTitle()}
      onHelpClick={() => setShowHelp(true)}
    >
      {renderContent()}
      
      {/* Course Form Modal */}
      <Modal
        isOpen={showCourseForm}
        onClose={() => {
          setShowCourseForm(false);
          setEditingCourse(null);
        }}
        title={editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
        size="lg"
      >
        <CourseForm
          course={editingCourse || undefined}
          onSubmit={handleCourseSubmit}
          onCancel={() => {
            setShowCourseForm(false);
            setEditingCourse(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Está seguro de que desea eliminar este curso? Esta acción no se puede deshacer.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Eliminar Curso
            </Button>
          </div>
        </div>
      </Modal>

      {/* Attendance Import Modal */}
      {showAttendanceImport && (
        <LazyAttendanceImport
          isOpen={showAttendanceImport}
          onClose={() => setShowAttendanceImport(false)}
          onImport={handleImportAttendance}
          existingParticipants={participants.map(p => ({ rut: p.rut, nombre: p.nombre }))}
        />
      )}

      {/* Grades Import Modal */}
      {showGradesImport && (
        <LazyAttendanceImport
          isOpen={showGradesImport}
          onClose={() => setShowGradesImport(false)}
          onImport={handleImportGrades}
          existingParticipants={participants.map(p => ({ rut: p.rut, nombre: p.nombre }))}
        />
      )}

      {/* Bulk Certificate Generator */}
      {showBulkCertificates && (
        <LazyCertificateGenerator
          isOpen={true}
          onClose={() => setShowBulkCertificates(null)}
          participants={participants.filter(p =>
            // In a real app, this would be filtered by session
            p.sessionId === showBulkCertificates.id
          )}
          course={showBulkCertificates}
        />
      )}

      {/* Certificate Preview */}
      {showCertificatePreview && (
        <LazyCertificatePreviewComponent
          isOpen={showCertificatePreview}
          onClose={() => setShowCertificatePreview(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={confirmDelete}
          itemName={courses.find(c => c.id === showDeleteConfirm)?.nombre || 'Curso'}
          itemType="curso"
          loading={deleteLoading}
        />
      )}

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        userRole="administrador"
      />
    </AdminLayout>
  );
}