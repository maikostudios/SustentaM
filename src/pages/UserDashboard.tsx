import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { generateCertificate, downloadBlob } from '../lib/pdfGenerator';
import { Button } from '../components/ui/Button';
import { UserLayout } from '../components/layout/UserLayout';
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function UserDashboard() {
  const { user } = useAuthStore();
  const { courses, participants, fetchCourses, fetchParticipants } = useCourseStore();
  const [generatingCertificate, setGeneratingCertificate] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchParticipants();
  }, [fetchCourses, fetchParticipants]);

  // Filter participants for current user (simulated by RUT match)
  const userParticipations = participants.filter(p => p.rut === user?.rut);

  const handleDownloadCertificate = async (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;

    // Find the course for this participant
    const course = courses.find(c => {
      // In a real app, we'd have proper session-course relationships
      return true; // For demo, use first course
    }) || courses[0];

    if (!course) return;

    setGeneratingCertificate(participantId);
    
    try {
      const certificateBytes = await generateCertificate(participant, course);
      const blob = new Blob([certificateBytes], { type: 'application/pdf' });
      downloadBlob(blob, `certificado-${participant.nombre.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error al generar el certificado');
    } finally {
      setGeneratingCertificate(null);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'reprobado':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'reprobado':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Mis Cursos
          </h1>
          <p className="font-sans text-gray-600 dark:text-gray-400">
            Revisa el estado de tus cursos y descarga tus certificados
          </p>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3">
            <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="font-sans text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userParticipations.filter(p => p.estado === 'inscrito').length}
              </div>
              <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Cursos en Progreso</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <div className="font-sans text-2xl font-bold text-green-600 dark:text-green-400">
                {userParticipations.filter(p => p.estado === 'aprobado').length}
              </div>
              <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Cursos Aprobados</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <div className="font-sans text-2xl font-bold text-red-600 dark:text-red-400">
                {userParticipations.filter(p => p.estado === 'reprobado').length}
              </div>
              <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Cursos Reprobados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
            Historial de Cursos
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {userParticipations.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="font-sans text-gray-500 dark:text-gray-400 text-lg">No tienes cursos registrados</p>
              <p className="font-sans text-gray-400 dark:text-gray-500 text-sm">
                Contacta a tu contratista para inscribirte en cursos disponibles
              </p>
            </div>
          ) : (
            userParticipations.map((participant) => {
              const course = courses.find(c => c.id === 'course-1') || courses[0]; // Simplified for demo
              
              return (
                <div key={participant.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(participant.estado)}
                        <h3 className="font-sans text-lg font-medium text-gray-900 dark:text-gray-100">
                          {course?.nombre || 'Curso no encontrado'}
                        </h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(participant.estado)}`}>
                          {participant.estado.charAt(0).toUpperCase() + participant.estado.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Código:</span> {course?.codigo}
                        </div>
                        <div>
                          <span className="font-medium">Modalidad:</span> {
                            course?.modalidad === 'teams' ? 'Virtual (Teams)' : 'Presencial'
                          }
                        </div>
                        <div>
                          <span className="font-medium">Asistencia:</span> {participant.asistencia}%
                        </div>
                        <div>
                          <span className="font-medium">Nota:</span> {participant.nota.toFixed(1)}
                        </div>
                      </div>

                      {course?.objetivos && (
                        <p className="font-sans mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Objetivos:</span> {course.objetivos}
                        </p>
                      )}
                    </div>

                    <div className="ml-6">
                      {participant.estado === 'aprobado' && (
                        <Button
                          onClick={() => handleDownloadCertificate(participant.id)}
                          loading={generatingCertificate === participant.id}
                          className="btn-sustenta-primary flex items-center space-x-2"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                          <span>Descargar Certificado</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      </div>
    </UserLayout>
  );
}