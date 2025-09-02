import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export const SustentaThemeDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { name: 'Cursos Activos', value: '24', icon: BookOpenIcon, change: '+12%' },
    { name: 'Estudiantes', value: '1,234', icon: UserGroupIcon, change: '+8%' },
    { name: 'Certificaciones', value: '89', icon: ChartBarIcon, change: '+23%' },
    { name: 'Instructores', value: '15', icon: CogIcon, change: '+5%' }
  ];

  const courses = [
    { 
      title: 'Seguridad Industrial Básica', 
      students: 45, 
      progress: 78,
      category: 'Seguridad'
    },
    { 
      title: 'Manejo de Equipos Pesados', 
      students: 32, 
      progress: 65,
      category: 'Operación'
    },
    { 
      title: 'Primeros Auxilios', 
      students: 67, 
      progress: 92,
      category: 'Salud'
    }
  ];

  return (
    <div className="min-h-screen bg-sustenta-gray">
      {/* Header con gradiente SUSTENTA */}
      <header className="bg-gradient-sustenta shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="hexagon-sustenta mr-4"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">SUSTENTA</h1>
                <p className="text-sustenta-light-blue text-sm">Capacitación y Entrenamiento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sustenta-blue focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'courses', label: 'Cursos' },
              { id: 'students', label: 'Estudiantes' },
              { id: 'reports', label: 'Reportes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-sustenta-blue text-sustenta-blue'
                    : 'border-transparent text-gray-500 hover:text-sustenta-purple hover:border-sustenta-purple'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-sustenta p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-sustenta-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2">
            <div className="card-sustenta">
              <div className="header-sustenta">
                <h2 className="text-xl font-semibold">Cursos Populares</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.students} estudiantes</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-medium text-sustenta-blue">{course.progress}%</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-sustenta h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sustenta-light-blue text-sustenta-blue">
                          {course.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="btn-sustenta-primary w-full">
                    Ver Todos los Cursos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card-sustenta">
              <div className="header-sustenta">
                <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="btn-sustenta-primary w-full">
                  Crear Nuevo Curso
                </button>
                <button className="btn-sustenta-secondary w-full">
                  Generar Reporte
                </button>
                <button className="btn-sustenta-outline w-full">
                  Configuración
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-sustenta">
              <div className="header-sustenta">
                <h3 className="text-lg font-semibold">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    'Juan Pérez completó "Seguridad Industrial"',
                    'Nuevo curso "Soldadura Avanzada" creado',
                    'María García obtuvo certificación',
                    'Reporte mensual generado'
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-sustenta-blue rounded-full mt-2"></div>
                      <p className="ml-3 text-sm text-gray-600">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SustentaThemeDemo;
