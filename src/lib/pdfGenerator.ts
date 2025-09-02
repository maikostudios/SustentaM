import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { Participant, Course } from '../types';

export interface CertificateTemplate {
  title: string;
  subtitle?: string;
  headerColor: [number, number, number];
  backgroundColor: [number, number, number];
  textColor: [number, number, number];
  fontSize: {
    title: number;
    subtitle: number;
    content: number;
    details: number;
  };
  layout: 'classic' | 'modern' | 'elegant';
  includeGrade: boolean;
  includeAttendance: boolean;
  organizationName: string;
  signatureName: string;
}

export const defaultTemplates: Record<string, CertificateTemplate> = {
  classic: {
    title: 'CERTIFICADO DE APROBACIÓN',
    subtitle: 'Organismo Técnico de Capacitación',
    headerColor: [0.04, 0.24, 0.38], // #0A3D62
    backgroundColor: [1, 1, 1], // White
    textColor: [0.1, 0.1, 0.1], // Dark gray
    fontSize: {
      title: 20,
      subtitle: 14,
      content: 14,
      details: 12
    },
    layout: 'classic',
    includeGrade: true,
    includeAttendance: true,
    organizationName: 'Organismo Técnico de Capacitación',
    signatureName: 'Director de Capacitación'
  },
  modern: {
    title: 'CERTIFICADO DE COMPETENCIAS',
    subtitle: 'Centro de Excelencia en Capacitación',
    headerColor: [0.2, 0.6, 0.9], // Modern blue
    backgroundColor: [0.98, 0.98, 1], // Light blue tint
    textColor: [0.2, 0.2, 0.3], // Dark blue-gray
    fontSize: {
      title: 22,
      subtitle: 16,
      content: 15,
      details: 13
    },
    layout: 'modern',
    includeGrade: true,
    includeAttendance: true,
    organizationName: 'Centro de Excelencia en Capacitación',
    signatureName: 'Coordinador Académico'
  },
  elegant: {
    title: 'CERTIFICADO DE LOGRO',
    subtitle: 'Instituto de Desarrollo Profesional',
    headerColor: [0.5, 0.2, 0.6], // Elegant purple
    backgroundColor: [0.99, 0.97, 1], // Light purple tint
    textColor: [0.3, 0.1, 0.4], // Dark purple
    fontSize: {
      title: 24,
      subtitle: 18,
      content: 16,
      details: 14
    },
    layout: 'elegant',
    includeGrade: false,
    includeAttendance: true,
    organizationName: 'Instituto de Desarrollo Profesional',
    signatureName: 'Director Ejecutivo'
  }
};

export async function generateCertificate(
  participant: Participant,
  course: Course,
  template: CertificateTemplate = defaultTemplates.classic
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background color
  if (template.backgroundColor[0] !== 1 || template.backgroundColor[1] !== 1 || template.backgroundColor[2] !== 1) {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: rgb(template.backgroundColor[0], template.backgroundColor[1], template.backgroundColor[2])
    });
  }

  // Header with template styling
  const titleY = template.layout === 'elegant' ? 780 : 750;
  page.drawText(template.title, {
    x: 50,
    y: titleY,
    size: template.fontSize.title,
    font: boldFont,
    color: rgb(template.headerColor[0], template.headerColor[1], template.headerColor[2])
  });

  // Subtitle
  if (template.subtitle) {
    page.drawText(template.subtitle, {
      x: 50,
      y: titleY - 30,
      size: template.fontSize.subtitle,
      font: font,
      color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
    });
  }

  // Content area
  const contentStartY = template.subtitle ? titleY - 80 : titleY - 50;

  page.drawText('Se certifica que', {
    x: 50,
    y: contentStartY,
    size: template.fontSize.content,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText(participant.nombre.toUpperCase(), {
    x: 50,
    y: contentStartY - 40,
    size: template.fontSize.content + 4,
    font: boldFont,
    color: rgb(template.headerColor[0], template.headerColor[1], template.headerColor[2])
  });

  page.drawText(`RUT: ${participant.rut}`, {
    x: 50,
    y: contentStartY - 70,
    size: template.fontSize.details,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText('ha aprobado satisfactoriamente el curso', {
    x: 50,
    y: contentStartY - 110,
    size: template.fontSize.content,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText(`"${course.nombre}"`, {
    x: 50,
    y: contentStartY - 140,
    size: template.fontSize.content + 2,
    font: boldFont,
    color: rgb(template.headerColor[0], template.headerColor[1], template.headerColor[2])
  });

  page.drawText(`Código: ${course.codigo}`, {
    x: 50,
    y: contentStartY - 170,
    size: template.fontSize.details,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText(`Duración: ${course.duracionHoras} horas académicas`, {
    x: 50,
    y: contentStartY - 190,
    size: template.fontSize.details,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText(`Modalidad: ${course.modalidad === 'teams' ? 'Virtual (Teams)' : 'Presencial'}`, {
    x: 50,
    y: contentStartY - 210,
    size: template.fontSize.details,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  let detailsY = contentStartY - 230;

  if (template.includeAttendance) {
    page.drawText(`Porcentaje de asistencia: ${participant.asistencia}%`, {
      x: 50,
      y: detailsY,
      size: template.fontSize.details,
      font,
      color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
    });
    detailsY -= 20;
  }

  if (template.includeGrade) {
    page.drawText(`Calificación final: ${participant.nota.toFixed(1)}`, {
      x: 50,
      y: detailsY,
      size: template.fontSize.details,
      font,
      color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
    });
    detailsY -= 20;
  }

  // Date and signature
  const today = new Date().toLocaleDateString('es-CL');
  const signatureY = detailsY - 60;

  page.drawText(`Fecha de emisión: ${today}`, {
    x: 50,
    y: signatureY,
    size: template.fontSize.details,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  // Signature line
  page.drawText('_____________________________', {
    x: 50,
    y: signatureY - 60,
    size: template.fontSize.details,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText(template.signatureName, {
    x: 50,
    y: signatureY - 80,
    size: template.fontSize.details - 1,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });

  page.drawText(template.organizationName, {
    x: 50,
    y: signatureY - 100,
    size: template.fontSize.details - 1,
    font,
    color: rgb(template.textColor[0], template.textColor[1], template.textColor[2])
  });
  
  return await pdfDoc.save();
}

export async function generateBulkCertificates(
  participants: Participant[],
  course: Course,
  template: CertificateTemplate = defaultTemplates.classic
): Promise<Blob> {
  const approvedParticipants = participants.filter(p => p.estado === 'aprobado');

  if (approvedParticipants.length === 0) {
    throw new Error('No hay participantes aprobados para generar certificados');
  }

  const zip = new JSZip();

  // Generate certificates for all approved participants
  for (const participant of approvedParticipants) {
    try {
      const certificatePdf = await generateCertificate(participant, course, template);
      const fileName = `certificado_${participant.nombre.replace(/\s+/g, '_')}_${participant.rut}.pdf`;
      zip.file(fileName, certificatePdf);
    } catch (error) {
      console.error(`Error generating certificate for ${participant.nombre}:`, error);
    }
  }

  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateCertificatePreview(
  participant: Participant,
  course: Course,
  template: CertificateTemplate = defaultTemplates.classic
): Promise<string> {
  const pdfBytes = await generateCertificate(participant, course, template);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export function createSampleParticipant(): Participant {
  return {
    id: 'sample-participant',
    nombre: 'Juan Carlos Pérez González',
    rut: '12.345.678-9',
    contractor: 'Empresa Ejemplo S.A.',
    sessionId: 'sample-session',
    asistencia: 95,
    nota: 6.5,
    estado: 'aprobado'
  };
}

export function createSampleCourse(): Course {
  return {
    id: 'sample-course',
    codigo: 'DEMO-001',
    nombre: 'Curso de Demostración de Certificados',
    duracionHoras: 16,
    fechaInicio: '2025-01-15',
    fechaFin: '2025-01-17',
    modalidad: 'presencial',
    objetivos: 'Demostrar las diferentes plantillas de certificados disponibles en el sistema.'
  };
}