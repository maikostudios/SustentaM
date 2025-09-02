import React from 'react';

interface ColorInfo {
  name: string;
  value: string;
  class: string;
  description: string;
}

const SustentaColorPalette: React.FC = () => {
  const colors: ColorInfo[] = [
    {
      name: 'Azul Principal',
      value: '#007fd1',
      class: 'bg-sustenta-blue',
      description: 'Color principal de la marca SUSTENTA'
    },
    {
      name: 'Morado Corporativo',
      value: '#443f9a',
      class: 'bg-sustenta-purple',
      description: 'Color secundario corporativo'
    },
    {
      name: 'Gris Claro',
      value: '#f1f2f2',
      class: 'bg-sustenta-gray',
      description: 'Color de fondo neutro'
    },
    {
      name: 'Azul Claro',
      value: '#b7ddff',
      class: 'bg-sustenta-light-blue',
      description: 'Azul suave para acentos'
    },
    {
      name: 'Azul Oscuro',
      value: '#005a9c',
      class: 'bg-sustenta-dark-blue',
      description: 'Azul oscuro derivado'
    },
    {
      name: 'Morado Claro',
      value: '#6b5bb3',
      class: 'bg-sustenta-light-purple',
      description: 'Morado claro derivado'
    }
  ];

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="header-sustenta-gradient mb-8 text-center">
          <div className="hexagon-sustenta mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold mb-2">SUSTENTA</h1>
          <p className="text-xl opacity-90">CAPACITACIÓN Y ENTRENAMIENTO</p>
          <p className="mt-4 text-lg opacity-80">Paleta de Colores Oficial</p>
        </div>

        {/* Paleta de Colores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {colors.map((color, index) => (
            <div key={index} className="card-sustenta p-6">
              <div 
                className={`${color.class} w-full h-24 rounded-lg mb-4 cursor-pointer transition-transform hover:scale-105`}
                onClick={() => copyToClipboard(color.value)}
                title="Click para copiar"
              ></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {color.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {color.description}
              </p>
              <code 
                className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => copyToClipboard(color.value)}
                title="Click para copiar"
              >
                {color.value}
              </code>
            </div>
          ))}
        </div>

        {/* Ejemplos de Botones */}
        <div className="card-sustenta p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Ejemplos de Botones
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-sustenta-primary">
              Botón Principal
            </button>
            <button className="btn-sustenta-secondary">
              Botón Secundario
            </button>
            <button className="btn-sustenta-outline">
              Botón Outline
            </button>
          </div>
        </div>

        {/* Gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-sustenta p-8 rounded-xl text-white text-center">
            <h3 className="text-xl font-bold mb-2">Gradiente Principal</h3>
            <p className="opacity-90">Azul → Morado</p>
          </div>
          <div className="bg-gradient-sustenta-light p-8 rounded-xl text-white text-center">
            <h3 className="text-xl font-bold mb-2">Gradiente Suave</h3>
            <p className="opacity-90">Azul Claro → Morado Claro</p>
          </div>
        </div>

        {/* Información de Uso */}
        <div className="card-sustenta p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Cómo Usar los Colores SUSTENTA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-sustenta-blue mb-3">
                Clases Tailwind
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><code>bg-sustenta-blue</code> - Fondo azul principal</li>
                <li><code>bg-sustenta-purple</code> - Fondo morado</li>
                <li><code>text-sustenta-blue</code> - Texto azul</li>
                <li><code>border-sustenta-blue</code> - Borde azul</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sustenta-purple mb-3">
                Variables CSS
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><code>var(--sustenta-blue)</code> - Azul principal</li>
                <li><code>var(--sustenta-purple)</code> - Morado corporativo</li>
                <li><code>var(--color-primary)</code> - Color primario del tema</li>
                <li><code>var(--color-secondary)</code> - Color secundario del tema</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>© 2024 SUSTENTA - Capacitación y Entrenamiento</p>
          <p className="text-sm mt-2">Paleta de colores basada en la identidad visual corporativa</p>
        </div>
      </div>
    </div>
  );
};

export default SustentaColorPalette;
