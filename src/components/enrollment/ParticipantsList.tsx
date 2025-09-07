import React from 'react';
import { Participant } from '../../types';
import { Button } from '../ui/Button';
import { UserPlusIcon, DocumentArrowUpIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';

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
  const theme = useThemeAware();

  return (
    <div className={`${theme.bg} rounded-lg shadow-sm border ${theme.border} p-6 h-full`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UsersIcon className={`w-6 h-6 ${theme.textSecondary}`} />
          <h3 className={`text-lg font-semibold ${theme.text}`}>
            Participantes Inscritos
          </h3>
        </div>
        <div className={`text-sm ${theme.textSecondary} ${theme.bgSecondary} px-3 py-1 rounded-full`}>
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
      <div className={`border-t ${theme.border} pt-4`}>
        {participants.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-3 ${theme.bgSecondary} rounded-lg hover:${theme.bgHover} transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-medium ${theme.text}`}>{participant.nombre}</p>
                    <p className={`text-sm ${theme.textSecondary}`}>{participant.rut}</p>
                  </div>
                </div>
                <div className={`text-xs ${theme.textMuted}`}>
                  Butaca {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UsersIcon className={`w-12 h-12 ${theme.textMuted} mx-auto mb-4`} />
            <p className={`${theme.textMuted} text-lg font-medium mb-2`}>No hay participantes inscritos</p>
            <p className={`${theme.textMuted} text-sm`}>
              Utiliza los botones de arriba para agregar participantes
            </p>
          </div>
        )}
      </div>

      {/* Status Footer */}
      {participants.length > 0 && (
        <div className={`border-t ${theme.border} mt-4 pt-4`}>
          <div className="flex justify-between text-sm">
            <span className={theme.textSecondary}>Disponibles:</span>
            <span className={`font-medium ${availableSeats > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {availableSeats} butacas
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
