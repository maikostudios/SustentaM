import React, { useState, useEffect } from 'react';
import { Session, Participant } from '../../types';
import { Button } from '../ui/Button';
import { SeatIcon } from '../ui/SeatIcon';
import { UserPlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface SeatMapProps {
  session: Session;
  participants: Participant[];
  onManualEnrollment: () => void;
  onBulkUpload: () => void;
}

export function SeatMap({ session, participants, onManualEnrollment, onBulkUpload }: SeatMapProps) {
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

    const seatsPerRow = safeCapacity === 200 ? 20 : 6; // Teams vs Presencial
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
            className="m-1"
          />
        );
      }
      
      seatElements.push(
        <div key={row} className="flex justify-center">
          {rowSeats}
        </div>
      );
    }

    return seatElements;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gestión de Butacas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{safeCapacity}</div>
                <div className="text-sm text-gray-600">Capacidad Total</div>
              </div>
              <SeatIcon number={safeCapacity} status="total" size="sm" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{occupiedSeats}</div>
                <div className="text-sm text-gray-600">Ocupados</div>
              </div>
              <SeatIcon number={occupiedSeats} status="occupied" size="sm" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{availableSeats}</div>
                <div className="text-sm text-gray-600">Disponibles</div>
              </div>
              <SeatIcon number={availableSeats} status="available" size="sm" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
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

      <div className="border-t pt-6">
        <div className="flex items-center justify-center space-x-6 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <SeatIcon number={1} status="available" size="sm" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <SeatIcon number={1} status="occupied" size="sm" />
            <span>Ocupado</span>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {renderSeats()}
        </div>
      </div>
    </div>
  );
}