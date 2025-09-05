import React, { useState, useEffect } from 'react';
import { Session, Participant } from '../../types';
import { Button } from '../ui/Button';
import { SeatIcon } from '../ui/SeatIcon';
import { UserPlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface SeatMapProps {
  session: Session;
  participants: Participant[];
  onManualEnrollment?: () => void;
  onBulkUpload?: () => void;
  showActions?: boolean;
}

export function SeatMap({ session, participants, onManualEnrollment, onBulkUpload, showActions = false }: SeatMapProps) {
  // Validaciones robustas
  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>No se pudo cargar la información de la sesión</p>
        </div>
      </div>
    );
  }

  // Asegurar que todos los valores sean seguros
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const safeCapacity = typeof session.capacity === 'number' && session.capacity > 0 ? session.capacity : 30;
  const occupiedSeats = safeParticipants.length;
  const availableSeats = safeCapacity - occupiedSeats;
  const occupancyPercentage = safeCapacity > 0 ? (occupiedSeats / safeCapacity) * 100 : 0;

  // Funciones de callback seguras
  const safeOnManualEnrollment = typeof onManualEnrollment === 'function' ? onManualEnrollment : () => {};
  const safeOnBulkUpload = typeof onBulkUpload === 'function' ? onBulkUpload : () => {};

  const renderSeats = () => {
    if (safeCapacity <= 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <p>No hay información de capacidad disponible</p>
        </div>
      );
    }

    const seatsPerRow = safeCapacity === 200 ? 10 : 6; // Teams (10x20) vs Presencial (6x5)
    const rows = Math.ceil(safeCapacity / seatsPerRow);
    const seatElements = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatNumber = row * seatsPerRow + seat + 1;
        if (seatNumber > safeCapacity) break;

        const isOccupied = seatNumber <= occupiedSeats;
        
        rowSeats.push(
          <SeatIcon
            key={seatNumber}
            number={seatNumber}
            status={isOccupied ? 'occupied' : 'available'}
            size={safeCapacity > 100 ? 'sm' : 'md'}
            onClick={isOccupied ? undefined : safeOnManualEnrollment}
            disabled={isOccupied}
            showNumber={true}
            className="m-1"
          />
        );
      }
      
      seatElements.push(
        <div
          key={row}
          className={`flex justify-center ${
            safeCapacity > 100 ? 'space-x-2 mb-1' : 'space-x-2 mb-2'
          }`}
        >
          {rowSeats}
        </div>
      );
    }

    return seatElements;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mapa de Butacas
        </h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="text-2xl font-bold text-gray-900">{safeCapacity}</div>
              <SeatIcon status="total" size="sm" showNumber={false} />
            </div>
            <div className="text-xs text-gray-700 font-medium">Total</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="text-2xl font-bold text-red-600">{occupiedSeats}</div>
              <SeatIcon status="occupied" size="sm" showNumber={false} />
            </div>
            <div className="text-xs text-gray-700 font-medium">Ocupados</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="text-2xl font-bold text-green-600">{availableSeats}</div>
              <SeatIcon status="available" size="sm" showNumber={false} />
            </div>
            <div className="text-xs text-gray-700 font-medium">Disponibles</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-800 font-medium mb-2">
            <span>Ocupación</span>
            <span>{occupancyPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                occupancyPercentage > 90 ? 'bg-red-500' :
                occupancyPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={safeOnManualEnrollment}
            disabled={availableSeats === 0}
            className="flex items-center space-x-2"
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Inscripción Manual</span>
          </Button>

          <Button
            variant="secondary"
            onClick={safeOnBulkUpload}
            disabled={availableSeats === 0}
            className="flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            <span>Carga Masiva (Excel)</span>
          </Button>
        </div>
      )}

      <div className="border-t pt-6">
        <div className="flex items-center justify-center space-x-4 text-sm mb-4">
          <div className="flex items-center space-x-1">
            <SeatIcon status="available" size="sm" showNumber={false} />
            <span className="text-gray-700 text-xs">Disponible</span>
          </div>
          <div className="flex items-center space-x-1">
            <SeatIcon status="occupied" size="sm" showNumber={false} />
            <span className="text-gray-700 text-xs">Ocupado</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div
            className={`flex flex-col items-center ${
              safeCapacity > 100
                ? 'space-y-1'
                : 'space-y-2'
            }`}
          >
            {renderSeats()}
          </div>
        </div>
      </div>
    </div>
  );
}