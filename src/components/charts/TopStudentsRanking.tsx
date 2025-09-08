import React, { useMemo } from 'react';
import { TrophyIcon, StarIcon, AcademicCapIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/outline';

interface Student {
  nombre: string;
  curso: string;
  asistencia: number;
  promedio: number;
  puntuacionTotal: number;
  contractor: string;
}

interface TopStudentsRankingProps {
  data: Student[];
}

export function TopStudentsRanking({ data }: TopStudentsRankingProps) {
  const memoizedData = useMemo(() => data, [data]);

  const getRankIcon = useMemo(() => (position: number) => {
    switch (position) {
      case 1:
        return <TrophyIcon className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <TrophyIcon className="w-6 h-6 text-gray-400" />;
      case 3:
        return <TrophyIcon className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">{position}</div>;
    }
  }, []);

  const getRankBadgeColor = useMemo(() => (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }, []);

  const getPerformanceColor = useMemo(() => (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
        <h3 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
          Ranking de Mejores Estudiantes
        </h3>
      </div>

      <div className="space-y-4">
        {memoizedData.map((student, index) => {
          const position = index + 1;
          return (
            <div
              key={index}
              className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
                position <= 3 ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              {/* Posición y medalla */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(position)}`}>
                    {position <= 3 ? getRankIcon(position) : <span className="font-sans font-bold">#{position}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-sans font-semibold text-gray-900 dark:text-gray-100">{student.nombre}</h4>
                      {position === 1 && <StarIcon className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <p className="font-sans text-sm text-gray-600 dark:text-gray-400 mt-1">{student.curso}</p>
                    <p className="font-sans text-xs text-gray-500 dark:text-gray-500">{student.contractor}</p>
                  </div>
                </div>

                {/* Puntuación total */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(student.puntuacionTotal)}`}>
                  {student.puntuacionTotal.toFixed(1)} pts
                </div>
              </div>
              
              {/* Métricas detalladas */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="font-sans text-xs text-gray-500 dark:text-gray-400">Promedio</span>
                    <p className="font-sans font-medium text-gray-900 dark:text-gray-100">{student.promedio.toFixed(1)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-green-500" />
                  <div>
                    <span className="font-sans text-xs text-gray-500 dark:text-gray-400">Asistencia</span>
                    <p className="font-sans font-medium text-gray-900 dark:text-gray-100">{student.asistencia}%</p>
                  </div>
                </div>
              </div>

              {/* Barra de progreso combinada */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span className="font-sans">Rendimiento General</span>
                  <span className="font-sans">{student.puntuacionTotal.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      student.puntuacionTotal >= 90 ? 'bg-green-500' :
                      student.puntuacionTotal >= 80 ? 'bg-blue-500' :
                      student.puntuacionTotal >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(student.puntuacionTotal, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Nota explicativa */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Puntuación:</strong> Calculada como promedio ponderado de nota (60%) y asistencia (40%)
        </p>
      </div>
    </div>
  );
}
