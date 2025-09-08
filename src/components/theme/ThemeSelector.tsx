import React, { useState } from 'react';
import { useTheme, Theme } from '../../hooks/useTheme';
import { useScreenReader } from '../../hooks/useAccessibility';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'toggle' | 'full';
  showLabel?: boolean;
  className?: string;
}

export function ThemeSelector({
  variant = 'dropdown',
  showLabel = true,
  className = ''
}: ThemeSelectorProps) {
  // SELECTOR DE TEMAS DESACTIVADO - Solo modo oscuro
  // Retornar null para ocultar completamente el selector
  return null;

  // Código original comentado para referencia futura
  /*
  const {
    theme,
    effectiveTheme,
    systemPreference,
    transitions,
    highContrast,
    isChanging,
    setTheme,
    toggleTheme,
    setTransitions,
    setHighContrast
  } = useTheme();

  const { announce } = useScreenReader();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = async (newTheme: Theme) => {
    // Desactivado - solo modo oscuro
    // await setTheme(newTheme);
    // announce(`Tema cambiado a ${newTheme === 'auto' ? 'automático' : newTheme}`, 'polite');
    // setIsOpen(false);
  };

  const handleToggle = async () => {
    // Desactivado - solo modo oscuro
    // await toggleTheme();
    // announce(`Tema cambiado a ${effectiveTheme === 'dark' ? 'claro' : 'oscuro'}`, 'polite');
  };

  const getThemeIcon = (themeType: Theme | 'effective') => {
    if (themeType === 'effective') {
      return effectiveTheme === 'dark' ? MoonIcon : SunIcon;
    }
    
    switch (themeType) {
      case 'light':
        return SunIcon;
      case 'dark':
        return MoonIcon;
      case 'auto':
        return ComputerDesktopIcon;
      default:
        return SunIcon;
    }
  };

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      case 'auto':
        return 'Automático';
      default:
        return 'Claro';
    }
  };

  if (variant === 'toggle') {
    const IconComponent = getThemeIcon('effective');
    
    return (
      <button
        onClick={handleToggle}
        disabled={isChanging}
        className={clsx(
          'inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200',
          'bg-theme-secondary hover:bg-theme-tertiary',
          'text-theme-secondary hover:text-theme-primary',
          'border border-theme focus:outline-none focus:ring-2 focus:ring-blue-500',
          isChanging && 'opacity-50 cursor-not-allowed',
          className
        )}
        aria-label={`Cambiar a tema ${effectiveTheme === 'dark' ? 'claro' : 'oscuro'}`}
      >
        <IconComponent className="h-5 w-5" />
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {effectiveTheme === 'dark' ? 'Claro' : 'Oscuro'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    const IconComponent = getThemeIcon(theme);
    
    return (
      <div className={clsx('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChanging}
          className={clsx(
            'inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200',
            'bg-theme-secondary hover:bg-theme-tertiary',
            'text-theme-secondary hover:text-theme-primary',
            'border border-theme focus:outline-none focus:ring-2 focus:ring-blue-500',
            isChanging && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Selector de tema"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <IconComponent className="h-5 w-5" />
          {showLabel && (
            <span className="ml-2 text-sm font-medium">
              {getThemeLabel(theme)}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-theme-primary border border-theme rounded-lg shadow-theme z-50">
            <div className="py-1">
              {(['light', 'dark', 'auto'] as Theme[]).map((themeOption) => {
                const IconComponent = getThemeIcon(themeOption);
                const isSelected = theme === themeOption;
                
                return (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={clsx(
                      'w-full flex items-center px-3 py-2 text-sm transition-colors',
                      'hover:bg-theme-secondary',
                      isSelected 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
                        : 'text-theme-primary'
                    )}
                    role="menuitem"
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{getThemeLabel(themeOption)}</span>
                    {themeOption === 'auto' && (
                      <span className="text-xs text-theme-muted ml-2">
                        ({systemPreference})
                      </span>
                    )}
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Overlay para cerrar el dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // Variant 'full' - Panel completo de configuración
  return (
    <div className={clsx('space-y-6', className)}>
      {/* Selector de tema principal */}
      <div>
        <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center">
          <SwatchIcon className="h-5 w-5 mr-2" />
          Tema de la Aplicación
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['light', 'dark', 'auto'] as Theme[]).map((themeOption) => {
            const IconComponent = getThemeIcon(themeOption);
            const isSelected = theme === themeOption;
            
            return (
              <button
                key={themeOption}
                onClick={() => handleThemeChange(themeOption)}
                disabled={isChanging}
                className={clsx(
                  'flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200',
                  'hover:shadow-theme focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-theme bg-theme-secondary hover:border-theme-light',
                  isChanging && 'opacity-50 cursor-not-allowed'
                )}
              >
                <IconComponent className={clsx(
                  'h-8 w-8 mb-2',
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-theme-secondary'
                )} />
                <span className={clsx(
                  'text-sm font-medium',
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-theme-primary'
                )}>
                  {getThemeLabel(themeOption)}
                </span>
                {themeOption === 'auto' && (
                  <span className="text-xs text-theme-muted mt-1">
                    Sistema: {systemPreference}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuraciones adicionales */}
      <div>
        <h4 className="text-md font-medium text-theme-primary mb-3 flex items-center">
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
          Configuraciones Avanzadas
        </h4>
        
        <div className="space-y-3">
          {/* Transiciones */}
          <div className="flex items-center justify-between p-3 bg-theme-secondary rounded-lg">
            <div>
              <label className="text-sm font-medium text-theme-primary">
                Transiciones Suaves
              </label>
              <p className="text-xs text-theme-muted">
                Anima los cambios de tema
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={transitions}
              onClick={() => setTransitions(!transitions)}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                transitions ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  transitions ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Alto contraste */}
          <div className="flex items-center justify-between p-3 bg-theme-secondary rounded-lg">
            <div>
              <label className="text-sm font-medium text-theme-primary">
                Alto Contraste
              </label>
              <p className="text-xs text-theme-muted">
                Aumenta el contraste para mejor visibilidad
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa */}
      <div>
        <h4 className="text-md font-medium text-theme-primary mb-3 flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2" />
          Vista Previa
        </h4>
        
        <div className="p-4 bg-theme-secondary border border-theme rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-theme-primary font-medium">Tema actual:</span>
              <span className="text-theme-secondary">
                {getThemeLabel(theme)} {theme === 'auto' && `(${effectiveTheme})`}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">Primario</span>
              </div>
              <div className="flex-1 h-8 bg-theme-tertiary border border-theme rounded flex items-center justify-center">
                <span className="text-theme-primary text-xs font-medium">Secundario</span>
              </div>
              <div className="flex-1 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">Éxito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  */
}
