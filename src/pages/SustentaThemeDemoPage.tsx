import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import SustentaColorPalette from '../components/SustentaColorPalette';
import { SustentaThemeDemo } from '../components/demo/SustentaThemeDemo';
import { 
  SwatchIcon, 
  ComputerDesktopIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export const SustentaThemeDemoPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'palette' | 'demo' | 'components' | 'code'>('palette');

  const renderContent = () => {
    switch (activeView) {
      case 'palette':
        return <SustentaColorPalette />;
      case 'demo':
        return <SustentaThemeDemo />;
      case 'components':
        return <ComponentsShowcase />;
      case 'code':
        return <CodeExamples />;
      default:
        return <SustentaColorPalette />;
    }
  };

  return (
    <Layout title="SUSTENTA - Tema y Paleta de Colores">
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'palette', label: 'Paleta de Colores', icon: SwatchIcon },
                { id: 'demo', label: 'Demo Interactivo', icon: ComputerDesktopIcon },
                { id: 'components', label: 'Componentes', icon: DocumentTextIcon },
                { id: 'code', label: 'Ejemplos de Código', icon: CodeBracketIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeView === tab.id
                      ? 'border-sustenta-blue text-sustenta-blue'
                      : 'border-transparent text-gray-500 hover:text-sustenta-purple hover:border-sustenta-purple'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </Layout>
  );
};

// Componente para mostrar ejemplos de componentes
const ComponentsShowcase: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-12">
        {/* Botones */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Botones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-sustenta p-6">
              <h3 className="text-lg font-semibold mb-4">Botones Principales</h3>
              <div className="space-y-3">
                <button className="btn-sustenta-primary w-full">Botón Principal</button>
                <button className="btn-sustenta-secondary w-full">Botón Secundario</button>
                <button className="btn-sustenta-outline w-full">Botón Outline</button>
              </div>
            </div>
            
            <div className="card-sustenta p-6">
              <h3 className="text-lg font-semibold mb-4">Estados</h3>
              <div className="space-y-3">
                <button className="btn-sustenta-primary w-full" disabled>Deshabilitado</button>
                <button className="btn-sustenta-primary w-full opacity-75">Cargando...</button>
                <button className="btn-sustenta-primary w-full transform scale-95">Presionado</button>
              </div>
            </div>

            <div className="card-sustenta p-6">
              <h3 className="text-lg font-semibold mb-4">Tamaños</h3>
              <div className="space-y-3">
                <button className="btn-sustenta-primary w-full text-xs py-1 px-2">Pequeño</button>
                <button className="btn-sustenta-primary w-full">Normal</button>
                <button className="btn-sustenta-primary w-full text-lg py-4 px-6">Grande</button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarjetas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-sustenta">
              <div className="header-sustenta">
                <h3 className="text-lg font-semibold">Card con Header</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Contenido de la tarjeta con header azul.</p>
              </div>
            </div>

            <div className="card-sustenta">
              <div className="header-sustenta-gradient">
                <h3 className="text-lg font-semibold">Card con Gradiente</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Contenido de la tarjeta con header gradiente.</p>
              </div>
            </div>

            <div className="card-sustenta p-6">
              <h3 className="text-lg font-semibold text-sustenta-blue mb-3">Card Simple</h3>
              <p className="text-gray-600">Tarjeta simple sin header especial.</p>
            </div>
          </div>
        </section>

        {/* Formularios */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Formularios</h2>
          <div className="card-sustenta p-6 max-w-2xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sustenta-blue focus:border-sustenta-blue"
                  placeholder="Ingrese el nombre del curso"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sustenta-blue focus:border-sustenta-blue">
                  <option>Seguridad Industrial</option>
                  <option>Operación de Equipos</option>
                  <option>Primeros Auxilios</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sustenta-blue focus:border-sustenta-blue"
                  placeholder="Descripción del curso"
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-sustenta-primary">
                  Guardar Curso
                </button>
                <button type="button" className="btn-sustenta-outline">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

// Componente para mostrar ejemplos de código
const CodeExamples: React.FC = () => {
  const examples = [
    {
      title: 'Clases Tailwind CSS',
      code: `<!-- Botones -->
<button class="bg-sustenta-blue text-white px-4 py-2 rounded-lg hover:bg-sustenta-dark-blue">
  Botón Principal
</button>

<!-- Texto -->
<h1 class="text-sustenta-blue text-2xl font-bold">Título</h1>
<p class="text-sustenta-purple">Texto secundario</p>

<!-- Fondos -->
<div class="bg-sustenta-gray p-4 rounded-lg">
  <div class="bg-gradient-sustenta p-6 rounded-lg text-white">
    Contenido con gradiente
  </div>
</div>`
    },
    {
      title: 'Variables CSS',
      code: `:root {
  --sustenta-blue: #007fd1;
  --sustenta-purple: #443f9a;
  --sustenta-gray: #f1f2f2;
  --sustenta-light-blue: #b7ddff;
}

.custom-button {
  background-color: var(--sustenta-blue);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.custom-button:hover {
  background-color: var(--sustenta-dark-blue);
}`
    },
    {
      title: 'Componente React',
      code: `import React from 'react';

const SustentaButton = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  
  const variants = {
    primary: 'bg-sustenta-blue text-white hover:bg-sustenta-dark-blue',
    secondary: 'bg-sustenta-purple text-white hover:bg-sustenta-light-purple',
    outline: 'border-2 border-sustenta-blue text-sustenta-blue hover:bg-sustenta-blue hover:text-white'
  };

  return (
    <button 
      className={\`\${baseClasses} \${variants[variant]}\`}
      {...props}
    >
      {children}
    </button>
  );
};`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {examples.map((example, index) => (
          <div key={index} className="card-sustenta">
            <div className="header-sustenta">
              <h3 className="text-lg font-semibold">{example.title}</h3>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SustentaThemeDemoPage;
