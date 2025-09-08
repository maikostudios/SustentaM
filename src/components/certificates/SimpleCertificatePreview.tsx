import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/ToastContext';
import { useThemeAware } from '../../hooks/useTheme';

interface SimpleCertificatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleCertificatePreview({ isOpen, onClose }: SimpleCertificatePreviewProps) {
  const notifications = useNotifications();
  const theme = useThemeAware();

  const handleDownload = () => {
    notifications.success(
      'Certificado descargado',
      'El certificado de ejemplo se ha descargado exitosamente.'
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vista Previa de Certificado"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className={`text-lg font-semibold ${theme.text} flex items-center justify-center`}>
            <EyeIcon className="w-5 h-5 mr-2" />
            Certificado de Ejemplo
          </h3>
          <p className={`text-sm ${theme.textSecondary} mt-2`}>
            Esta es una vista previa simulada de cómo se vería un certificado generado
          </p>
        </div>

        {/* Certificate Preview */}
        <div className={`border-2 border-dashed ${theme.border} rounded-lg p-8 ${theme.bgSecondary}`}>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            {/* Certificate Header */}
            <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">CERTIFICADO</h1>
              <h2 className="text-xl font-semibold text-gray-700">DE APROBACIÓN</h2>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-600">Se certifica que</p>
              
              <div className="border-b border-gray-300 pb-2 mb-4">
                <p className="text-2xl font-bold text-gray-800">JUAN PÉREZ GONZÁLEZ</p>
                <p className="text-sm text-gray-500">RUT: 12.345.678-9</p>
              </div>

              <p className="text-lg text-gray-600">ha aprobado satisfactoriamente el curso</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h3 className="text-xl font-bold text-blue-800">CAPACITACIÓN SSO</h3>
                <p className="text-blue-600">Código: SSO-001</p>
                <p className="text-sm text-blue-500 mt-2">Duración: 16 horas</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 my-6">
                <div>
                  <p><strong>Asistencia:</strong> 95%</p>
                  <p><strong>Nota Final:</strong> 6.5</p>
                </div>
                <div>
                  <p><strong>Fecha Inicio:</strong> 10/09/2025</p>
                  <p><strong>Fecha Fin:</strong> 12/09/2025</p>
                </div>
              </div>

              <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-300">
                <div className="text-left">
                  <div className="border-t border-gray-400 pt-2 w-48">
                    <p className="text-sm font-semibold">Instructor</p>
                    <p className="text-xs text-gray-500">María González</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-full flex items-center justify-center mb-2">
                    <span className="text-blue-600 font-bold text-xs">SELLO</span>
                  </div>
                  <p className="text-xs text-gray-500">Certificado Digital</p>
                </div>
                <div className="text-right">
                  <div className="border-t border-gray-400 pt-2 w-48">
                    <p className="text-sm font-semibold">Director</p>
                    <p className="text-xs text-gray-500">SUSTENTA SpA</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-xs text-gray-400">
                  Emitido el {new Date().toLocaleDateString('es-CL')} | Certificado N° 2025-001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4`}>
          <h4 className={`font-semibold ${theme.text} mb-2`}>Información del Certificado</h4>
          <div className={`text-sm ${theme.textSecondary} space-y-1`}>
            <p>• Este es un ejemplo de cómo se vería un certificado generado</p>
            <p>• Los datos mostrados son ficticios para fines de demostración</p>
            <p>• El certificado real incluirá los datos específicos del participante y curso</p>
            <p>• El formato final será un documento PDF descargable</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cerrar
          </Button>
          
          <div className="space-x-3">
            <Button
              variant="secondary"
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Descargar Ejemplo</span>
            </Button>
            
            <Button
              variant="primary"
              onClick={onClose}
            >
              Usar Plantilla
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
