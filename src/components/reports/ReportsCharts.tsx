import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Participant, Course } from '../../types';
import { TrendsChart } from './TrendsChart';

interface ReportsChartsProps {
  participants: Participant[];
  courses: Course[];
}

const COLORS = ['#0A3D62', '#4CAF50', '#F57C00', '#D32F2F'];

export function ReportsCharts({ participants, courses }: ReportsChartsProps) {
  const chartData = useMemo(() => {
    // Attendance by course
    const attendanceByCourse = courses.map(course => {
      const courseParticipants = participants.filter(p => {
        // Simplified: match by course ID (in real app would use session relationships)
        return course.id === 'course-1' || course.id === 'course-2' || course.id === 'course-3' || course.id === 'course-4';
      });
      
      const totalParticipants = courseParticipants.length;
      const avgAttendance = totalParticipants > 0 
        ? courseParticipants.reduce((acc, p) => acc + p.asistencia, 0) / totalParticipants
        : 0;
      
      const approved = courseParticipants.filter(p => p.estado === 'aprobado').length;
      const failed = courseParticipants.filter(p => p.estado === 'reprobado').length;
      
      return {
        curso: course.codigo,
        nombre: course.nombre,
        asistenciaPromedio: Math.round(avgAttendance),
        aprobados: approved,
        reprobados: failed,
        total: totalParticipants
      };
    });

    // Overall stats
    const totalParticipants = participants.length;
    const approvedCount = participants.filter(p => p.estado === 'aprobado').length;
    const failedCount = participants.filter(p => p.estado === 'reprobado').length;
    const enrolledCount = participants.filter(p => p.estado === 'inscrito').length;

    const statusData = [
      { name: 'Aprobados', value: approvedCount, color: '#4CAF50' },
      { name: 'Reprobados', value: failedCount, color: '#D32F2F' },
      { name: 'Inscritos', value: enrolledCount, color: '#F57C00' }
    ];

    return {
      attendanceByCourse,
      statusData,
      totalStats: {
        totalParticipants,
        approvedCount,
        failedCount,
        enrolledCount,
        approvalRate: totalParticipants > 0 ? (approvedCount / totalParticipants) * 100 : 0
      }
    };
  }, [participants, courses]);

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {chartData.totalStats.totalParticipants}
          </div>
          <div className="text-sm text-gray-600">Total Participantes</div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {chartData.totalStats.approvedCount}
          </div>
          <div className="text-sm text-gray-600">Aprobados</div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-red-600">
            {chartData.totalStats.failedCount}
          </div>
          <div className="text-sm text-gray-600">Reprobados</div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-orange-600">
            {chartData.totalStats.approvalRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Tasa de Aprobación</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance by Course */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Asistencia Promedio por Curso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.attendanceByCourse}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="curso" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Asistencia (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Asistencia Promedio']}
                labelFormatter={(label) => `Curso: ${label}`}
              />
              <Bar dataKey="asistenciaPromedio" fill="#0A3D62" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Approval vs Failure by Course */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Aprobados vs Reprobados por Curso</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData.attendanceByCourse} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="curso"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Número de Participantes', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="aprobados" name="Aprobados" fill="#4CAF50" />
            <Bar dataKey="reprobados" name="Reprobados" fill="#D32F2F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trends Analysis */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Análisis de Tendencias</h2>
        <TrendsChart participants={participants} courses={courses} />
      </div>
    </div>
  );
}