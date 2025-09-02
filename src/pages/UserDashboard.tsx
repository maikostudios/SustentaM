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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reprobado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mis Cursos
          </h1>
          <p className="text-gray-600">
            Revisa el estado de tus cursos y descarga tus certificados
          </p>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-sustenta p-6 bg-sustenta-light-blue/20 border-sustenta-blue/30">
          <div className="flex items-center space-x-3">
            <ClockIcon className="w-8 h-8 text-sustenta-blue" />
            <div>
              <div className="text-2xl font-bold text-sustenta-blue">
                {userParticipations.filter(p => p.estado === 'inscrito').length}
              </div>
              <div className="text-sm text-gray-600">Cursos en Progreso</div>
            </div>
          </div>
        </div>

        <div className="card-sustenta p-6 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {userParticipations.filter(p => p.estado === 'aprobado').length}
              </div>
              <div className="text-sm text-gray-600">Cursos Aprobados</div>
            </div>
          </div>
        </div>

        <div className="card-sustenta p-6 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {userParticipations.filter(p => p.estado === 'reprobado').length}
              </div>
              <div className="text-sm text-gray-600">Cursos Reprobados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="card-sustenta">
        <div className="header-sustenta">
          <h2 className="text-lg font-semibold">
            Historial de Cursos
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {userParticipations.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tienes cursos registrados</p>
              <p className="text-gray-400 text-sm">
                Contacta a tu contratista para inscribirte en cursos disponibles
              </p>
            </div>
          ) : (
            userParticipations.map((participant) => {
              const course = courses.find(c => c.id === 'course-1') || courses[0]; // Simplified for demo
              
              return (
                <div key={participant.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(participant.estado)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {course?.nombre || 'Curso no encontrado'}
                        </h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(participant.estado)}`}>
                          {participant.estado.charAt(0).toUpperCase() + participant.estado.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                        <p className="mt-2 text-sm text-gray-600">
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