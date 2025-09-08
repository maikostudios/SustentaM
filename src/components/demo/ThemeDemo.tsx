import React, { useState } from 'react';
import { ThemeSelector } from '../theme/ThemeSelector';
import { useTheme, useThemeAware } from '../../hooks/useTheme';
import { 
  SwatchIcon, 
  SunIcon, 
  MoonIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  EyeIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export function ThemeDemo() {
  const [activeDemo, setActiveDemo] = useState<'selector' | 'components' | 'colors'>('selector');
  const { 
    theme, 
    effectiveTheme, 
    systemPreference, 
    isDark, 
    isLight, 
    getThemeColors 
  } = useTheme();
  
  const themeAware = useThemeAware();
  const colors = getThemeColors();

  const demoComponents = [
    {
      name: 'Botones',
      component: (
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Primario
          </button>
          <button className={clsx(
            'px-4 py-2 rounded-lg border transition-colors',
            'bg-theme-secondary border-theme text-theme-primary hover:bg-theme-tertiary'
          )}>
            Secundario
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Éxito
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Peligro
          </button>
        </div>
      )
    },
    {
      name: 'Tarjetas',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={clsx(
            'p-4 rounded-lg border shadow-theme',
            'bg-theme-primary border-theme'
          )}>
            <h4 className="font-semibold text-theme-primary mb-2">Tarjeta Principal</h4>
            <p className="text-theme-secondary text-sm">
              Esta es una tarjeta que se adapta automáticamente al tema seleccionado.
            </p>
          </div>
          <div className={clsx(
            'p-4 rounded-lg border shadow-theme',
            'bg-theme-secondary border-theme'
          )}>
            <h4 className="font-semibold text-theme-primary mb-2">Tarjeta Secundaria</h4>
            <p className="text-theme-secondary text-sm">
              Los colores cambian suavemente entre temas claro y oscuro.
            </p>
          </div>
        </div>
      )
    },
    {
      name: 'Formularios',
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">
              Campo de Texto
            </label>
            <input
              type="text"
              placeholder="Escribe algo aquí..."
              className={clsx(
                'block w-full px-3 py-2 rounded-lg border transition-colors',
                'bg-theme-primary border-theme text-theme-primary',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">
              Área de Texto
            </label>
            <textarea
              rows={3}
              placeholder="Descripción..."
              className={clsx(
                'block w-full px-3 py-2 rounded-lg border transition-colors',
                'bg-theme-primary border-theme text-theme-primary',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              )}
            />
          </div>
        </div>
      )
    },
    {
      name: 'Alertas',
      component: (
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
            <span className="text-blue-800 dark:text-blue-200 text-sm">
              Información importante sobre el tema
            </span>
          </div>
          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-800 dark:text-green-200 text-sm">
              Tema aplicado correctamente
            </span>
          </div>
          <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-3" />
            <span className="text-yellow-800 dark:text-yellow-200 text-sm">
              Advertencia sobre compatibilidad
            </span>
          </div>
          <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-800 dark:text-red-200 text-sm">
              Error en la configuración
            </span>
          </div>
        </div>
      )
    }
  ];

  const colorPalette = [
    { name: 'Fondo Principal', value: colors.background.primary, textColor: colors.text.primary },
    { name: 'Fondo Secundario', value: colors.background.secondary, textColor: colors.text.primary },
    { name: 'Fondo Terciario', value: colors.background.tertiary, textColor: colors.text.primary },
    { name: 'Texto Principal', value: colors.text.primary, bgColor: colors.background.primary },
    { name: 'Texto Secundario', value: colors.text.secondary, bgColor: colors.background.primary },
    { name: 'Texto Atenuado', value: colors.text.muted, bgColor: colors.background.primary },
    { name: 'Borde Principal', value: colors.border.primary, bgColor: colors.background.primary },
    { name: 'Acento Primario', value: colors.accent.primary, textColor: '#ffffff' },
    { name: 'Acento Éxito', value: colors.accent.success, textColor: '#ffffff' },
    { name: 'Acento Advertencia', value: colors.accent.warning, textColor: '#ffffff' },
    { name: 'Acento Error', value: colors.accent.error, textColor: '#ffffff' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <SwatchIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          Demo de Sistema de Temas
        </h3>
        <p className="font-sans text-gray-600 dark:text-gray-400 text-sm mb-6">
          Sistema completo de modo oscuro con transiciones suaves, persistencia de preferencias
          y detección automática del sistema.
        </p>
      </div>

      {/* Información del tema actual */}
      <div className={clsx(
        'p-4 rounded-lg border shadow-theme',
        'bg-theme-secondary border-theme'
      )}>
        <h4 className="font-medium text-theme-primary mb-3">Estado Actual del Tema</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {theme === 'light' && <SunIcon className="h-4 w-4 text-yellow-500" />}
              {theme === 'dark' && <MoonIcon className="h-4 w-4 text-blue-400" />}
              {theme === 'auto' && <ComputerDesktopIcon className="h-4 w-4 text-gray-500" />}
              <span className="font-medium text-theme-primary">Tema:</span>
            </div>
            <span className="text-theme-secondary">
              {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Automático'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-theme-primary">Efectivo:</span>
            <span className="text-theme-secondary">
              {effectiveTheme === 'dark' ? 'Oscuro' : 'Claro'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-theme-primary">Sistema:</span>
            <span className="text-theme-secondary">
              {systemPreference === 'dark' ? 'Oscuro' : 'Claro'}
            </span>
          </div>
        </div>
      </div>

      {/* Selector de demo */}
      <div className="flex space-x-1 bg-theme-tertiary p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveDemo('selector')}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeDemo === 'selector'
              ? 'bg-theme-primary text-theme-primary shadow-sm'
              : 'text-theme-secondary hover:text-theme-primary'
          )}
        >
          Selector
        </button>
        <button
          onClick={() => setActiveDemo('components')}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeDemo === 'components'
              ? 'bg-theme-primary text-theme-primary shadow-sm'
              : 'text-theme-secondary hover:text-theme-primary'
          )}
        >
          Componentes
        </button>
        <button
          onClick={() => setActiveDemo('colors')}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeDemo === 'colors'
              ? 'bg-theme-primary text-theme-primary shadow-sm'
              : 'text-theme-secondary hover:text-theme-primary'
          )}
        >
          Colores
        </button>
      </div>

      {/* Contenido del demo */}
      {activeDemo === 'selector' && (
        <div className="space-y-6">
          <div className={clsx(
            'p-6 rounded-lg border shadow-theme',
            'bg-theme-primary border-theme'
          )}>
            <h4 className="text-theme-primary font-medium mb-4 flex items-center">
              <PaintBrushIcon className="h-5 w-5 mr-2" />
              Selector de Tema Completo
            </h4>
            <ThemeSelector variant="full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={clsx(
              'p-4 rounded-lg border shadow-theme',
              'bg-theme-primary border-theme'
            )}>
              <h5 className="text-theme-primary font-medium mb-3">Selector Dropdown</h5>
              <ThemeSelector variant="dropdown" showLabel={true} />
            </div>

            <div className={clsx(
              'p-4 rounded-lg border shadow-theme',
              'bg-theme-primary border-theme'
            )}>
              <h5 className="text-theme-primary font-medium mb-3">Toggle Simple</h5>
              <ThemeSelector variant="toggle" showLabel={true} />
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'components' && (
        <div className="space-y-6">
          {demoComponents.map((demo, index) => (
            <div
              key={index}
              className={clsx(
                'p-6 rounded-lg border shadow-theme',
                'bg-theme-primary border-theme'
              )}
            >
              <h4 className="text-theme-primary font-medium mb-4">{demo.name}</h4>
              {demo.component}
            </div>
          ))}
        </div>
      )}

      {activeDemo === 'colors' && (
        <div className="space-y-6">
          <div className={clsx(
            'p-6 rounded-lg border shadow-theme',
            'bg-theme-primary border-theme'
          )}>
            <h4 className="text-theme-primary font-medium mb-4 flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              Paleta de Colores del Tema Actual
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="border border-theme rounded-lg overflow-hidden shadow-theme"
                >
                  <div
                    className="h-16 flex items-center justify-center"
                    style={{ 
                      backgroundColor: color.value,
                      color: color.textColor || color.bgColor || (isDark ? '#ffffff' : '#000000')
                    }}
                  >
                    <span className="text-xs font-mono font-medium">
                      {color.value}
                    </span>
                  </div>
                  <div className="p-3 bg-theme-secondary">
                    <h6 className="text-theme-primary text-sm font-medium">
                      {color.name}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Características implementadas */}
      <div className={clsx(
        'p-6 rounded-lg border shadow-theme',
        'bg-theme-secondary border-theme'
      )}>
        <h4 className="text-theme-primary font-medium mb-3 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2" />
          Características del Sistema de Temas:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-theme-secondary text-sm space-y-1">
            <li>✅ Modo claro, oscuro y automático</li>
            <li>✅ Detección de preferencias del sistema</li>
            <li>✅ Transiciones suaves configurables</li>
            <li>✅ Persistencia en localStorage</li>
            <li>✅ Alto contraste opcional</li>
            <li>✅ Colores semánticamente consistentes</li>
          </ul>
          <ul className="text-theme-secondary text-sm space-y-1">
            <li>✅ Meta theme-color para móviles</li>
            <li>✅ Clases CSS utilitarias</li>
            <li>✅ Hook useTheme completo</li>
            <li>✅ Hook useThemeAware para componentes</li>
            <li>✅ Selector de tema flexible</li>
            <li>✅ Compatibilidad con Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
