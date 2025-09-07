import React, { useState } from 'react';
import { mockCourses, mockParticipants } from '../../lib/mockData';
import { Button } from '../ui/Button';
import { SimpleGradeChart } from '../charts/SimpleGradeChart';
import { SimpleAttendanceChart } from '../charts/SimpleAttendanceChart';
import { TopStudentsRanking } from '../charts/TopStudentsRanking';
import { PerformanceMetrics } from '../charts/PerformanceMetrics';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  AcademicCapIcon,
  UsersIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function SimpleReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Datos hardcodeados para la maqueta
  const reportData = {
    totalCursos: mockCourses.length,
    totalParticipantes: mockParticipants.length,
    tasaAprobacion: 85.7,
    promedioAsistencia: 88.3,
    cursosActivos: 5,
    participantesActivos: 156,
    
    // Datos por curso
    cursoStats: [
      {
        curso: 'Excel Avanzado',
        participantes: 25,
        aprobados: 22,
        promedio: 6.2,
        asistencia: 92
      },
      {
        curso: 'Power BI',
        participantes: 45,
        aprobados: 41,
        promedio: 6.5,
        asistencia: 89
      },
      {
        curso: 'Gestión Ágil',
        participantes: 18,
        aprobados: 16,
        promedio: 6.8,
        asistencia: 95
      },
      {
        curso: 'Seguridad Informática',
        participantes: 68,
        aprobados: 55,
        promedio: 5.9,
        asistencia: 82
      }
    ],

    // Datos por contratista
    contratistaStats: [
      {
        nombre: 'Empresa ABC Ltda.',
        participantes: 45,
        aprobados: 39,
        tasa: 86.7
      },
      {
        nombre: 'Constructora XYZ S.A.',
        participantes: 38,
        aprobados: 33,
        tasa: 86.8
      },
      {
        nombre: 'Tech Solutions SpA',
        participantes: 32,
        aprobados: 28,
        tasa: 87.5
      },
      {
        nombre: 'Servicios Integrales DEF',
        participantes: 25,
        aprobados: 20,
        tasa: 80.0
      }
    ],

    // Tendencias mensuales
    tendencias: [
      { mes: 'Enero', participantes: 120, aprobados: 102 },
      { mes: 'Febrero', participantes: 135, aprobados: 118 },
      { mes: 'Marzo', participantes: 98, aprobados: 85 },
      { mes: 'Abril', participantes: 156, aprobados: 134 },
      { mes: 'Mayo', participantes: 142, aprobados: 125 },
      { mes: 'Junio', participantes: 167, aprobados: 145 }
    ],

    // Datos para gráfico de distribución de notas
    gradeDistribution: [
      { range: 'Excelente (6.0-7.0)', count: 45, percentage: 28.8 },
      { range: 'Bueno (5.0-5.9)', count: 62, percentage: 39.7 },
      { range: 'Regular (4.0-4.9)', count: 35, percentage: 22.4 },
      { range: 'Insuficiente (1.0-3.9)', count: 14, percentage: 9.0 }
    ],

    // Datos para gráfico de asistencia por curso
    attendanceByCourse: [
      {
        curso: 'Excel Avanzado',
        asistenciaPromedio: 92,
        participantes: 25,
        sesionesCompletadas: 8,
        totalSesiones: 10
      },
      {
        curso: 'Power BI',
        asistenciaPromedio: 89,
        participantes: 45,
        sesionesCompletadas: 12,
        totalSesiones: 15
      },
      {
        curso: 'Gestión Ágil',
        asistenciaPromedio: 95,
        participantes: 18,
        sesionesCompletadas: 6,
        totalSesiones: 8
      },
      {
        curso: 'Seguridad Informática',
        asistenciaPromedio: 82,
        participantes: 68,
        sesionesCompletadas: 15,
        totalSesiones: 20
      },
      {
        curso: 'Marketing Digital',
        asistenciaPromedio: 87,
        participantes: 32,
        sesionesCompletadas: 10,
        totalSesiones: 12
      }
    ],

    // Ranking de mejores estudiantes
    topStudents: [
      {
        nombre: 'María González',
        curso: 'Gestión Ágil',
        asistencia: 98,
        promedio: 6.8,
        puntuacionTotal: 94.4,
        contractor: 'Tech Solutions SpA'
      },
      {
        nombre: 'Carlos Rodríguez',
        curso: 'Excel Avanzado',
        asistencia: 95,
        promedio: 6.5,
        puntuacionTotal: 92.0,
        contractor: 'Empresa ABC Ltda.'
      },
      {
        nombre: 'Ana Martínez',
        curso: 'Power BI',
        asistencia: 92,
        promedio: 6.7,
        puntuacionTotal: 91.6,
        contractor: 'Constructora XYZ S.A.'
      },
      {
        nombre: 'Luis Fernández',
        curso: 'Marketing Digital',
        asistencia: 90,
        promedio: 6.4,
        puntuacionTotal: 90.4,
        contractor: 'Tech Solutions SpA'
      },
      {
        nombre: 'Patricia Silva',
        curso: 'Seguridad Informática',
        asistencia: 88,
        promedio: 6.6,
        puntuacionTotal: 89.6,
        contractor: 'Servicios Integrales DEF'
      },
      {
        nombre: 'Roberto Morales',
        curso: 'Excel Avanzado',
        asistencia: 85,
        promedio: 6.3,
        puntuacionTotal: 87.8,
        contractor: 'Empresa ABC Ltda.'
      },
      {
        nombre: 'Carmen López',
        curso: 'Power BI',
        asistencia: 87,
        promedio: 6.1,
        puntuacionTotal: 87.4,
        contractor: 'Constructora XYZ S.A.'
      },
      {
        nombre: 'Diego Herrera',
        curso: 'Gestión Ágil',
        asistencia: 82,
        promedio: 6.5,
        puntuacionTotal: 86.2,
        contractor: 'Tech Solutions SpA'
      }
    ],

    // Métricas de rendimiento
    performanceMetrics: {
      totalEstudiantes: 156,
      promedioGeneral: 6.1,
      asistenciaPromedio: 88.3,
      tasaAprobacion: 85.7,
      estudiantesDestacados: 12,
      cursosActivos: 5
    }
  };

  const exportReport = (format: 'excel' | 'pdf') => {
    // Simulación de exportación
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-8">
      {/* Header con tipografía consistente y nueva paleta */}
      <div className="bg-background-secondary border border-border-light rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans text-3xl font-bold text-text-primary flex items-center">
              <ChartBarIcon className="w-8 h-8 mr-3 text-primary-500" />
              Dashboard de Reportes
            </h1>
            <p className="font-sans text-base text-text-secondary mt-2">
              Análisis y estadísticas de cursos y participantes
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button onClick={() => exportReport('excel')} variant="secondary" size="sm">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={() => exportReport('pdf')} variant="primary" size="sm">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas de rendimiento mejoradas */}
      <PerformanceMetrics data={reportData.performanceMetrics} />

      {/* Nuevos Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de distribución de notas */}
        <SimpleGradeChart data={reportData.gradeDistribution} />

        {/* Ranking de mejores estudiantes */}
        <TopStudentsRanking data={reportData.topStudents} />
      </div>

      {/* Gráfico de asistencia por curso - ancho completo */}
      <SimpleAttendanceChart data={reportData.attendanceByCourse} />

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas por curso con nueva paleta */}
        <div className="bg-background-secondary border border-border-light rounded-lg shadow-sm p-6">
          <h3 className="font-sans text-xl font-bold text-text-primary mb-6">Rendimiento por Curso</h3>
          <div className="space-y-6">
            {reportData.cursoStats.map((curso, index) => (
              <div key={index} className="border-b border-border-light pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-sans text-base font-semibold text-text-primary">{curso.curso}</h4>
                  <span className="font-sans text-sm text-text-muted bg-background-tertiary px-3 py-1 rounded">
                    {curso.participantes} participantes
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="font-sans text-text-secondary">Aprobados:</span>
                    <span className="ml-2 font-sans font-semibold text-secondary-600">
                      {curso.aprobados}/{curso.participantes}
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-text-secondary">Promedio:</span>
                    <span className="ml-2 font-sans font-semibold text-text-primary">{curso.promedio}</span>
                  </div>
                  <div>
                    <span className="font-sans text-text-secondary">Asistencia:</span>
                    <span className="ml-2 font-sans font-semibold text-text-primary">{curso.asistencia}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-background-tertiary rounded-full h-3">
                    <div
                      className="bg-secondary-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(curso.aprobados / curso.participantes) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-text-muted">
                    <span>0%</span>
                    <span className="font-semibold text-secondary-600">
                      {Math.round((curso.aprobados / curso.participantes) * 100)}% aprobación
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas por contratista con nueva paleta */}
        <div className="bg-background-secondary border border-border-light rounded-lg shadow-sm p-6">
          <h3 className="font-sans text-xl font-bold text-text-primary mb-6">Rendimiento por Contratista</h3>
          <div className="space-y-6">
            {reportData.contratistaStats.map((contratista, index) => (
              <div key={index} className="border-b border-border-light pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-sans text-base font-semibold text-text-primary">{contratista.nombre}</h4>
                  <span className={`font-sans text-sm font-semibold px-3 py-1 rounded ${
                    contratista.tasa >= 85 ? 'bg-secondary-100 text-secondary-800' :
                    contratista.tasa >= 70 ? 'bg-warning-100 text-warning-800' :
                    'bg-error-100 text-error-800'
                  }`}>
                    {contratista.tasa}%
                  </span>
                </div>
                <div className="flex items-center justify-between font-sans text-sm text-text-secondary mb-3">
                  <span>{contratista.participantes} participantes</span>
                  <span>{contratista.aprobados} aprobados</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-background-tertiary rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        contratista.tasa >= 85 ? 'bg-secondary-500' :
                        contratista.tasa >= 70 ? 'bg-warning-500' :
                        'bg-error-500'
                      }`}
                      style={{ width: `${contratista.tasa}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-text-muted">
                    <span>0%</span>
                    <span className={`font-semibold ${
                      contratista.tasa >= 85 ? 'text-secondary-600' :
                      contratista.tasa >= 70 ? 'text-warning-600' :
                      'text-error-600'
                    }`}>
                      {contratista.tasa}% aprobación
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendencias */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias Mensuales</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportData.tendencias.map((mes, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{mes.mes}</h4>
              <p className="text-2xl font-bold text-blue-600 mt-2">{mes.participantes}</p>
              <p className="text-sm text-gray-600">participantes</p>
              <p className="text-sm text-green-600 font-medium mt-1">
                {mes.aprobados} aprobados
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas y recomendaciones */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">Recomendaciones</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Servicios Integrales DEF tiene una tasa de aprobación del 80%, considerar refuerzo.</li>
                <li>El curso de Seguridad Informática tiene la menor asistencia promedio (82%).</li>
                <li>Excelente rendimiento en Gestión Ágil con 95% de asistencia.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleReportsDashboard;
