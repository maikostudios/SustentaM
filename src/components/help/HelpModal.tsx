import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  QuestionMarkCircleIcon,
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'administrador' | 'contratista' | 'usuario' | 'otic';
}

export function HelpModal({ isOpen, onClose, userRole }: HelpModalProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const getHelpSections = (): HelpSection[] => {
    const commonSections: HelpSection[] = [
      {
        id: 'overview',
        title: 'Visión General',
        icon: BookOpenIcon,
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bienvenido al Sistema de Gestión de Cursos</h3>
            <p className="text-gray-600">
              Este sistema te permite gestionar cursos de capacitación, inscripciones, asistencia y certificados de manera eficiente.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Características principales:</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Gestión completa de cursos y participantes</li>
                <li>Calendario interactivo para programación</li>
                <li>Generación automática de certificados</li>
                <li>Reportes y análisis detallados</li>
                <li>Interfaz intuitiva y responsive</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'navigation',
        title: 'Navegación',
        icon: PlayIcon,
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cómo navegar por el sistema</h3>
            
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-2">🏠 Botón Inicio</h4>
                <p className="text-sm text-gray-600">
                  Haz clic en el botón "Inicio" en la barra superior para volver al dashboard principal.
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-2">📍 Breadcrumbs</h4>
                <p className="text-sm text-gray-600">
                  Utiliza las migas de pan para ver tu ubicación actual y navegar a secciones anteriores.
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold mb-2">📱 Menú móvil</h4>
                <p className="text-sm text-gray-600">
                  En dispositivos móviles, usa el botón de menú hamburguesa para acceder a todas las opciones.
                </p>
              </div>
            </div>
          </div>
        )
      }
    ];

    switch (userRole) {
      case 'administrador':
        return [
          ...commonSections,
          {
            id: 'courses',
            title: 'Gestión de Cursos',
            icon: BookOpenIcon,
            content: (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Administrar Cursos</h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Crear Curso</h4>
                    <ol className="list-decimal list-inside text-sm text-green-800 space-y-1">
                      <li>Haz clic en "Nuevo Curso"</li>
                      <li>Completa todos los campos requeridos</li>
                      <li>Asegúrate de que el código sea único</li>
                      <li>Guarda el curso</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-900 mb-2">📝 Editar Curso</h4>
                    <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                      <li>Busca el curso en la tabla</li>
                      <li>Haz clic en el botón "Editar"</li>
                      <li>Modifica los campos necesarios</li>
                      <li>Guarda los cambios</li>
                    </ol>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-900 mb-2">🗑️ Eliminar Curso</h4>
                    <p className="text-sm text-red-800">
                      ⚠️ <strong>Precaución:</strong> Eliminar un curso borrará todos los datos asociados (participantes, asistencia, etc.).
                    </p>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'certificates',
            title: 'Certificados',
            icon: DocumentTextIcon,
            content: (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestión de Certificados</h3>
                
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold mb-2">🎨 Plantillas</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Elige entre diferentes plantillas de certificados:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li><strong>Clásica:</strong> Diseño tradicional y formal</li>
                      <li><strong>Moderna:</strong> Estilo contemporáneo y limpio</li>
                      <li><strong>Elegante:</strong> Diseño sofisticado con colores púrpura</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold mb-2">📄 Generación Individual</h4>
                    <p className="text-sm text-gray-600">
                      Genera certificados para participantes específicos desde la tabla de asistencia.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold mb-2">📦 Generación Masiva</h4>
                    <p className="text-sm text-gray-600">
                      Genera todos los certificados de un curso en un archivo ZIP para descarga fácil.
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        ];
      
      case 'contratista':
        return [
          ...commonSections,
          {
            id: 'calendar',
            title: 'Calendario',
            icon: PlayIcon,
            content: (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Usar el Calendario</h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-900 mb-2">🗓️ Navegación</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>Usa los botones "Mes" y "Semana" para cambiar la vista</li>
                      <li>Haz clic en las fechas para navegar</li>
                      <li>Los cursos aparecen con códigos de color</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold mb-2">🎨 Códigos de Color</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        <span>Cursos Propios</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                        <span>Cursos Externos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'enrollment',
            title: 'Inscripciones',
            icon: DocumentTextIcon,
            content: (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestionar Inscripciones</h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-900 mb-2">👤 Inscripción Manual</h4>
                    <ol className="list-decimal list-inside text-sm text-green-800 space-y-1">
                      <li>Selecciona un curso del calendario</li>
                      <li>Haz clic en "Inscripción Manual"</li>
                      <li>Completa los datos del participante</li>
                      <li>Verifica que el RUT sea válido</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-900 mb-2">📊 Carga Masiva</h4>
                    <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                      <li>Prepara un archivo Excel con los datos</li>
                      <li>Usa el formato: Nombre, RUT, Contratista</li>
                      <li>Haz clic en "Carga Masiva"</li>
                      <li>Selecciona y sube tu archivo</li>
                    </ol>
                  </div>
                </div>
              </div>
            )
          }
        ];
      
      case 'usuario':
        return [
          ...commonSections,
          {
            id: 'courses',
            title: 'Mis Cursos',
            icon: BookOpenIcon,
            content: (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ver Mis Cursos</h3>
                <p className="text-gray-600">
                  En esta sección puedes ver todos los cursos en los que estás inscrito, tu progreso y estado de aprobación.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-900 mb-2">📈 Estados de Curso</h4>
                  <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                    <li><strong>Inscrito:</strong> Estás registrado pero el curso no ha comenzado</li>
                    <li><strong>En Progreso:</strong> El curso está activo</li>
                    <li><strong>Aprobado:</strong> Has completado exitosamente el curso</li>
                    <li><strong>Reprobado:</strong> No cumpliste con los requisitos mínimos</li>
                  </ul>
                </div>
              </div>
            )
          }
        ];

      case 'otic':
        return [
          ...commonSections,
          {
            id: 'certificates',
            title: 'Certificados OTIC',
            icon: DocumentTextIcon,
            content: (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestión de Certificados OTIC</h3>
                <p className="text-gray-600">
                  Como OTIC tienes acceso completo a todos los certificados del sistema para descarga y gestión.
                </p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-900 mb-2">📋 Certificados Disponibles</h4>
                  <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                    <li><strong>Certificado de Inducción:</strong> Documento oficial de inducción SSO</li>
                    <li><strong>Libro de Clases:</strong> Registro de asistencia y calificaciones</li>
                    <li><strong>Certificado Participante:</strong> Certificado individual de aprobación</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">🔍 Reportes</h4>
                  <p className="text-sm text-blue-800">
                    Accede a reportes completos con estadísticas, gráficos y análisis de rendimiento de todos los cursos y participantes.
                  </p>
                </div>
              </div>
            )
          }
        ];

      default:
        return commonSections;
    }
  };

  const sections = getHelpSections();
  const currentSection = sections.find(s => s.id === activeSection) || sections[0];
  const currentIndex = sections.findIndex(s => s.id === activeSection);

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Centro de Ayuda"
      size="lg"
    >
      <div className="flex h-96">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 pr-4">
          <nav className="space-y-1">
            {sections.map((section) => {
              const IconComponent = section.icon;
              const isActive = section.id === activeSection;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-left rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6">
          <div className="h-full overflow-y-auto">
            {currentSection.content}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
        <Button
          variant="secondary"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Anterior</span>
        </Button>
        
        <span className="text-sm text-gray-500">
          {currentIndex + 1} de {sections.length}
        </span>
        
        <Button
          variant="secondary"
          onClick={goToNext}
          disabled={currentIndex === sections.length - 1}
          className="flex items-center space-x-2"
        >
          <span>Siguiente</span>
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </Modal>
  );
}
