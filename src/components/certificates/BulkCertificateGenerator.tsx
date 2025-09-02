import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CertificatePreview } from './CertificatePreview';
import { 
  DocumentArrowDownIcon,
  EyeIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { 
  generateBulkCertificates,
  downloadBlob,
  defaultTemplates,
  CertificateTemplate
} from '../../lib/pdfGenerator';
import { Participant, Course } from '../../types';

interface BulkCertificateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  course: Course;
}

export function BulkCertificateGenerator({ 
  isOpen, 
  onClose, 
  participants, 
  course 
}: BulkCertificateGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate>(defaultTemplates.classic);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const approvedParticipants = participants.filter(p => p.estado === 'aprobado');
  const totalParticipants = participants.length;
  const approvedCount = approvedParticipants.length;

  const handleTemplateSelect = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(false);
  };

  const handleGenerateBulk = async () => {
    if (approvedParticipants.length === 0) {
      return;
    }

    setGenerating(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const zipBlob = await generateBulkCertificates(approvedParticipants, course, selectedTemplate);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Download the ZIP file
      const fileName = `certificados_${course.codigo}_${new Date().toISOString().split('T')[0]}.zip`;
      downloadBlob(zipBlob, fileName);

      // Close modal after successful generation
      setTimeout(() => {
        onClose();
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error generating bulk certificates:', error);
      alert('Error al generar los certificados. Por favor, inténtelo de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  const getTemplateKey = (template: CertificateTemplate): string => {
    return Object.keys(defaultTemplates).find(
      key => defaultTemplates[key].title === template.title
    ) || 'classic';
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Generación Masiva de Certificados"
        size="lg"
      >
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Información del Curso</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Curso:</span> {course.nombre}
              </div>
              <div>
                <span className="font-medium">Código:</span> {course.codigo}
              </div>
              <div>
                <span className="font-medium">Duración:</span> {course.duracionHoras} horas
              </div>
              <div>
                <span className="font-medium">Modalidad:</span> {course.modalidad}
              </div>
            </div>
          </div>

          {/* Participants Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <UsersIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <div className="text-2xl font-bold text-gray-900">{totalParticipants}</div>
              <div className="text-sm text-gray-600">Total Participantes</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-900">{approvedCount}</div>
              <div className="text-sm text-green-600">Aprobados</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <DocumentArrowDownIcon className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-900">{approvedCount}</div>
              <div className="text-sm text-yellow-600">Certificados a Generar</div>
            </div>
          </div>

          {/* Warning if no approved participants */}
          {approvedCount === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  No hay participantes aprobados para generar certificados
                </span>
              </div>
            </div>
          )}

          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <SwatchIcon className="w-5 h-5 mr-2" />
              Plantilla Seleccionada
            </h3>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{selectedTemplate.title}</div>
                  <div className="text-sm text-gray-600">{selectedTemplate.organizationName}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Layout: {selectedTemplate.layout} | 
                    Incluye nota: {selectedTemplate.includeGrade ? 'Sí' : 'No'} | 
                    Incluye asistencia: {selectedTemplate.includeAttendance ? 'Sí' : 'No'}
                  </div>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center space-x-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Vista Previa</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Approved Participants List */}
          {approvedCount > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Participantes Aprobados</h3>
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Nombre
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        RUT
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Asistencia
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Nota
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approvedParticipants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {participant.nombre}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {participant.rut}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {participant.asistencia}%
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {participant.nota.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {generating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generando certificados...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={generating}
            >
              Cancelar
            </Button>
            
            <Button
              variant="primary"
              onClick={handleGenerateBulk}
              disabled={approvedCount === 0 || generating}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>
                {generating 
                  ? 'Generando...' 
                  : `Generar ${approvedCount} Certificado${approvedCount !== 1 ? 's' : ''}`
                }
              </span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Certificate Preview Modal */}
      <CertificatePreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        participant={approvedParticipants[0]}
        course={course}
        onTemplateSelect={handleTemplateSelect}
      />
    </>
  );
}
