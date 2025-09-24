import React from 'react';
import {
  HomeIcon,
  ChevronRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { ThemeSelector } from '../theme/ThemeSelector';
import { useThemeAware } from '../../hooks/useTheme';
import { useRoleNavbarTheme } from '../../hooks/useRoleTheme';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface MainNavigationProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  onHomeClick?: () => void;
  showMobileMenu?: boolean;
  onToggleMobileMenu?: () => void;
  onHelpClick?: () => void;
  children?: React.ReactNode;
}

export function MainNavigation({
  breadcrumbs = [],
  title,
  onHomeClick,
  showMobileMenu = false,
  onToggleMobileMenu,
  onHelpClick,
  children
}: MainNavigationProps) {
  const { user, logout } = useAuthStore();
  const theme = useThemeAware();
  const roleNavbarTheme = useRoleNavbarTheme();

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      // Default behavior - reload page or navigate to dashboard
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'contratista':
        return 'Contratista';
      case 'usuario':
        return 'Usuario';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'bg-blue-100 text-blue-800'; // ADMIN - Azul
      case 'contratista':
        return 'bg-sky-100 text-sky-800'; // EMPRESA - Celeste
      case 'usuario':
        return 'bg-purple-100 text-purple-800'; // PARTICIPANTE - Morado
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${roleNavbarTheme.navbar} relative`}>
      {/* Logo SUSTENTA en esquina superior izquierda - solo en desktop */}
      <div className={`hidden md:flex absolute left-0 top-0 w-64 items-center justify-center z-10 ${roleNavbarTheme.navbar}`} style={{ height: '72px' }}>
        <img
          src="/img/logo/logo_sustenta_rectangular.png"
          alt="SUSTENTA"
          className="h-16 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Main Navigation Bar - Comienza después del sidebar */}
      <div className="md:ml-64 px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center" style={{ height: '72px' }}>
          {/* Left side - Home button and title */}
          <div className="flex items-center space-x-6">

            {/* Mobile menu button */}
            <button
              type="button"
              className={`md:hidden p-2 rounded-md ${theme.textMuted} hover:${theme.textSecondary} hover:${theme.bgSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={onToggleMobileMenu}
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Home button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHomeClick}
              className={`flex items-center space-x-2 ${roleNavbarTheme.textSecondary} hover:${roleNavbarTheme.text}`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Inicio</span>
            </Button>

            {/* Desktop title */}
            {title && (
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white dark:text-white font-sans">
                  {title}
                </h1>
              </div>
            )}

          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            {/* Theme selector oculto para evitar problemas de elementos perdidos */}

            {/* User indicator */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className={`text-sm font-medium ${roleNavbarTheme.text}`}>
                  {user?.nombre || 'Usuario'}
                </div>
              </div>
              
              {/* Role badge */}
              {user?.rol && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.rol)}`}>
                  {getRoleDisplayName(user.rol)}
                </span>
              )}

              {/* User avatar */}
              <div className="flex items-center">
                <UserCircleIcon className={`w-8 h-8 ${roleNavbarTheme.textMuted}`} />
              </div>
            </div>

            {/* Help button */}
            {onHelpClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onHelpClick}
                className="flex items-center space-x-2 text-white hover:text-gray-200 dark:text-white dark:hover:text-gray-300"
              >
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Ayuda</span>
              </Button>
            )}

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={`flex items-center space-x-2 ${roleNavbarTheme.textSecondary} hover:text-red-300`}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>



      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile title */}
            {title && (
              <div className="text-lg font-semibold text-white dark:text-white mb-3">
                {title}
              </div>
            )}
            
            {/* Mobile user info */}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {user?.nombre || 'Usuario'}
                </div>
                <div className="text-xs text-gray-500">
                  {getRoleDisplayName(user?.rol || '')}
                </div>
              </div>
            </div>

            {/* Mobile navigation items */}
            {children && (
              <div className="space-y-1">
                {children}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
