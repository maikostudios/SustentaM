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
        return 'bg-red-100 text-red-800';
      case 'contratista':
        return 'bg-blue-100 text-blue-800';
      case 'usuario':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-theme-primary shadow-theme border-b border-theme">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Home button and title */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Inicio</span>
            </Button>

            {/* Title */}
            {title && (
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>
            )}
          </div>

          {/* Right side - Theme selector, User info and logout */}
          <div className="flex items-center space-x-4">
            {/* Theme selector */}
            <ThemeSelector variant="toggle" showLabel={false} />

            {/* User indicator */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user?.nombre || 'Usuario'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.rut}
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
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            {/* Help button */}
            {onHelpClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onHelpClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
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
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 border-t border-gray-100">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
                    )}
                    {item.href && !item.current ? (
                      <button
                        onClick={() => {
                          // Handle breadcrumb navigation
                          console.log('Navigate to:', item.href);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span 
                        className={`text-sm ${
                          item.current 
                            ? 'text-gray-900 font-medium' 
                            : 'text-gray-500'
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile title */}
            {title && (
              <div className="text-lg font-semibold text-gray-900 mb-3">
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
                  {user?.rut} • {getRoleDisplayName(user?.rol || '')}
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
