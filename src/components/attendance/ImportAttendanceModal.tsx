import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { XMarkIcon, DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';
import { useNotifications } from '../../contexts/ToastContext';

interface ImportAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportAttendanceModal({ isOpen, onClose }: ImportAttendanceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const theme = useThemeAware();
  const { showNotification } = useNotifications();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    // Simulación de carga de archivo
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Mostrar notificación de éxito
      showNotification({
        type: 'success',
        title: 'Asistencia Importada',
        message: `Se importaron exitosamente los datos de asistencia desde ${file.name}`,
        duration: 5000
      });
    }, 2000);
  };

  const handleClose = () => {
    setFile(null);
    setIsUploading(false);
    setUploadSuccess(false);
    onClose();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadSuccess(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Asistencia" size="md">
      <div className="space-y-6">
        {!uploadSuccess ? (
          <>
            {/* Instrucciones */}
            <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.text} mb-3 flex items-center`}>
                <DocumentArrowUpIcon className="w-5 h-5 mr-2 text-blue-500" />
                Instrucciones para Importar Asistencia
              </h4>
              <ul className={`text-sm ${theme.textSecondary} space-y-2`}>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  El archivo debe ser Excel (.xlsx) o CSV (.csv)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Debe contener las columnas: RUT, Nombre, Porcentaje de Asistencia
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Los porcentajes deben estar entre 0% y 100%
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  La primera fila debe contener los encabezados
                </li>
              </ul>
            </div>

            {/* Selector de archivo */}
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${theme.text}`}>
                Seleccionar Archivo de Asistencia
              </label>
              
              {!file ? (
                <div className={`border-2 border-dashed ${theme.border} rounded-lg p-8 text-center hover:${theme.bgSecondary} transition-colors`}>
                  <DocumentArrowUpIcon className={`w-12 h-12 ${theme.textMuted} mx-auto mb-4`} />
                  <p className={`text-sm ${theme.textSecondary} mb-4`}>
                    Arrastra tu archivo aquí o haz click para seleccionar
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="attendance-file-input"
                  />
                  <label
                    htmlFor="attendance-file-input"
                    className={`inline-flex items-center px-4 py-2 border ${theme.border} rounded-md shadow-sm text-sm font-medium ${theme.text} ${theme.bg} hover:${theme.bgSecondary} cursor-pointer transition-colors`}
                  >
                    Seleccionar Archivo
                  </label>
                </div>
              ) : (
                <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4 flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <DocumentArrowUpIcon className="w-8 h-8 text-green-500" />
                    <div>
                      <p className={`text-sm font-medium ${theme.text}`}>{file.name}</p>
                      <p className={`text-xs ${theme.textSecondary}`}>
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className={`p-1 rounded-full hover:${theme.bgSecondary} ${theme.textMuted} hover:${theme.text} transition-colors`}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={!file || isUploading}
                loading={isUploading}
              >
                {isUploading ? 'Subiendo Archivo...' : 'Subir Archivo'}
              </Button>
            </div>
          </>
        ) : (
          /* Mensaje de éxito */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text} mb-2`}>
              ¡Asistencia Cargada Exitosamente!
            </h3>
            <p className={`text-sm ${theme.textSecondary} mb-6`}>
              Los datos de asistencia se han importado correctamente desde el archivo <strong>{file?.name}</strong>
            </p>
            <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4 mb-6`}>
              <p className={`text-sm ${theme.text} font-medium mb-2`}>📊 Resumen de Importación:</p>
              <div className={`text-sm ${theme.textSecondary} space-y-1`}>
                <p>• Registros procesados: 25</p>
                <p>• Asistencias actualizadas: 25</p>
                <p>• Errores encontrados: 0</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleClose}
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
