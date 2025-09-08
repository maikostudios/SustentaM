import React from 'react';

interface SimpleGradeChartProps {
  data: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = {
  'Excelente (6.0-7.0)': '#10B981',
  'Bueno (5.0-5.9)': '#3B82F6',
  'Regular (4.0-4.9)': '#F59E0B',
  'Insuficiente (1.0-3.9)': '#EF4444'
};

export function SimpleGradeChart({ data }: SimpleGradeChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
      <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Distribución de Notas
      </h3>

      {/* Gráfico de barras horizontal simple */}
      <div className="space-y-4 mb-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm font-medium text-gray-900 dark:text-gray-100">{item.range}</span>
              <span className="font-sans text-sm text-gray-600 dark:text-gray-400">{item.count} ({item.percentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: COLORS[item.range as keyof typeof COLORS]
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen con iconos */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[item.range as keyof typeof COLORS] }}
            ></div>
            <span className="font-sans text-gray-600 dark:text-gray-400">
              {item.range}: <span className="font-medium">{item.count}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Estadísticas adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total Estudiantes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.slice(0, 2).reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-xs text-gray-500">Aprobados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {((data.slice(0, 2).reduce((sum, item) => sum + item.count, 0) / total) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Tasa Éxito</div>
          </div>
        </div>
      </div>
    </div>
  );
}
