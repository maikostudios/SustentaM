import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  EyeIcon, 
  DocumentArrowDownIcon,
  SwatchIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  generateCertificatePreview, 
  createSampleParticipant, 
  createSampleCourse,
  defaultTemplates,
  CertificateTemplate,
  generateCertificate,
  downloadBlob
} from '../../lib/pdfGenerator';
import { Participant, Course } from '../../types';

interface CertificatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  participant?: Participant;
  course?: Course;
  onTemplateSelect?: (template: CertificateTemplate) => void;
}

export function CertificatePreview({ 
  isOpen, 
  onClose, 
  participant, 
  course,
  onTemplateSelect 
}: CertificatePreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Use sample data if no participant/course provided
  const previewParticipant = participant || createSampleParticipant();
  const previewCourse = course || createSampleCourse();

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, selectedTemplate]);

  const generatePreview = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Clean up previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const template = defaultTemplates[selectedTemplate];
      const url = await generateCertificatePreview(previewParticipant, previewCourse, template);
      setPreviewUrl(url);
    } catch (err) {
      setError('Error al generar la vista previa del certificado');
      console.error('Preview generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
  };

  const handleDownloadPreview = async () => {
    try {
      const template = defaultTemplates[selectedTemplate];
      const pdfBytes = await generateCertificate(previewParticipant, previewCourse, template);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `certificado_preview_${selectedTemplate}.pdf`);
    } catch (err) {
      setError('Error al descargar el certificado');
      console.error('Download error:', err);
    }
  };

  const handleSelectTemplate = () => {
    if (onTemplateSelect) {
      onTemplateSelect(defaultTemplates[selectedTemplate]);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vista Previa de Certificado"
      size="xl"
    >
      <div className="space-y-6">
        {/* Template Selector */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <SwatchIcon className="w-5 h-5 mr-2" />
            Seleccionar Plantilla
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(defaultTemplates).map(([key, template]) => (
              <div
                key={key}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateChange(key)}
              >
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded mb-2"
                    style={{
                      backgroundColor: `rgb(${template.backgroundColor.map(c => Math.floor(c * 255)).join(', ')})`
                    }}
                  >
                    <div 
                      className="w-full h-8 rounded-t flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: `rgb(${template.headerColor.map(c => Math.floor(c * 255)).join(', ')})`,
                        color: 'white'
                      }}
                    >
                      {template.title.substring(0, 20)}...
                    </div>
                  </div>
                  <div className="text-sm font-medium capitalize">{key}</div>
                  <div className="text-xs text-gray-500">{template.layout}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Detalles de la Plantilla</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Título:</span> {defaultTemplates[selectedTemplate].title}
            </div>
            <div>
              <span className="font-medium">Organización:</span> {defaultTemplates[selectedTemplate].organizationName}
            </div>
            <div>
              <span className="font-medium">Incluye Nota:</span> {defaultTemplates[selectedTemplate].includeGrade ? 'Sí' : 'No'}
            </div>
            <div>
              <span className="font-medium">Incluye Asistencia:</span> {defaultTemplates[selectedTemplate].includeAttendance ? 'Sí' : 'No'}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <EyeIcon className="w-5 h-5 mr-2" />
            Vista Previa
          </h3>
          
          {loading && (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando vista previa...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
              <div className="text-center text-red-600">
                <XMarkIcon className="w-12 h-12 mx-auto mb-4" />
                <p>{error}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={generatePreview}
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {previewUrl && !loading && !error && (
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-96"
                title="Vista previa del certificado"
              />
            </div>
          )}
        </div>

        {/* Sample Data Info */}
        {(!participant || !course) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Datos de Ejemplo</h4>
            <div className="text-sm text-yellow-700">
              <p><strong>Participante:</strong> {previewParticipant.nombre} ({previewParticipant.rut})</p>
              <p><strong>Curso:</strong> {previewCourse.nombre} ({previewCourse.codigo})</p>
              <p><strong>Asistencia:</strong> {previewParticipant.asistencia}% | <strong>Nota:</strong> {previewParticipant.nota}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          
          <div className="space-x-3">
            <Button
              variant="secondary"
              onClick={handleDownloadPreview}
              disabled={loading || !!error}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Descargar Preview</span>
            </Button>
            
            {onTemplateSelect && (
              <Button
                variant="primary"
                onClick={handleSelectTemplate}
                disabled={loading || !!error}
              >
                Usar esta Plantilla
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
