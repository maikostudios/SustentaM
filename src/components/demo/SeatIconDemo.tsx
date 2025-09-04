import React, { useState } from 'react';
import { SeatIcon } from '../ui/SeatIcon';

export function SeatIconDemo() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeat(seatNumber);
    console.log(`Butaca ${seatNumber} seleccionada`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Demostración de Iconos de Butacas SVG
        </h2>
        <p className="text-gray-600 mb-6">
          Nuevos iconos SVG profesionales que reemplazan los círculos simples. 
          Soportan diferentes estados, tamaños y números dinámicos.
        </p>
      </div>

      {/* Estados de butacas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados de Butacas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <SeatIcon number={1} status="available" size="lg" />
            <p className="mt-2 text-sm font-medium text-green-600">Disponible</p>
            <p className="text-xs text-gray-500">Color verde - Clickeable</p>
          </div>
          <div className="text-center">
            <SeatIcon number={2} status="occupied" size="lg" />
            <p className="mt-2 text-sm font-medium text-red-600">Ocupada</p>
            <p className="text-xs text-gray-500">Color rojo - No clickeable</p>
          </div>
          <div className="text-center">
            <SeatIcon number={30} status="total" size="lg" />
            <p className="mt-2 text-sm font-medium text-gray-900">Capacidad Total</p>
            <p className="text-xs text-gray-500">Color negro - Informativo</p>
          </div>
        </div>
      </div>

      {/* Tamaños */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tamaños Disponibles</h3>
        <div className="flex items-end justify-center space-x-8">
          <div className="text-center">
            <SeatIcon number={5} status="available" size="sm" />
            <p className="mt-2 text-sm text-gray-600">Pequeño (32px)</p>
            <p className="text-xs text-gray-500">Para cursos online (200 butacas)</p>
          </div>
          <div className="text-center">
            <SeatIcon number={15} status="available" size="md" />
            <p className="mt-2 text-sm text-gray-600">Mediano (40px)</p>
            <p className="text-xs text-gray-500">Para cursos presenciales (30 butacas)</p>
          </div>
          <div className="text-center">
            <SeatIcon number={25} status="available" size="lg" />
            <p className="mt-2 text-sm text-gray-600">Grande (48px)</p>
            <p className="text-xs text-gray-500">Para demostraciones y estadísticas</p>
          </div>
        </div>
      </div>

      {/* Interactividad */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactividad</h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            Haz clic en las butacas disponibles para seleccionarlas:
          </p>
          <div className="flex justify-center space-x-4">
            {[10, 11, 12, 13, 14].map(num => (
              <SeatIcon
                key={num}
                number={num}
                status="available"
                size="md"
                onClick={() => handleSeatClick(num)}
                className={selectedSeat === num ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              />
            ))}
          </div>
          {selectedSeat && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                ¡Butaca {selectedSeat} seleccionada!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simulación de aula presencial */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Simulación: Aula Presencial (30 butacas)
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, row) => (
              <div key={row} className="flex justify-center space-x-2">
                {Array.from({ length: 6 }, (_, seat) => {
                  const seatNumber = row * 6 + seat + 1;
                  const isOccupied = seatNumber <= 18; // Simular 18 ocupadas
                  return (
                    <SeatIcon
                      key={seatNumber}
                      number={seatNumber}
                      status={isOccupied ? 'occupied' : 'available'}
                      size="md"
                      onClick={!isOccupied ? () => handleSeatClick(seatNumber) : undefined}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            18 ocupadas, 12 disponibles
          </div>
        </div>
      </div>

      {/* Simulación de curso online */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Simulación: Curso Online (200 butacas)
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {Array.from({ length: 10 }, (_, row) => (
              <div key={row} className="flex justify-center space-x-1">
                {Array.from({ length: 20 }, (_, seat) => {
                  const seatNumber = row * 20 + seat + 1;
                  const isOccupied = seatNumber <= 150; // Simular 150 ocupadas
                  return (
                    <SeatIcon
                      key={seatNumber}
                      number={seatNumber}
                      status={isOccupied ? 'occupied' : 'available'}
                      size="sm"
                      onClick={!isOccupied ? () => handleSeatClick(seatNumber) : undefined}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            150 ocupadas, 50 disponibles
          </div>
        </div>
      </div>

      {/* Características técnicas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Características Técnicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">✨ Características</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Iconos SVG vectoriales escalables</li>
              <li>• Números dinámicos (1-999+)</li>
              <li>• 3 estados: disponible, ocupada, total</li>
              <li>• 3 tamaños: pequeño, mediano, grande</li>
              <li>• Totalmente accesible (ARIA labels)</li>
              <li>• Soporte para teclado (Enter/Space)</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🎨 Colores SUSTENTA</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Verde: #00bf63 (disponible)</li>
              <li>• Rojo: #ff3131 (ocupada)</li>
              <li>• Negro: #000000 (total/capacidad)</li>
              <li>• Hover y focus states incluidos</li>
              <li>• Transiciones suaves</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
