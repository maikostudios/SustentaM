import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AttendanceByCoursesChartProps {
  data: Array<{
    curso: string;
    asistenciaPromedio: number;
    participantes: number;
    sesionesCompletadas: number;
    totalSesiones: number;
  }>;
}

export function AttendanceByCoursesChart({ data }: AttendanceByCoursesChartProps) {
  const memoizedData = useMemo(() => data, [data]);

  const CustomTooltip = useMemo(() => ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              <span className="font-medium">Asistencia Promedio:</span> {data.asistenciaPromedio}%
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Participantes:</span> {data.participantes}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Progreso:</span> {data.sesionesCompletadas}/{data.totalSesiones} sesiones
            </p>
          </div>
        </div>
      );
    }
    return null;
  }, []);

  const getBarColor = useMemo(() => (asistencia: number) => {
    if (asistencia >= 90) return '#10B981'; // green-500
    if (asistencia >= 80) return '#3B82F6'; // blue-500
    if (asistencia >= 70) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  }, []);

  const CustomBar = (props: any) => {
    const { fill, ...rest } = props;
    const color = getBarColor(props.payload.asistenciaPromedio);
    return <Bar {...rest} fill={color} />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Asistencia por Curso
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={memoizedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="curso" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="#6B7280"
            />
            <YAxis 
              domain={[0, 100]}
              fontSize={12}
              stroke="#6B7280"
              label={{ value: 'Asistencia (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="asistenciaPromedio" 
              radius={[4, 4, 0, 0]}
              shape={<CustomBar />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Leyenda de colores */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
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
    </div>
  );
}
