import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Participant } from '../../types';

interface TrendsChartProps {
  participants: Participant[];
  courses: Course[];
}

export function TrendsChart({ participants, courses }: TrendsChartProps) {
  const trendsData = useMemo(() => {
    // Generate last 6 months
    const endDate = new Date();
    const startDate = subMonths(endDate, 5);
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    return months.map(month => {
      const monthStr = format(month, 'yyyy-MM');
      const monthName = format(month, 'MMM yyyy', { locale: es });

      // Filter courses that started in this month
      const monthCourses = courses.filter(course => {
        const courseStart = parseISO(course.fechaInicio);
        return format(courseStart, 'yyyy-MM') === monthStr;
      });

      // Get participants for courses in this month
      const monthParticipants = participants.filter(participant => {
        // In a real app, we'd join through sessions
        // For demo, we'll simulate by matching some participants to courses
        return monthCourses.some(course => 
          participant.id.includes(course.id.slice(-1)) // Simple simulation
        );
      });

      const totalParticipants = monthParticipants.length;
      const approved = monthParticipants.filter(p => p.estado === 'aprobado').length;
      const failed = monthParticipants.filter(p => p.estado === 'reprobado').length;
      const enrolled = monthParticipants.filter(p => p.estado === 'inscrito').length;

      const avgAttendance = totalParticipants > 0
        ? monthParticipants.reduce((acc, p) => acc + p.asistencia, 0) / totalParticipants
        : 0;

      const avgGrade = totalParticipants > 0
        ? monthParticipants.reduce((acc, p) => acc + p.nota, 0) / totalParticipants
        : 0;

      return {
        month: monthName,
        monthKey: monthStr,
        totalParticipants,
        approved,
        failed,
        enrolled,
        avgAttendance: Math.round(avgAttendance),
        avgGrade: Math.round(avgGrade * 10) / 10,
        approvalRate: totalParticipants > 0 ? (approved / totalParticipants) * 100 : 0,
        coursesStarted: monthCourses.length
      };
    });
  }, [participants, courses]);

  return (
    <div className="space-y-8">
      {/* Participation Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Tendencia de Participación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Participantes', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                const labels = {
                  totalParticipants: 'Total',
                  approved: 'Aprobados',
                  failed: 'Reprobados',
                  enrolled: 'Inscritos'
                };
                return [value, labels[name as keyof typeof labels] || name];
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="totalParticipants" 
              stackId="1"
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.6}
              name="totalParticipants"
            />
            <Area 
              type="monotone" 
              dataKey="approved" 
              stackId="2"
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6}
              name="approved"
            />
            <Area 
              type="monotone" 
              dataKey="failed" 
              stackId="2"
              stroke="#EF4444" 
              fill="#EF4444" 
              fillOpacity={0.6}
              name="failed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Approval Rate Trend */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Evolución Tasa de Aprobación</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Tasa (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Tasa de Aprobación']}
              />
              <Line 
                type="monotone" 
                dataKey="approvalRate" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Evolución Asistencia Promedio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Asistencia (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Asistencia Promedio']}
              />
              <Line 
                type="monotone" 
                dataKey="avgAttendance" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Courses and Grades Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Courses Started */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Cursos Iniciados por Mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Cursos', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [value, 'Cursos Iniciados']}
              />
              <Line 
                type="monotone" 
                dataKey="coursesStarted" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average Grade Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Evolución Nota Promedio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Nota', angle: -90, position: 'insideLeft' }}
                domain={[1, 7]}
              />
              <Tooltip 
                formatter={(value) => [value, 'Nota Promedio']}
              />
              <Line 
                type="monotone" 
                dataKey="avgGrade" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen de Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {trendsData.reduce((acc, month) => acc + month.totalParticipants, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Participantes (6 meses)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {trendsData.reduce((acc, month) => acc + month.coursesStarted, 0)}
            </div>
            <div className="text-sm text-gray-600">Cursos Iniciados (6 meses)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(trendsData.reduce((acc, month) => acc + month.approvalRate, 0) / trendsData.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Tasa Aprobación Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
}
