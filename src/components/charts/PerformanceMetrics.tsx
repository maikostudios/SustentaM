import React, { useMemo } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface PerformanceMetricsProps {
  data: {
    totalEstudiantes: number;
    promedioGeneral: number;
    asistenciaPromedio: number;
    tasaAprobacion: number;
    estudiantesDestacados: number;
    cursosActivos: number;
  };
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  const metrics = useMemo(() => [
    {
      title: 'Total Estudiantes',
      value: data.totalEstudiantes,
      icon: UserGroupIcon,
      color: 'primary',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      suffix: ''
    },
    {
      title: 'Promedio General',
      value: data.promedioGeneral,
      icon: AcademicCapIcon,
      color: 'secondary',
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
      suffix: '',
      decimals: 1
    },
    {
      title: 'Asistencia Promedio',
      value: data.asistenciaPromedio,
      icon: ClockIcon,
      color: 'accent',
      bgColor: 'bg-accent-50',
      iconColor: 'text-accent-600',
      suffix: '%',
      decimals: 1
    },
    {
      title: 'Tasa de Aprobación',
      value: data.tasaAprobacion,
      icon: CheckCircleIcon,
      color: 'success',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      suffix: '%',
      decimals: 1
    },
    {
      title: 'Estudiantes Destacados',
      value: data.estudiantesDestacados,
      icon: StarIcon,
      color: 'warning',
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
      suffix: ''
    },
    {
      title: 'Cursos Activos',
      value: data.cursosActivos,
      icon: ChartBarIcon,
      color: 'info',
      bgColor: 'bg-info-50',
      iconColor: 'text-info-600',
      suffix: ''
    }
  ], [data]);

  const formatValue = useMemo(() => (value: number, decimals?: number, suffix?: string) => {
    const formattedValue = decimals ? value.toFixed(decimals) : value.toString();
    return `${formattedValue}${suffix || ''}`;
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-sans text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {metric.title}
                </p>
                <p className="font-sans text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {formatValue(metric.value, metric.decimals, metric.suffix)}
                </p>
              </div>
            </div>
            
            {/* Indicador de rendimiento */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans text-gray-500 dark:text-gray-400">Rendimiento</span>
                <span className={`font-sans font-medium ${
                  (metric.suffix === '%' && metric.value >= 85) ||
                  (metric.title === 'Promedio General' && metric.value >= 6.0) ||
                  (metric.title === 'Total Estudiantes' && metric.value >= 100) ||
                  (metric.title === 'Estudiantes Destacados' && metric.value >= 10) ||
                  (metric.title === 'Cursos Activos' && metric.value >= 5)
                    ? 'text-green-600 dark:text-green-400' :
                  (metric.suffix === '%' && metric.value >= 70) ||
                  (metric.title === 'Promedio General' && metric.value >= 5.0) ||
                  (metric.title === 'Total Estudiantes' && metric.value >= 50) ||
                  (metric.title === 'Estudiantes Destacados' && metric.value >= 5) ||
                  (metric.title === 'Cursos Activos' && metric.value >= 3)
                    ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {(metric.suffix === '%' && metric.value >= 85) ||
                   (metric.title === 'Promedio General' && metric.value >= 6.0) ||
                   (metric.title === 'Total Estudiantes' && metric.value >= 100) ||
                   (metric.title === 'Estudiantes Destacados' && metric.value >= 10) ||
                   (metric.title === 'Cursos Activos' && metric.value >= 5)
                    ? 'Excelente' :
                   (metric.suffix === '%' && metric.value >= 70) ||
                   (metric.title === 'Promedio General' && metric.value >= 5.0) ||
                   (metric.title === 'Total Estudiantes' && metric.value >= 50) ||
                   (metric.title === 'Estudiantes Destacados' && metric.value >= 5) ||
                   (metric.title === 'Cursos Activos' && metric.value >= 3)
                    ? 'Bueno' : 'Mejorable'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    (metric.suffix === '%' && metric.value >= 85) ||
                    (metric.title === 'Promedio General' && metric.value >= 6.0) ||
                    (metric.title === 'Total Estudiantes' && metric.value >= 100) ||
                    (metric.title === 'Estudiantes Destacados' && metric.value >= 10) ||
                    (metric.title === 'Cursos Activos' && metric.value >= 5)
                      ? 'bg-green-500' :
                    (metric.suffix === '%' && metric.value >= 70) ||
                    (metric.title === 'Promedio General' && metric.value >= 5.0) ||
                    (metric.title === 'Total Estudiantes' && metric.value >= 50) ||
                    (metric.title === 'Estudiantes Destacados' && metric.value >= 5) ||
                    (metric.title === 'Cursos Activos' && metric.value >= 3)
                      ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(
                      metric.suffix === '%' ? metric.value : 
                      metric.title === 'Promedio General' ? (metric.value / 7) * 100 :
                      metric.title === 'Total Estudiantes' ? Math.min((metric.value / 200) * 100, 100) :
                      metric.title === 'Estudiantes Destacados' ? Math.min((metric.value / 20) * 100, 100) :
                      metric.title === 'Cursos Activos' ? Math.min((metric.value / 10) * 100, 100) : 100,
                      100
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
