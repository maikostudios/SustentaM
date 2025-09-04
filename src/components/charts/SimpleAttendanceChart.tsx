import React from 'react';

interface SimpleAttendanceChartProps {
  data: Array<{
    curso: string;
    asistenciaPromedio: number;
    participantes: number;
    sesionesCompletadas: number;
    totalSesiones: number;
  }>;
}

export function SimpleAttendanceChart({ data }: SimpleAttendanceChartProps) {
  const getBarColor = (asistencia: number) => {
    if (asistencia >= 90) return '#10B981'; // green-500
    if (asistencia >= 80) return '#3B82F6'; // blue-500
    if (asistencia >= 70) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  const getColorClass = (asistencia: number) => {
    if (asistencia >= 90) return 'text-green-600';
    if (asistencia >= 80) return 'text-blue-600';
    if (asistencia >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const maxAsistencia = Math.max(...data.map(item => item.asistenciaPromedio));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Asistencia por Curso
      </h3>
      
      {/* Gráfico de barras vertical simple */}
      <div className="space-y-4 mb-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">{item.curso}</span>
                <div className="text-xs text-gray-500">
                  {item.participantes} participantes • {item.sesionesCompletadas}/{item.totalSesiones} sesiones
                </div>
              </div>
              <span className={`text-lg font-bold ${getColorClass(item.asistenciaPromedio)}`}>
                {item.asistenciaPromedio}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${item.asistenciaPromedio}%`,
                  backgroundColor: getBarColor(item.asistenciaPromedio)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda de colores */}
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-green-500 mr-2"></div>
          <span className="text-gray-600">Excelente (≥90%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
          <span className="text-gray-600">Bueno (80-89%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-amber-500 mr-2"></div>
          <span className="text-gray-600">Regular (70-79%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>
          <span className="text-gray-600">Bajo (&lt;70%)</span>
        </div>
      </div>

      {/* Estadísticas resumen */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.length}</div>
            <div className="text-xs text-gray-500">Cursos Activos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, item) => sum + item.participantes, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Participantes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {(data.reduce((sum, item) => sum + item.asistenciaPromedio, 0) / data.length).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Promedio General</div>
          </div>
        </div>
      </div>
    </div>
  );
}
