import React, { useState } from 'react';
import { mockCourses, mockParticipants } from '../../lib/mockData';
import { Button } from '../ui/Button';
import { 
  DocumentCheckIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function SimpleCertificateGenerator() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Datos hardcodeados para certificados
  const certificateData = {
    totalCertificados: 156,
    pendientes: 23,
    generadosHoy: 12,
    
    // Participantes aprobados por curso
    participantesAprobados: [
      {
        courseId: 'course-1',
        courseName: 'Excel Avanzado para Profesionales',
        participants: [
          { id: '1', nombre: 'Juan Carlos Pérez González', rut: '12.345.678-5', nota: 6.8 },
          { id: '2', nombre: 'María Elena González Silva', rut: '98.765.432-1', nota: 6.2 },
          { id: '3', nombre: 'Carlos Alberto Rodríguez López', rut: '15.678.234-9', nota: 6.5 },
          { id: '4', nombre: 'Ana Patricia Morales Díaz', rut: '19.876.543-2', nota: 5.8 }
        ]
      },
      {
        courseId: 'course-2',
        courseName: 'Power BI para Análisis de Datos',
        participants: [
          { id: '5', nombre: 'Laura Patricia Fernández Morales', rut: '14.567.890-1', nota: 6.9 },
          { id: '6', nombre: 'Diego Alejandro Vargas Soto', rut: '16.789.012-3', nota: 6.1 },
          { id: '7', nombre: 'Claudia Beatriz Jiménez Rojas', rut: '17.890.123-4', nota: 6.4 }
        ]
      },
      {
        courseId: 'course-3',
        courseName: 'Gestión Ágil de Proyectos',
        participants: [
          { id: '8', nombre: 'Andrés Felipe Muñoz Contreras', rut: '18.901.234-5', nota: 7.0 },
          { id: '9', nombre: 'Valentina Isabel Torres Mendoza', rut: '20.012.345-6', nota: 5.5 }
        ]
      }
    ]
  };

  const generateCertificates = async () => {
    if (!selectedCourse) {
      alert('Por favor selecciona un curso');
      return;
    }

    setGenerating(true);
    setProgress(0);

    // Simular progreso de generación
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          alert('¡Certificados generados exitosamente!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadCertificate = (participantId: string, participantName: string) => {
    // Simulación de descarga
    alert(`Descargando certificado para ${participantName}...`);
  };

  const selectedCourseData = certificateData.participantesAprobados.find(
    course => course.courseId === selectedCourse
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DocumentCheckIcon className="w-8 h-8 mr-3" />
            Generador de Certificados
          </h2>
          <p className="text-gray-600 mt-1">Genera y descarga certificados para participantes aprobados</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentCheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Certificados</p>
              <p className="text-2xl font-bold text-gray-900">{certificateData.totalCertificados}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{certificateData.pendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Generados Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{certificateData.generadosHoy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de curso */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Curso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificateData.participantesAprobados.map((course) => (
            <div
              key={course.courseId}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCourse === course.courseId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCourse(course.courseId)}
            >
              <div className="flex items-start">
                <AcademicCapIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.participants.length} participantes aprobados
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de participantes */}
      {selectedCourseData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Participantes Aprobados - {selectedCourseData.courseName}
            </h3>
            <Button
              onClick={generateCertificates}
              disabled={generating}
              className="flex items-center"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              {generating ? 'Generando...' : 'Generar Todos'}
            </Button>
          </div>

          {/* Barra de progreso */}
          {generating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Generando certificados...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Tabla de participantes */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RUT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nota Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedCourseData.participants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.rut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        participant.nota >= 6.0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {participant.nota}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Aprobado
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => downloadCertificate(participant.id, participant.nombre)}
                        variant="secondary"
                        size="sm"
                        disabled={generating}
                      >
                        <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                        Descargar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Información sobre Certificados</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Los certificados se generan automáticamente para participantes con nota ≥ 4.0 y asistencia ≥ 75%</p>
          <p>• Formato: PDF con firma digital y código QR de verificación</p>
          <p>• Los certificados incluyen: nombre del participante, curso, fecha, nota final y duración</p>
          <p>• Se envía copia automática al email del participante y contratista</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleCertificateGenerator;
