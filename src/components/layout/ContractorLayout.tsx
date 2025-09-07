import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MainNavigation } from '../navigation/MainNavigation';
import { MainMenu } from '../navigation/MainMenu';
import { ChevronLeftIcon, ChevronRightIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { MenuProvider } from '../../contexts/MenuContext';
import { useThemeAware } from '../../hooks/useTheme';

interface ContractorLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  breadcrumbs?: Array<{ label: string; href?: string; current?: boolean }>;
  title?: string;
  onHelpClick?: () => void;
}

export function ContractorLayout({
  children,
  activeSection = 'dashboard',
  onSectionChange,
  breadcrumbs = [],
  title = 'Panel de Contratista',
  onHelpClick
}: ContractorLayoutProps) {
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
    <div className={`min-h-screen ${theme.bgSecondary}`}>
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
          userRole="contratista"
          className="md:hidden"
        />
      </MainNavigation>

      {/* Main Content Area */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Colapsable */}
        <div className={`hidden md:flex md:flex-col transition-all duration-300 ease-in-out ${
          isMenuCollapsed ? 'md:w-16' : 'md:w-64'
        }`}>
          <div className={`flex flex-col flex-grow pt-5 ${theme.bg} border-r ${theme.border} overflow-y-auto`}>
            <div className="flex items-center justify-between flex-shrink-0 px-4">
              {!isMenuCollapsed && (
                <h2 className={`text-lg font-semibold ${theme.text}`}>Menú Principal</h2>
              )}
              <button
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                className={`p-2 rounded-lg hover:${theme.bgSecondary} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                title={isMenuCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              >
                {isMenuCollapsed ? (
                  <ChevronRightIcon className={`w-5 h-5 ${theme.textSecondary}`} />
                ) : (
                  <ChevronLeftIcon className={`w-5 h-5 ${theme.textSecondary}`} />
                )}
              </button>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <MainMenu
                  activeItem={activeSection}
                  onItemClick={handleSectionChange}
                  userRole="contratista"
                  isCollapsed={isMenuCollapsed}
                />
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content - Adaptativo al estado del menú */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className={`flex-1 relative overflow-y-auto focus:outline-none ${theme.bg}`}>
            <div className="py-6">
              <div className={`mx-auto px-4 sm:px-6 md:px-8 transition-all duration-300 ${
                isMenuCollapsed
                  ? 'max-w-none' // Sin límite cuando está colapsado - usa todo el espacio
                  : 'max-w-7xl'  // Límite normal cuando está expandido
              }`}>
                {/* Proveer el estado del menú a través del contexto */}
                <MenuProvider isMenuCollapsed={isMenuCollapsed}>
                  {children}
                </MenuProvider>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}