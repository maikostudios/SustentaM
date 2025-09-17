import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';
import { useRoleNavbarTheme, useRoleBackgroundTheme } from '../../hooks/useRoleTheme';

interface UserLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function UserLayout({ children, activeSection = 'dashboard', onSectionChange }: UserLayoutProps) {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useThemeAware();
  const roleNavbarTheme = useRoleNavbarTheme();
  const roleBackgroundTheme = useRoleBackgroundTheme();

  const navigation = [
    { id: 'dashboard', name: 'INICIO', icon: HomeIcon },
    { id: 'courses', name: 'MIS CURSOS', icon: BookOpenIcon },
    { id: 'certificates', name: 'CERTIFICADOS', icon: DocumentTextIcon },
    { id: 'profile', name: 'MI PERFIL', icon: UserIcon },
  ];

  const handleNavigation = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${roleBackgroundTheme}`}>
      {/* Header con gradiente SUSTENTA */}
      <header className={`${roleNavbarTheme.navbar} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo SUSTENTA rectangular */}
            <div className="flex items-center space-x-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                <img
                  src="/img/logo/logo_sustenta_rectangular.png"
                  alt="SUSTENTA"
                  className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div>
                <p className="font-sans text-xs text-purple-200">PORTAL DEL PARTICIPANTE</p>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`font-sans flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-purple-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="font-sans text-sm font-medium text-white">{user?.nombre}</p>
                <p className="font-sans text-xs text-blue-200">{user?.empresa}</p>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>

              {/* Logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-white/10 border border-white/20 hover:border-white/30"
                aria-label="Cerrar sesión"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="font-sans hidden sm:inline ml-2">SALIR</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800 dark:bg-blue-900 border-t border-white/10">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`font-sans flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </button>
              ))}

              {/* User info in mobile */}
              <div className="pt-3 mt-3 border-t border-white/10">
                <div className="px-3 py-2">
                  <p className="font-sans text-sm font-medium text-white">{user?.nombre}</p>
                  <p className="font-sans text-xs text-blue-200">{user?.empresa}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}