import React, { useState, useEffect } from 'react';
import { useAccessibilityPreferences, useColorContrast, useScreenReader } from '../../hooks/useAccessibility';
import { AccessibleButton, AccessibleAlert } from './AccessibleComponents';
import {
  EyeIcon,
  SpeakerWaveIcon,
  CommandLineIcon,
  AdjustmentsHorizontalIcon,
  PaintBrushIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  fontSize: 'normal' | 'large' | 'extra-large';
}

export function AccessibilitySettings() {
  const [config, setConfig] = useState<AccessibilityConfig>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorScheme: 'auto',
    fontSize: 'normal'
  });

  const [showPreview, setShowPreview] = useState(false);
  const preferences = useAccessibilityPreferences();
  const { checkContrast } = useColorContrast();
  const { announce } = useScreenReader();

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('accessibility-config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading accessibility config:', error);
      }
    }
  }, []);

  // Aplicar configuración al DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar esquema de colores
    if (config.colorScheme === 'dark') {
      root.classList.add('dark');
    } else if (config.colorScheme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto - usar preferencia del sistema
      if (preferences.prefersColorScheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Aplicar alto contraste
    if (config.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Aplicar texto grande
    if (config.largeText || config.fontSize !== 'normal') {
      root.classList.add(`font-size-${config.fontSize}`);
    } else {
      root.classList.remove('font-size-large', 'font-size-extra-large');
    }

    // Aplicar movimiento reducido
    if (config.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Aplicar indicadores de foco mejorados
    if (config.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Guardar configuración
    localStorage.setItem('accessibility-config', JSON.stringify(config));
  }, [config, preferences]);

  const updateConfig = (key: keyof AccessibilityConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    announce(`${key} ${value ? 'activado' : 'desactivado'}`, 'polite');
  };

  const resetToDefaults = () => {
    const defaultConfig: AccessibilityConfig = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderMode: false,
      keyboardNavigation: true,
      focusIndicators: true,
      colorScheme: 'auto',
      fontSize: 'normal'
    };
    setConfig(defaultConfig);
    announce('Configuración de accesibilidad restablecida', 'polite');
  };

  const contrastExample = checkContrast('#1f2937', '#ffffff');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración de Accesibilidad
        </h2>
        <p className="text-gray-600">
          Personaliza la experiencia de la aplicación según tus necesidades de accesibilidad.
        </p>
      </div>

      {/* Configuración Visual */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <EyeIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración Visual</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Alto Contraste</label>
              <p className="text-xs text-gray-500">Aumenta el contraste para mejor visibilidad</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.highContrast}
              onClick={() => updateConfig('highContrast', !config.highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.highContrast ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Esquema de Colores</label>
              <p className="text-xs text-gray-500">Selecciona el tema de colores</p>
            </div>
            <select
              value={config.colorScheme}
              onChange={(e) => updateConfig('colorScheme', e.target.value)}
              className="block w-32 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Automático</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Tamaño de Fuente</label>
              <p className="text-xs text-gray-500">Ajusta el tamaño del texto</p>
            </div>
            <select
              value={config.fontSize}
              onChange={(e) => updateConfig('fontSize', e.target.value)}
              className="block w-32 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="large">Grande</option>
              <option value="extra-large">Extra Grande</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configuración de Movimiento */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Movimiento</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Movimiento Reducido</label>
              <p className="text-xs text-gray-500">Reduce animaciones y transiciones</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.reducedMotion}
              onClick={() => updateConfig('reducedMotion', !config.reducedMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Configuración de Navegación */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <CommandLineIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Navegación</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Navegación por Teclado</label>
              <p className="text-xs text-gray-500">Habilita navegación completa por teclado</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.keyboardNavigation}
              onClick={() => updateConfig('keyboardNavigation', !config.keyboardNavigation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Indicadores de Foco Mejorados</label>
              <p className="text-xs text-gray-500">Mejora la visibilidad del foco del teclado</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.focusIndicators}
              onClick={() => updateConfig('focusIndicators', !config.focusIndicators)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.focusIndicators ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.focusIndicators ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Configuración de Lector de Pantalla */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <SpeakerWaveIcon className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Lector de Pantalla</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Modo Lector de Pantalla</label>
              <p className="text-xs text-gray-500">Optimiza la experiencia para lectores de pantalla</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.screenReaderMode}
              onClick={() => updateConfig('screenReaderMode', !config.screenReaderMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.screenReaderMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias del Sistema Detectadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Movimiento Reducido:</span>
            <span className={`ml-2 ${preferences.prefersReducedMotion ? 'text-green-600' : 'text-gray-500'}`}>
              {preferences.prefersReducedMotion ? 'Activado' : 'Desactivado'}
            </span>
          </div>
          <div>
            <span className="font-medium">Alto Contraste:</span>
            <span className={`ml-2 ${preferences.prefersHighContrast ? 'text-green-600' : 'text-gray-500'}`}>
              {preferences.prefersHighContrast ? 'Activado' : 'Desactivado'}
            </span>
          </div>
          <div>
            <span className="font-medium">Esquema de Color:</span>
            <span className="ml-2 text-gray-700">{preferences.prefersColorScheme}</span>
          </div>
          <div>
            <span className="font-medium">Contraste de Ejemplo:</span>
            <span className={`ml-2 ${contrastExample.passesAA ? 'text-green-600' : 'text-red-600'}`}>
              {contrastExample.level} (Ratio: {contrastExample.ratio.toFixed(2)})
            </span>
          </div>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
          <AccessibleButton
            onClick={() => setShowPreview(!showPreview)}
            variant="secondary"
            ariaLabel={showPreview ? 'Ocultar vista previa' : 'Mostrar vista previa'}
          >
            {showPreview ? 'Ocultar' : 'Mostrar'} Vista Previa
          </AccessibleButton>
        </div>

        {showPreview && (
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <AccessibleAlert type="info" title="Información">
              Esta es una alerta de información para probar la accesibilidad.
            </AccessibleAlert>
            
            <div className="flex space-x-2">
              <AccessibleButton variant="primary">Botón Primario</AccessibleButton>
              <AccessibleButton variant="secondary">Botón Secundario</AccessibleButton>
              <AccessibleButton variant="danger">Botón Peligro</AccessibleButton>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campo de Ejemplo
              </label>
              <input
                type="text"
                placeholder="Escribe algo aquí..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-between">
        <AccessibleButton
          onClick={resetToDefaults}
          variant="secondary"
          ariaLabel="Restablecer configuración a valores por defecto"
        >
          Restablecer
        </AccessibleButton>
        
        <AccessibleButton
          onClick={() => announce('Configuración guardada correctamente', 'polite')}
          variant="primary"
          ariaLabel="Guardar configuración de accesibilidad"
        >
          Guardar Configuración
        </AccessibleButton>
      </div>
    </div>
  );
}
