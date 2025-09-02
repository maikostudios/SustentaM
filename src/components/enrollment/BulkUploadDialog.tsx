import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { validarRUT } from '../../lib/validations';
import { EnrollmentData } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DocumentArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);
    setLoading(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Skip header row and process data
      const dataRows = rows.slice(1) as any[][];
      const previewData = dataRows.map((row, index) => ({
        rowNumber: index + 2,
        nombre: row[0] || '',
        rut: row[1] || '',
        contractor: row[2] || '',
        valid: true,
        errors: []
      }));

      setPreview(previewData);
    } catch (error) {
      setErrors(['Error al leer el archivo. Asegúrese de que sea un archivo Excel válido.']);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const validationErrors: string[] = [];
    const validParticipants: EnrollmentData[] = [];

    preview.forEach(item => {
      const rowErrors: string[] = [];

      // Validate required fields
      if (!item.nombre.trim()) {
        rowErrors.push('Nombre requerido');
      }

      if (!item.rut.trim()) {
        rowErrors.push('RUT requerido');
      } else {
        const rutValidation = validarRUT(item.rut);
        if (!rutValidation.valido) {
          rowErrors.push(rutValidation.mensaje);
        }
      }

      if (!item.contractor.trim()) {
        rowErrors.push('Contratista requerido');
      }

      if (rowErrors.length > 0) {
        validationErrors.push(`Fila ${item.rowNumber}: ${rowErrors.join(', ')}`);
      } else {
        validParticipants.push({
          nombre: item.nombre.trim(),
          rut: item.rut.trim(),
          contractor: item.contractor.trim()
        });
      }
    });

    // Check capacity
    const availableSpace = capacity - currentOccupancy;
    if (validParticipants.length > availableSpace) {
      validationErrors.push(`La nómina supera la capacidad disponible (${availableSpace} lugares disponibles)`);
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onUpload(validParticipants);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Carga Masiva de Participantes" size="lg">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instrucciones</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• El archivo debe ser Excel (.xlsx)</li>
            <li>• Columnas requeridas: Nombre (A), RUT (B), Contratista (C)</li>
            <li>• La primera fila debe contener los encabezados</li>
            <li>• Espacios disponibles: {capacity - currentOccupancy} de {capacity}</li>
            <li>• Ejemplo de formato válido:</li>
          </ul>
          <div className="mt-2 bg-white border border-blue-200 rounded p-2 text-xs font-mono">
            <div className="grid grid-cols-3 gap-2 font-semibold border-b pb-1">
              <span>Nombre</span>
              <span>RUT</span>
              <span>Contratista</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <span>Juan Pérez</span>
              <span>12345678-5</span>
              <span>Empresa ABC</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Archivo Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">Procesando archivo...</p>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-red-900">Errores encontrados</h4>
            </div>
            <ul className="text-sm text-red-800 space-y-1">
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
      </div>
    </Modal>
  );
}