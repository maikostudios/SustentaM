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
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';
import { useRoleNavbarTheme, useRoleBackgroundTheme } from '../../hooks/useRoleTheme';
import { MainNavigation } from '../navigation/MainNavigation';
import { MainMenu } from '../navigation/MainMenu';

interface UserLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  breadcrumbs?: Array<{ label: string; href?: string; current?: boolean }>;
  title?: string;
  onHelpClick?: () => void;
}

export function UserLayout({
  children,
  activeSection = 'dashboard',
  onSectionChange,
  breadcrumbs = [],
  title = 'PORTAL DEL PARTICIPANTE',
  onHelpClick
}: UserLayoutProps) {
  const { user } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const theme = useThemeAware();

  const handleSectionChange = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    setShowMobileMenu(false);
  };

  const handleHomeClick = () => {
    handleSectionChange('dashboard');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/img/fondo/fondo_1.png')",
        backgroundColor: '#1a1a2e' // Fallback color
      }}
    >
      {/* Main Navigation */}
      <MainNavigation
        breadcrumbs={breadcrumbs}
        title={title}
        onHomeClick={handleHomeClick}
        showMobileMenu={showMobileMenu}
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        onHelpClick={onHelpClick}
      >
        {/* Mobile menu content */}
        <MainMenu
          activeItem={activeSection}
          onItemClick={handleSectionChange}
          userRole="usuario"
          className="md:hidden"
        />
      </MainNavigation>

      {/* Main Content Area */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Colapsable */}
        <div className={`hidden md:flex md:flex-col transition-all duration-300 ease-in-out ${
          isMenuCollapsed ? 'md:w-16' : 'md:w-64'
        }`}>
          <div className={`flex flex-col flex-grow ${theme.bg} border-r ${theme.border} overflow-y-auto`} style={{ paddingTop: '72px' }}>
            <div className="flex items-center justify-between flex-shrink-0 px-4 py-1">
              {!isMenuCollapsed && (
                <h2 className={`text-lg font-semibold ${theme.text}`}>Menú Principal</h2>
              )}
              <button
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                className={`p-1.5 rounded-lg ${theme.hover} transition-colors`}
                title={isMenuCollapsed ? 'Expandir menú' : 'Contraer menú'}
              >
                {isMenuCollapsed ? (
                  <ChevronRightIcon className={`w-4 h-4 ${theme.textSecondary}`} />
                ) : (
                  <ChevronLeftIcon className={`w-4 h-4 ${theme.textSecondary}`} />
                )}
              </button>
            </div>

            <div className="flex-1 px-2 py-4">
              <MainMenu
                activeItem={activeSection}
                onItemClick={handleSectionChange}
                userRole="usuario"
                isCollapsed={isMenuCollapsed}
              />
            </div>
          </div>
        </div>

        {/* Main Content - Adaptativo al estado del menú */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className={`flex-1 relative overflow-y-auto focus:outline-none`} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <div className="py-6">
              <div className={`mx-auto px-4 sm:px-6 md:px-8 transition-all duration-300 ${
                isMenuCollapsed
                  ? 'max-w-none' // Sin límite cuando está colapsado - usa todo el espacio
                  : 'max-w-7xl'  // Límite normal cuando está expandido
              }`}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}