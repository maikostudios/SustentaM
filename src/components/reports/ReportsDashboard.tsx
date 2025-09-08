import React, { useState, useMemo } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Course, Participant } from '../../types';
import { ReportsCharts } from './ReportsCharts';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  FunnelIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ReportsDashboardProps {
  courses: Course[];
  participants: Participant[];
}

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  selectedCourse: string;
  selectedContractor: string;
  status: string;
}

export function ReportsDashboard({ courses, participants }: ReportsDashboardProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '',
      end: ''
    },
    selectedCourse: '',
    selectedContractor: '',
    status: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Get unique contractors
  const contractors = useMemo(() => {
    const uniqueContractors = [...new Set(participants.map(p => p.contractor))];
    return uniqueContractors.filter(Boolean);
  }, [participants]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    let filteredParticipants = [...participants];
    let filteredCourses = [...courses];

    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = parseISO(filters.dateRange.start);
      const endDate = parseISO(filters.dateRange.end);
      
      filteredCourses = courses.filter(course => {
        const courseStart = parseISO(course.fechaInicio);
        const courseEnd = parseISO(course.fechaFin);
        return isWithinInterval(courseStart, { start: startDate, end: endDate }) ||
               isWithinInterval(courseEnd, { start: startDate, end: endDate });
      });
      
      const filteredCourseIds = filteredCourses.map(c => c.id);
      // Note: In a real app, we'd filter by session dates, not course IDs directly
      filteredParticipants = participants.filter(p => 
        filteredCourseIds.includes(p.sessionId) // Simplified for demo
      );
    }

    // Filter by course
    if (filters.selectedCourse) {
      filteredCourses = filteredCourses.filter(c => c.id === filters.selectedCourse);
      filteredParticipants = filteredParticipants.filter(p => 
        p.sessionId === filters.selectedCourse // Simplified for demo
      );
    }

    // Filter by contractor
    if (filters.selectedContractor) {
      filteredParticipants = filteredParticipants.filter(p => 
        p.contractor === filters.selectedContractor
      );
    }

    // Filter by status
    if (filters.status) {
      filteredParticipants = filteredParticipants.filter(p => 
        p.estado === filters.status
      );
    }

    return {
      courses: filteredCourses,
      participants: filteredParticipants
    };
  }, [courses, participants, filters]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalParticipants = filteredData.participants.length;
    const approvedCount = filteredData.participants.filter(p => p.estado === 'aprobado').length;
    const failedCount = filteredData.participants.filter(p => p.estado === 'reprobado').length;
    const enrolledCount = filteredData.participants.filter(p => p.estado === 'inscrito').length;
    
    const avgAttendance = totalParticipants > 0 
      ? filteredData.participants.reduce((acc, p) => acc + p.asistencia, 0) / totalParticipants
      : 0;
    
    const avgGrade = totalParticipants > 0
      ? filteredData.participants.reduce((acc, p) => acc + p.nota, 0) / totalParticipants
      : 0;

    return {
      totalParticipants,
      approvedCount,
      failedCount,
      enrolledCount,
      approvalRate: totalParticipants > 0 ? (approvedCount / totalParticipants) * 100 : 0,
      avgAttendance: Math.round(avgAttendance),
      avgGrade: Math.round(avgGrade * 10) / 10,
      totalCourses: filteredData.courses.length,
      activeContractors: [...new Set(filteredData.participants.map(p => p.contractor))].length
    };
  }, [filteredData]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      selectedCourse: '',
      selectedContractor: '',
      status: ''
    });
  };

  const exportToPDF = () => {
    // Simulate PDF export
    const reportData = {
      generatedAt: new Date().toISOString(),
      filters,
      kpis,
      participantsCount: filteredData.participants.length,
      coursesCount: filteredData.courses.length
    };
    
    console.log('Exporting report to PDF:', reportData);
    
    // Create a simple text report for demo
    const reportText = `
REPORTE DE CAPACITACIONES
Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}

RESUMEN EJECUTIVO:
- Total Participantes: ${kpis.totalParticipants}
- Cursos Activos: ${kpis.totalCourses}
- Tasa de Aprobación: ${kpis.approvalRate.toFixed(1)}%
- Asistencia Promedio: ${kpis.avgAttendance}%
- Nota Promedio: ${kpis.avgGrade}

FILTROS APLICADOS:
- Rango de Fechas: ${filters.dateRange.start || 'No especificado'} - ${filters.dateRange.end || 'No especificado'}
- Curso: ${filters.selectedCourse ? courses.find(c => c.id === filters.selectedCourse)?.nombre : 'Todos'}
- Contratista: ${filters.selectedContractor || 'Todos'}
- Estado: ${filters.status || 'Todos'}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-capacitaciones-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Dashboard de Reportes
          </h1>
          <p className="font-sans text-gray-600 dark:text-gray-400 mt-1">
            Análisis y métricas de capacitaciones
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filtros</span>
          </Button>
          
          <Button
            variant="primary"
            onClick={exportToPDF}
            className="flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Exportar PDF</span>
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Reporte</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center space-x-1"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Limpiar</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                Fecha Fin
              </label>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
              />
            </div>

            {/* Course Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <AcademicCapIcon className="w-4 h-4 mr-1" />
                Curso
              </label>
              <select
                value={filters.selectedCourse}
                onChange={(e) => handleFilterChange('selectedCourse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los cursos</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.codigo} - {course.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Contractor Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                Contratista
              </label>
              <select
                value={filters.selectedContractor}
                onChange={(e) => handleFilterChange('selectedContractor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los contratistas</option>
                {contractors.map(contractor => (
                  <option key={contractor} value={contractor}>
                    {contractor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
            <div className="flex space-x-4">
              {['', 'inscrito', 'aprobado', 'reprobado'].map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={filters.status === status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {status === '' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="font-sans text-3xl font-bold">{kpis.totalParticipants}</div>
          <div className="font-sans text-blue-100">Total Participantes</div>
          <div className="font-sans text-sm text-blue-200 mt-1">
            En {kpis.totalCourses} cursos
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="font-sans text-3xl font-bold">{kpis.approvalRate.toFixed(1)}%</div>
          <div className="font-sans text-green-100">Tasa de Aprobación</div>
          <div className="font-sans text-sm text-green-200 mt-1">
            {kpis.approvedCount} de {kpis.totalParticipants}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="font-sans text-3xl font-bold">{kpis.avgAttendance}%</div>
          <div className="font-sans text-orange-100">Asistencia Promedio</div>
          <div className="font-sans text-sm text-orange-200 mt-1">
            Nota promedio: {kpis.avgGrade}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="font-sans text-3xl font-bold">{kpis.activeContractors}</div>
          <div className="font-sans text-purple-100">Contratistas Activos</div>
          <div className="font-sans text-sm text-purple-200 mt-1">
            Participando en cursos
          </div>
        </div>
      </div>

      {/* Charts */}
      <ReportsCharts 
        participants={filteredData.participants} 
        courses={filteredData.courses} 
      />
    </div>
  );
}
