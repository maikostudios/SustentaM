import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { OticLayout } from '../components/layout/OticLayout';
import { HelpModal } from '../components/help/HelpModal';
import { SimpleReportsDashboard } from '../components/reports/SimpleReportsDashboard';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../contexts/ToastContext';
import { useThemeAware } from '../hooks/useTheme';
import {
  DocumentArrowDownIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function OticDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showHelp, setShowHelp] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { courses, participants, sessions, fetchCourses, fetchParticipants, fetchSessions } = useCourseStore();
  const notifications = useNotifications();
  const theme = useThemeAware();

  useEffect(() => {
    fetchCourses();
    fetchParticipants();
    fetchSessions();
  }, [fetchCourses, fetchParticipants, fetchSessions]);

  // Función para descargar certificados
  const handleDownloadCertificate = async (certificateType: string, fileName: string) => {
    setDownloadingCertificate(certificateType);
    
    try {
      const response = await fetch(`/certificates/${fileName}`);
      if (!response.ok) {
        throw new Error('No se pudo cargar el certificado');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notifications.success(
        'Certificado descargado',
        `El certificado ${certificateType} se ha descargado exitosamente.`
      );
    } catch (error) {
      console.error('Error downloading certificate:', error);
      notifications.error(
        'Error al descargar',
        'No se pudo descargar el certificado. Inténtalo nuevamente.'
      );
    } finally {
      setDownloadingCertificate(null);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="section-title mb-2">
                DASHBOARD OTIC
              </h1>
              <p className="font-sans text-gray-600 dark:text-gray-400">
                PORTAL DE GESTIÓN Y DESCARGA DE CERTIFICADOS PARA OTIC
              </p>
            </div>

            {/* KPIs Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-sans text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {courses.length}
                    </div>
                    <div className="font-sans text-sm text-gray-600 dark:text-gray-400">CURSOS TOTALES</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-3">
                  <UsersIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-sans text-2xl font-bold text-green-600 dark:text-green-400">
                      {participants.length}
                    </div>
                    <div className="font-sans text-sm text-gray-600 dark:text-gray-400">PARTICIPANTES</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-sans text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {participants.filter(p => p.estado === 'aprobado').length}
                    </div>
                    <div className="font-sans text-sm text-gray-600 dark:text-gray-400">APROBADOS</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <div>
                    <div className="font-sans text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {sessions.length}
                    </div>
                    <div className="font-sans text-sm text-gray-600 dark:text-gray-400">SESIONES</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información OTIC */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-4">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Portal OTIC - Organismo Técnico Intermedio de Capacitación
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <p>• Acceso completo a todos los certificados del sistema</p>
                    <p>• Descarga de certificados de inducción, libro de clases y participantes</p>
                    <p>• Visualización de reportes y estadísticas generales</p>
                    <p>• Gestión centralizada de la información de capacitación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="section-title mb-2">
                CERTIFICADOS OTIC
              </h1>
              <p className="font-sans text-gray-600 dark:text-gray-400">
                DESCARGA TODOS LOS CERTIFICADOS DISPONIBLES EN EL SISTEMA
              </p>
            </div>

            {/* Certificados disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Certificado de Inducción */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                <div className="text-center flex flex-col flex-grow">
                  <DocumentArrowDownIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    CERTIFICADO DE INDUCCIÓN
                  </h3>
                  <p className="font-sans text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                    Certificado oficial de inducción en seguridad y salud ocupacional
                  </p>
                  <Button
                    onClick={() => handleDownloadCertificate('Inducción', 'CERTIFICADO DE INDUCCION.pdf')}
                    loading={downloadingCertificate === 'Inducción'}
                    className="w-full btn-sustenta-primary mt-auto"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                    DESCARGAR
                  </Button>
                </div>
              </div>

              {/* Certificado Libro de Clases */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                <div className="text-center flex flex-col flex-grow">
                  <DocumentArrowDownIcon className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    LIBRO DE CLASES
                  </h3>
                  <p className="font-sans text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                    Registro oficial de asistencia y calificaciones
                  </p>
                  <Button
                    onClick={() => handleDownloadCertificate('Libro de Clases', 'CERTIFICADO-LIBRO-CLASES-ASISTENCIA.pdf')}
                    loading={downloadingCertificate === 'Libro de Clases'}
                    className="w-full btn-sustenta-secondary mt-auto"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                    DESCARGAR
                  </Button>
                </div>
              </div>

              {/* Certificado Participante */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                <div className="text-center flex flex-col flex-grow">
                  <DocumentArrowDownIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    CERTIFICADO PARTICIPANTE
                  </h3>
                  <p className="font-sans text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                    Certificado individual de participación y aprobación
                  </p>
                  <Button
                    onClick={() => handleDownloadCertificate('Participante', 'certificado_participante.pdf')}
                    loading={downloadingCertificate === 'Participante'}
                    className="w-full btn-sustenta-accent mt-auto"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                    DESCARGAR
                  </Button>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Información sobre Certificados
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Todos los certificados están en formato PDF y son oficiales</p>
                <p>• Los certificados incluyen firmas digitales y códigos de verificación</p>
                <p>• Como OTIC tienes acceso completo a todos los tipos de certificados</p>
                <p>• Los archivos se descargan directamente desde el servidor</p>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="section-title mb-2">
                REPORTES OTIC
              </h1>
              <p className="font-sans text-gray-600 dark:text-gray-400">
                ANÁLISIS Y ESTADÍSTICAS GENERALES DEL SISTEMA
              </p>
            </div>

            {/* Usar el componente de reportes del contratista */}
            <SimpleReportsDashboard hidePerformanceMetrics={false} />
          </div>
        );

      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <OticLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onHelpClick={() => setShowHelp(true)}
    >
      {renderContent()}

      {/* Help Modal */}
      {showHelp && (
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          userRole="otic"
        />
      )}
    </OticLayout>
  );
}
