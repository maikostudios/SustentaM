import React from 'react';
import { Participant } from '../../types';
import { Button } from '../ui/Button';
import { UserPlusIcon, DocumentArrowUpIcon, UsersIcon } from '@heroicons/react/24/outline';

interface ParticipantsListProps {
  participants: Participant[];
  capacity: number;
  onManualEnrollment: () => void;
  onBulkUpload: () => void;
}

export function ParticipantsList({ 
  participants, 
  capacity, 
  onManualEnrollment, 
  onBulkUpload 
}: ParticipantsListProps) {
  const availableSeats = capacity - participants.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UsersIcon className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Participantes Inscritos
          </h3>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {participants.length} / {capacity}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={onManualEnrollment}
          disabled={availableSeats === 0}
          className="flex items-center justify-center space-x-2 flex-1"
        >
          <UserPlusIcon className="w-4 h-4" />
          <span>Inscripción Manual</span>
        </Button>

        <Button
          variant="secondary"
          onClick={onBulkUpload}
          disabled={availableSeats === 0}
          className="flex items-center justify-center space-x-2 flex-1"
        >
          <DocumentArrowUpIcon className="w-4 h-4" />
          <span>Carga Masiva</span>
        </Button>
      </div>

      {/* Participants List */}
      <div className="border-t pt-4">
        {participants.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {participants.map((participant, index) => (
              <div 
                key={participant.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{participant.nombre}</p>
                    <p className="text-sm text-gray-600">{participant.rut}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Butaca {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">No hay participantes inscritos</p>
            <p className="text-gray-400 text-sm">
              Utiliza los botones de arriba para agregar participantes
            </p>
          </div>
        )}
      </div>

      {/* Status Footer */}
      {participants.length > 0 && (
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Disponibles:</span>
            <span className={`font-medium ${availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {availableSeats} butacas
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
