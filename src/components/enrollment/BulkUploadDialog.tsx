import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { validarRUT } from '../../lib/validations';
import { EnrollmentData } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DocumentArrowUpIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';

// Datos hardcodeados para simulación de validación nombre-RUT
const VALID_NAME_RUT_COMBINATIONS = [
  { nombre: 'Juan Carlos Pérez González', rut: '12.345.678-5' },
  { nombre: 'María Elena Rodríguez Silva', rut: '98.765.432-1' },
  { nombre: 'Carlos Alberto Muñoz Torres', rut: '15.678.234-9' },
  { nombre: 'Ana Patricia López Herrera', rut: '22.456.789-3' },
  { nombre: 'Roberto Francisco Díaz Morales', rut: '18.234.567-8' },
  { nombre: 'Carmen Rosa Vega Sánchez', rut: '11.222.333-4' },
  { nombre: 'Luis Fernando Castro Jiménez', rut: '33.444.555-6' },
  { nombre: 'Patricia Isabel Moreno Ruiz', rut: '44.555.666-7' }
];

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (participants: EnrollmentData[]) => void;
  capacity: number;
  currentOccupancy: number;
}

export function BulkUploadDialog({
  isOpen,
  onClose,
  onUpload,
  capacity,
  currentOccupancy
}: BulkUploadDialogProps) {
  const theme = useThemeAware();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newParticipants, setNewParticipants] = useState<EnrollmentData[]>([]);
  const [capacityDetails, setCapacityDetails] = useState<{
    totalCapacity: number;
    currentOccupancy: number;
    available: number;
    attemptingToAdd: number;
    wouldExceed: number;
  } | null>(null);

  const validateNameRutCombination = (nombre: string, rut: string): boolean => {
    // Normalizar nombre para comparación (sin tildes, minúsculas, espacios múltiples)
    const normalizeString = (str: string) =>
      str.toLowerCase()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .replace(/\s+/g, ' ')
         .trim();

    const normalizedInputName = normalizeString(nombre);

    return VALID_NAME_RUT_COMBINATIONS.some(combination => {
      const normalizedValidName = normalizeString(combination.nombre);
      return normalizedValidName === normalizedInputName && combination.rut === rut;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);
    setLoading(true);

    // Simular procesamiento de archivo
    setTimeout(() => {
      // Datos simulados de 5 participantes
      const simulatedData = [
        {
          rowNumber: 2,
          nombre: 'Carlos Mendoza Silva',
          rut: '12.345.678-9',
          contractor: 'Constructora ABC Ltda.',
          valid: true,
          errors: []
        },
        {
          rowNumber: 3,
          nombre: 'María González Torres',
          rut: '98.765.432-1',
          contractor: 'Servicios Integrales DEF',
          valid: true,
          errors: []
        },
        {
          rowNumber: 4,
          nombre: 'Roberto Fernández López',
          rut: '11.222.333-4',
          contractor: 'Tech Solutions SpA',
          valid: true,
          errors: []
        },
        {
          rowNumber: 5,
          nombre: 'Ana Patricia Morales',
          rut: '55.666.777-8',
          contractor: 'Empresa XYZ S.A.',
          valid: true,
          errors: []
        },
        {
          rowNumber: 6,
          nombre: 'Diego Herrera Castro',
          rut: '44.555.666-7',
          contractor: 'Constructora ABC Ltda.',
          valid: true,
          errors: []
        }
      ];

      setPreview(simulatedData);
      setLoading(false);
    }, 2000);
  };

  const handleImport = () => {
    const validationErrors: string[] = [];
    const validParticipants: EnrollmentData[] = [];

    // Usar los datos ya validados del preview
    const validItems = preview.filter(item => item.valid);
    const invalidItems = preview.filter(item => !item.valid);

    // Agregar errores de validación
    invalidItems.forEach(item => {
      validationErrors.push(`Fila ${item.rowNumber}: ${item.errors.join(', ')}`);
    });

    // Preparar participantes válidos
    validItems.forEach(item => {
      validParticipants.push({
        nombre: item.nombre.trim(),
        rut: item.rut.trim(),
        contractor: item.contractor.trim()
      });
    });

    // Verificar capacidad del curso
    const available = capacity - currentOccupancy;
    const attemptingToAdd = validParticipants.length;

    if (attemptingToAdd > available) {
      const wouldExceed = attemptingToAdd - available;
      setCapacityDetails({
        totalCapacity: capacity,
        currentOccupancy,
        available,
        attemptingToAdd,
        wouldExceed
      });
      setShowCapacityWarning(true);
      return;
    }

    // Check capacity
    const availableSpace = capacity - currentOccupancy;
    if (validParticipants.length > availableSpace) {
      validationErrors.push(`La nómina supera la capacidad disponible (${availableSpace} lugares disponibles)`);
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simular carga exitosa
    setNewParticipants(validParticipants);
    setUploadSuccess(true);

    // Llamar a onUpload después de un delay para simular procesamiento
    setTimeout(() => {
      onUpload(validParticipants);
    }, 3000);
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    setUploadSuccess(false);
    setNewParticipants([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Carga Masiva de Participantes" size="lg">
      <div className="space-y-6">
        {!uploadSuccess ? (
          <>
            {/* Contenido original del modal */}
        <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4`}>
          <h4 className={`font-medium ${theme.text} mb-2`}>Instrucciones</h4>
          <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
            <li>• El archivo debe ser Excel (.xlsx)</li>
            <li>• Columnas requeridas: Nombre (A), RUT (B), Contratista (C)</li>
            <li>• La primera fila debe contener los encabezados</li>
            <li>• Espacios disponibles: {capacity - currentOccupancy} de {capacity}</li>
            <li>• Ejemplo de formato válido:</li>
          </ul>
          <div className={`mt-2 ${theme.bg} border ${theme.border} rounded p-2 text-xs font-mono`}>
            <div className="grid grid-cols-3 gap-2 font-semibold border-b pb-1">
              <span>Nombre</span>
              <span>RUT</span>
              <span>Contratista</span>
            </div>
            {VALID_NAME_RUT_COMBINATIONS.slice(0, 3).map((combo, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 pt-1">
                <span>{combo.nombre}</span>
                <span>{combo.rut}</span>
                <span>Empresa ABC</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-blue-600">
            💡 <strong>Datos de prueba válidos:</strong> Use los nombres y RUTs mostrados arriba para probar la validación exitosa.
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.text} mb-2`}>
            Seleccionar Archivo Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className={`block w-full text-sm ${theme.textSecondary} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className={`text-sm ${theme.textSecondary} mt-2`}>Procesando archivo...</p>
          </div>
        )}

        {preview.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Vista Previa ({preview.length} registros)
            </h4>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      RUT
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Contratista
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.slice(0, 10).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{item.nombre}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{item.rut}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{item.contractor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  ... y {preview.length - 10} registros más
                </div>
              )}
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-red-900 dark:text-red-400">Errores encontrados</h4>
            </div>
            <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || preview.length === 0 || errors.length > 0}
          >
            Importar Participantes
          </Button>
        </div>
          </>
        ) : (
          /* Modal de éxito */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text} mb-2`}>
              ¡Los datos han sido cargados exitosamente!
            </h3>
            <p className={`text-sm ${theme.textSecondary} mb-6`}>
              Se han agregado {newParticipants.length} participantes al curso
            </p>

            {/* Lista de participantes agregados */}
            <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4 mb-6`}>
              <h4 className={`font-semibold ${theme.text} mb-3`}>Participantes Agregados:</h4>
              <div className="space-y-2">
                {newParticipants.map((participant, index) => (
                  <div key={index} className={`flex justify-between items-center py-2 px-3 ${theme.bg} rounded border ${theme.border}`}>
                    <div className="text-left">
                      <p className={`font-medium ${theme.text}`}>{participant.nombre}</p>
                      <p className={`text-sm ${theme.textSecondary}`}>{participant.rut}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${theme.textMuted}`}>{participant.contractor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="primary"
                onClick={handleClose}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de advertencia de capacidad */}
      {showCapacityWarning && capacityDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.bg} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
              <h3 className={`text-lg font-semibold ${theme.text}`}>
                Excedió el número de inscripciones para este curso
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-3">Detalles de Capacidad:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacidad total del curso:</span>
                    <span className="font-medium">{capacityDetails.totalCapacity} participantes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actualmente ocupados:</span>
                    <span className="font-medium">{capacityDetails.currentOccupancy} participantes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibles:</span>
                    <span className="font-medium text-green-600">{capacityDetails.available} participantes</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Intentando agregar:</span>
                    <span className="font-medium text-blue-600">{capacityDetails.attemptingToAdd} participantes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Excedería en:</span>
                    <span className="font-medium text-red-600">{capacityDetails.wouldExceed} participantes</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Por favor, modifique su archivo Excel para incluir solo {capacityDetails.available} participantes
                o menos, y vuelva a intentar la carga.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCapacityWarning(false);
                  setCapacityDetails(null);
                }}
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}