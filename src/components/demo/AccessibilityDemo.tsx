import React, { useState } from 'react';
import { 
  AccessibleButton, 
  AccessibleList, 
  AccessibleAccordion, 
  AccessibleAlert,
  SkipLinks,
  LandmarkRegion 
} from '../accessibility/AccessibleComponents';
import { AccessibilitySettings } from '../accessibility/AccessibilitySettings';
import { useKeyboardNavigation, useScreenReader } from '../../hooks/useAccessibility';
import {
  EyeIcon,
  SpeakerWaveIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function AccessibilityDemo() {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'components' | 'settings'>('overview');
  const [selectedListItem, setSelectedListItem] = useState<number>(-1);
  const [showAlert, setShowAlert] = useState(true);
  const { announce } = useScreenReader();

  // Datos de ejemplo para la lista accesible
  const listItems = [
    { id: 1, name: 'Elemento 1', description: 'Primera opción de la lista' },
    { id: 2, name: 'Elemento 2', description: 'Segunda opción de la lista' },
    { id: 3, name: 'Elemento 3', description: 'Tercera opción de la lista' },
    { id: 4, name: 'Elemento 4', description: 'Cuarta opción de la lista' }
  ];

  // Datos para el acordeón
  const accordionItems = [
    {
      id: 'navegacion',
      title: 'Navegación por Teclado',
      content: (
        <div className="space-y-2">
          <p>Usa las siguientes teclas para navegar:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><kbd className="px-1 py-0.5 bg-gray-200 rounded">Tab</kbd> - Siguiente elemento</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 rounded">Shift + Tab</kbd> - Elemento anterior</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 rounded">Enter</kbd> - Activar elemento</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 rounded">Espacio</kbd> - Activar botón/checkbox</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> - Cerrar modal/menú</li>
          </ul>
        </div>
      )
    },
    {
      id: 'lectores',
      title: 'Lectores de Pantalla',
      content: (
        <div className="space-y-2">
          <p>Características implementadas para lectores de pantalla:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Etiquetas ARIA apropiadas</li>
            <li>Regiones landmark definidas</li>
            <li>Anuncios de cambios de estado</li>
            <li>Descripciones de elementos interactivos</li>
            <li>Orden lógico de tabulación</li>
          </ul>
        </div>
      )
    },
    {
      id: 'contraste',
      title: 'Contraste y Colores',
      content: (
        <div className="space-y-2">
          <p>Cumplimiento de estándares WCAG:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Ratio de contraste mínimo 4.5:1 (AA)</li>
            <li>Ratio de contraste 7:1 para AAA</li>
            <li>Información no dependiente solo del color</li>
            <li>Modo alto contraste disponible</li>
          </ul>
        </div>
      )
    }
  ];

  const skipLinks = [
    { href: '#main-content', label: 'Ir al contenido principal' },
    { href: '#navigation', label: 'Ir a la navegación' },
    { href: '#accessibility-demo', label: 'Ir a la demostración' }
  ];

  const handleListSelect = (item: any, index: number) => {
    setSelectedListItem(index);
    announce(`Seleccionado: ${item.name}`, 'polite');
  };

  const handleListActivate = (item: any, index: number) => {
    announce(`Activado: ${item.name} - ${item.description}`, 'polite');
  };

  const renderListItem = (item: any, index: number, isSelected: boolean, isFocused: boolean) => (
    <div className={`p-3 border rounded-lg transition-colors ${
      isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
    } ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="font-medium text-gray-900">{item.name}</div>
      <div className="text-sm text-gray-600">{item.description}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <SkipLinks links={skipLinks} />
      
      <LandmarkRegion role="banner">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <EyeIcon className="w-6 h-6 mr-2" />
            Demo de Accesibilidad (a11y)
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Demostración completa de las mejoras de accesibilidad implementadas: 
            soporte para lectores de pantalla, navegación por teclado, contraste de colores y etiquetas ARIA.
          </p>
        </div>
      </LandmarkRegion>

      <LandmarkRegion role="navigation" ariaLabel="Navegación de demostración">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveDemo('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeDemo === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={activeDemo === 'overview'}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveDemo('components')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeDemo === 'components'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={activeDemo === 'components'}
          >
            Componentes
          </button>
          <button
            onClick={() => setActiveDemo('settings')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeDemo === 'settings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={activeDemo === 'settings'}
          >
            Configuración
          </button>
        </div>
      </LandmarkRegion>

      <LandmarkRegion role="main" ariaLabel="Contenido principal de la demostración">
        {activeDemo === 'overview' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-blue-900 font-medium mb-3">Estándares de Accesibilidad Implementados</h2>
              <p className="text-blue-800 text-sm mb-4">
                Esta aplicación cumple con los estándares WCAG 2.1 AA y incluye mejoras adicionales para una experiencia inclusiva.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <EyeIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Visual</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Contraste 4.5:1 mínimo</li>
                    <li>✓ Texto escalable</li>
                    <li>✓ Indicadores de foco visibles</li>
                    <li>✓ Modo alto contraste</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CommandLineIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Teclado</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Navegación completa</li>
                    <li>✓ Atajos de teclado</li>
                    <li>✓ Trampa de foco en modales</li>
                    <li>✓ Orden lógico de tabulación</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <SpeakerWaveIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Lectores</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Etiquetas ARIA</li>
                    <li>✓ Regiones landmark</li>
                    <li>✓ Anuncios de estado</li>
                    <li>✓ Descripciones alternativas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prueba rápida de accesibilidad */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prueba Rápida de Accesibilidad</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Navegación por Teclado</p>
                    <p className="text-sm text-gray-600">Usa Tab para navegar entre elementos. Todos los controles son accesibles.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Lector de Pantalla</p>
                    <p className="text-sm text-gray-600">Activa tu lector de pantalla para escuchar las descripciones y anuncios.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Zoom del Navegador</p>
                    <p className="text-sm text-gray-600">Aumenta el zoom hasta 200% - la interfaz se mantiene funcional.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'components' && (
          <div className="space-y-6">
            {/* Alertas accesibles */}
            {showAlert && (
              <AccessibleAlert
                type="info"
                title="Alerta de Demostración"
                dismissible
                onDismiss={() => setShowAlert(false)}
              >
                Esta es una alerta accesible con soporte completo para lectores de pantalla.
                Incluye anuncios automáticos y navegación por teclado.
              </AccessibleAlert>
            )}

            {/* Botones accesibles */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Botones Accesibles</h3>
              <div className="flex flex-wrap gap-3">
                <AccessibleButton
                  variant="primary"
                  ariaLabel="Botón primario de ejemplo"
                  announceOnClick="Botón primario activado"
                >
                  Primario
                </AccessibleButton>
                
                <AccessibleButton
                  variant="secondary"
                  icon={CheckCircleIcon}
                  iconPosition="left"
                  ariaLabel="Botón secundario con icono"
                  announceOnClick="Botón secundario con icono activado"
                >
                  Con Icono
                </AccessibleButton>
                
                <AccessibleButton
                  variant="danger"
                  ariaLabel="Botón de peligro"
                  announceOnClick="Acción peligrosa confirmada"
                >
                  Peligro
                </AccessibleButton>
                
                <AccessibleButton
                  variant="ghost"
                  loading
                  ariaLabel="Botón en estado de carga"
                >
                  Cargando...
                </AccessibleButton>
              </div>
            </div>

            {/* Lista accesible */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista Accesible con Navegación por Teclado</h3>
              <p className="text-sm text-gray-600 mb-4">
                Usa las flechas ↑↓ para navegar, Enter para activar, Espacio para seleccionar.
              </p>
              <AccessibleList
                items={listItems}
                renderItem={renderListItem}
                onSelect={handleListSelect}
                onActivate={handleListActivate}
                selectedIndex={selectedListItem}
                ariaLabel="Lista de elementos de demostración"
                className="space-y-2"
              />
            </div>

            {/* Acordeón accesible */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acordeón Accesible</h3>
              <AccessibleAccordion
                items={accordionItems}
                allowMultiple={true}
                defaultExpanded={['navegacion']}
              />
            </div>
          </div>
        )}

        {activeDemo === 'settings' && (
          <AccessibilitySettings />
        )}
      </LandmarkRegion>

      {/* Resumen de características */}
      <LandmarkRegion role="complementary" ariaLabel="Información adicional">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 font-medium mb-3 flex items-center">
            <EyeIcon className="w-5 h-5 mr-2" />
            Características de Accesibilidad Implementadas:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-gray-700 text-sm space-y-1">
              <li>✅ Etiquetas ARIA completas</li>
              <li>✅ Regiones landmark definidas</li>
              <li>✅ Navegación por teclado completa</li>
              <li>✅ Trampa de foco en modales</li>
              <li>✅ Skip links para navegación rápida</li>
              <li>✅ Indicadores de foco visibles</li>
            </ul>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>✅ Anuncios para lectores de pantalla</li>
              <li>✅ Contraste de colores WCAG AA</li>
              <li>✅ Texto escalable hasta 200%</li>
              <li>✅ Modo alto contraste</li>
              <li>✅ Reducción de movimiento</li>
              <li>✅ Configuración personalizable</li>
            </ul>
          </div>
        </div>
      </LandmarkRegion>
    </div>
  );
}
