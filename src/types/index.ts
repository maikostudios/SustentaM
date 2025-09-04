export interface User {
  id: string;
  nombre: string;
  rut: string;
  rol: 'administrador' | 'contratista' | 'usuario';
  clave: string;
  empresa?: string; // Empresa contratista (solo para rol contratista)
}

export interface Course {
  id: string;
  codigo: string;
  nombre: string;
  duracionHoras: number;
  fechaInicio: string;
  fechaFin: string;
  modalidad: 'presencial' | 'teams';
  objetivos: string;
}

export interface Session {
  id: string;
  courseId: string;
  fecha: string;
  horaInicio?: string;
  horaFin?: string;
  capacity: number;
  seats: Seat[];
}

export interface Seat {
  id: string;
  sessionId: string;
  estado: 'libre' | 'ocupado';
  participantId?: string;
}

export interface Participant {
  id: string;
  sessionId: string;
  nombre: string;
  rut: string;
  contractor: string;
  asistencia: number;
  nota: number;
  estado: 'inscrito' | 'aprobado' | 'reprobado';
}

export interface Certificate {
  id: string;
  participantId: string;
  courseId: string;
  pdfUrl?: string;
  generatedAt: string;
}

export interface EnrollmentData {
  nombre: string;
  rut: string;
  contractor: string;
}

export interface AttendanceData {
  rut: string;
  asistencia: number;
  nota: number;
}