import React from 'react';
import {
  AcademicCapIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  UsersIcon,
  UserGroupIcon,
  CogIcon,
  HomeIcon,
  BellIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  SwatchIcon,
  ShieldExclamationIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
}

interface MainMenuProps {
  activeItem?: string;
  onItemClick: (itemId: string) => void;
  userRole: 'administrador' | 'contratista' | 'usuario';
  className?: string;
  isCollapsed?: boolean;
}

export function MainMenu({ activeItem, onItemClick, userRole, className = '', isCollapsed = false }: MainMenuProps) {
  const theme = useThemeAware();
  
  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case 'administrador':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: HomeIcon,
            description: 'Vista general del sistema'
          },
          {
            id: 'courses',
            label: 'Gestión de Cursos',
            icon: AcademicCapIcon,
            description: 'Crear y administrar cursos'
          },
          {
            id: 'attendance',
            label: 'Asistencia y Notas',
            icon: DocumentCheckIcon,
            description: 'Gestionar asistencia y calificaciones'
          },
          {
            id: 'certificates',
            label: 'Certificados',
            icon: DocumentCheckIcon,
            description: 'Generar y gestionar certificados'
          },
          {
            id: 'contractors',
            label: 'Gestión de Contratistas',
            icon: UserGroupIcon,
            description: 'Administrar contratistas y sus datos'
          },
          {
            id: 'reports',
            label: 'Reportes',
            icon: ChartBarIcon,
            description: 'Análisis y estadísticas'
          },
          /* SECCIONES OCULTAS PARA PRESENTACIÓN AL CLIENTE
          {
            id: 'notifications',
            label: 'Notificaciones',
            icon: BellIcon,
            description: 'Sistema de notificaciones mejorado'
          },
          {
            id: 'performance',
            label: 'Rendimiento',
            icon: RocketLaunchIcon,
            description: 'Optimizaciones y métricas de rendimiento'
          },
          {
            id: 'validation',
            label: 'Validación',
            icon: ShieldCheckIcon,
            description: 'Sistema de validación de formularios mejorado'
          },
          */
          {
            id: 'search',
            label: 'Búsqueda',
            icon: MagnifyingGlassIcon,
            description: 'Búsqueda global y filtros avanzados'
          },
          /* SECCIONES OCULTAS PARA PRESENTACIÓN AL CLIENTE
          {
            id: 'accessibility',
            label: 'Accesibilidad',
            icon: EyeIcon,
            description: 'Configuración y herramientas de accesibilidad'
          },
          */
          {
            id: 'theme',
            label: 'Temas',
            icon: SwatchIcon,
            description: 'Sistema de temas y modo oscuro'
          },
          /* SECCIONES OCULTAS PARA PRESENTACIÓN AL CLIENTE
          {
            id: 'errors',
            label: 'Errores',
            icon: ShieldExclamationIcon,
            description: 'Sistema de manejo de errores y logging'
          },
          {
            id: 'seat-icons',
            label: 'Iconos de Butacas',
            icon: BuildingOfficeIcon,
            description: 'Demostración de iconos SVG de butacas'
          },
          */
          {
            id: 'settings',
            label: 'Configuración',
            icon: CogIcon,
            description: 'Configuración del sistema',
            disabled: true
          }
        ];
      
      case 'contratista':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: HomeIcon,
            description: 'Vista general'
          },
          {
            id: 'calendar',
            label: 'Calendario',
            icon: CalendarDaysIcon,
            description: 'Programación de cursos'
          },
          {
            id: 'enrollment',
            label: 'Inscripciones',
            icon: UsersIcon,
            description: 'Gestionar participantes'
          },
          {
            id: 'reports',
            label: 'Mis Reportes',
            icon: ChartBarIcon,
            description: 'Reportes de mis cursos'
          }
        ];
      
      case 'usuario':
        return [
          {
            id: 'dashboard',
            label: 'Mi Dashboard',
            icon: HomeIcon,
            description: 'Vista personal'
          },
          {
            id: 'courses',
            label: 'Mis Cursos',
            icon: AcademicCapIcon,
            description: 'Cursos inscritos'
          },
          {
            id: 'certificates',
            label: 'Mis Certificados',
            icon: DocumentCheckIcon,
            description: 'Certificados obtenidos'
          }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className={`space-y-2 ${className}`}>
      {menuItems.map((item) => {
        const isActive = activeItem === item.id;
        const IconComponent = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => !item.disabled && onItemClick(item.id)}
            disabled={item.disabled}
            title={isCollapsed ? item.label : undefined}
            className={`
              w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} text-left rounded-lg transition-all duration-200
              ${isActive
                ? `bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500`
                : `${theme.textSecondary} hover:${theme.bgSecondary} hover:${theme.text}`
              }
              ${item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            <IconComponent
              className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${
                isActive ? 'text-blue-600 dark:text-blue-400' : theme.textMuted
              }`}
            />

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isActive
                      ? 'text-blue-700 dark:text-blue-400'
                      : `${theme.text}`
                  }`}>
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        : `${theme.bgSecondary} ${theme.textSecondary}`
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className={`text-xs mt-1 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : `${theme.textSecondary}`
                  }`}>
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// Componente para menú móvil compacto
export function MobileMainMenu({ activeItem, onItemClick, userRole }: Omit<MainMenuProps, 'className'>) {
  const theme = useThemeAware();
  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case 'administrador':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
          { id: 'courses', label: 'Cursos', icon: AcademicCapIcon },
          { id: 'attendance', label: 'Asistencia', icon: DocumentCheckIcon },
          { id: 'certificates', label: 'Certificados', icon: DocumentCheckIcon },
          { id: 'contractors', label: 'Contratistas', icon: UserGroupIcon },
          { id: 'reports', label: 'Reportes', icon: ChartBarIcon },
          /* SECCIONES OCULTAS PARA PRESENTACIÓN AL CLIENTE
          { id: 'notifications', label: 'Notificaciones', icon: BellIcon },
          { id: 'performance', label: 'Rendimiento', icon: RocketLaunchIcon },
          { id: 'validation', label: 'Validación', icon: ShieldCheckIcon },
          */
          { id: 'search', label: 'Búsqueda', icon: MagnifyingGlassIcon },
          /* SECCIONES OCULTAS PARA PRESENTACIÓN AL CLIENTE
          { id: 'accessibility', label: 'Accesibilidad', icon: EyeIcon },
          */
          { id: 'theme', label: 'Temas', icon: SwatchIcon }
          /* SECCIONES OCULTAS PARA PRESENTACIÓN AL CLIENTE
          { id: 'errors', label: 'Errores', icon: ShieldExclamationIcon }
          */
        ];
      
      case 'contratista':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
          { id: 'calendar', label: 'Calendario', icon: CalendarDaysIcon },
          { id: 'enrollment', label: 'Inscripciones', icon: UsersIcon },
          { id: 'reports', label: 'Reportes', icon: ChartBarIcon }
        ];
      
      case 'usuario':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
          { id: 'courses', label: 'Cursos', icon: AcademicCapIcon },
          { id: 'certificates', label: 'Certificados', icon: DocumentCheckIcon }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`flex overflow-x-auto space-x-1 p-2 ${theme.bgSecondary} rounded-lg`}>
      {menuItems.map((item) => {
        const isActive = activeItem === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`
              flex flex-col items-center px-3 py-2 rounded-md min-w-0 flex-shrink-0 transition-all
              ${isActive
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : `${theme.textSecondary} hover:${theme.bg} hover:${theme.text}`
              }
            `}
          >
            <IconComponent className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium truncate max-w-16">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
