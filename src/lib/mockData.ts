import { Course, Session, Participant, User } from '../types';

// Usuarios del sistema
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    nombre: 'Administrador Principal',
    rut: '11.111.111-1',
    rol: 'administrador',
    clave: 'admin'
  },
  {
    id: 'contractor-1',
    nombre: 'Empresa Contratista ABC',
    rut: '22.222.222-2',
    rol: 'contratista',
    clave: '1234',
    empresa: 'Empresa ABC Ltda.'
  },
  {
    id: 'contractor-2',
    nombre: 'Constructora XYZ Ltda.',
    rut: '33.333.333-3',
    rol: 'contratista',
    clave: '1234',
    empresa: 'Constructora XYZ S.A.'
  },
  {
    id: 'contractor-3',
    nombre: 'Tech Solutions SpA',
    rut: '44.444.444-4',
    rol: 'contratista',
    clave: '1234',
    empresa: 'Tech Solutions SpA'
  },
  {
    id: 'contractor-4',
    nombre: 'Servicios Integrales DEF',
    rut: '55.555.555-5',
    rol: 'contratista',
    clave: '1234',
    empresa: 'Servicios Integrales DEF'
  },
  {
    id: 'user-1',
    nombre: 'Juan Pérez González',
    rut: '12.345.678-5',
    rol: 'usuario',
    clave: 'user123'
  },
  {
    id: 'user-2',
    nombre: 'María Silva Rodríguez',
    rut: '98.765.432-1',
    rol: 'usuario',
    clave: 'user123'
  }
];

// Cursos disponibles
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    codigo: 'PROP-001',
    nombre: 'Excel Avanzado para Profesionales',
    duracionHoras: 16,
    fechaInicio: '2025-09-10',
    fechaFin: '2025-09-12',
    modalidad: 'presencial',
    objetivos: 'Dominar funciones avanzadas de Excel, tablas dinámicas, macros básicas y análisis de datos para mejorar la productividad laboral en el ámbito empresarial.'
  },
  {
    id: 'course-2',
    codigo: 'EXT-002',
    nombre: 'Power BI para Análisis de Datos',
    duracionHoras: 20,
    fechaInicio: '2025-09-15',
    fechaFin: '2025-09-19',
    modalidad: 'teams',
    objetivos: 'Crear dashboards interactivos, conectar múltiples fuentes de datos y generar reportes automatizados con Power BI para la toma de decisiones empresariales.'
  },
  {
    id: 'course-3',
    codigo: 'PROP-003',
    nombre: 'Gestión Ágil de Proyectos',
    duracionHoras: 16,
    fechaInicio: '2025-09-20',
    fechaFin: '2025-09-25',
    modalidad: 'presencial',
    objetivos: 'Implementar metodologías ágiles como Scrum y Kanban para la gestión efectiva de proyectos y equipos de trabajo.'
  },
  {
    id: 'course-4',
    codigo: 'EXT-004',
    nombre: 'Análisis de Datos con Python',
    duracionHoras: 20,
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-05',
    modalidad: 'teams',
    objetivos: 'Introducción al análisis de datos, manipulación con Pandas, visualización con Matplotlib y conceptos básicos de machine learning.'
  },
  {
    id: 'course-5',
    codigo: 'PROP-005',
    nombre: 'Liderazgo y Comunicación Efectiva',
    duracionHoras: 12,
    fechaInicio: '2025-10-08',
    fechaFin: '2025-10-10',
    modalidad: 'presencial',
    objetivos: 'Desarrollar habilidades de liderazgo, comunicación asertiva y manejo de equipos de alto rendimiento.'
  },
  {
    id: 'course-6',
    codigo: 'EXT-006',
    nombre: 'Seguridad Informática Básica',
    duracionHoras: 8,
    fechaInicio: '2025-09-12',
    fechaFin: '2025-09-13',
    modalidad: 'teams',
    objetivos: 'Fundamentos de ciberseguridad, protección de datos y buenas prácticas de seguridad digital.'
  },
  {
    id: 'course-7',
    codigo: 'PROP-007',
    nombre: 'Técnicas de Presentación',
    duracionHoras: 6,
    fechaInicio: '2025-09-18',
    fechaFin: '2025-09-19',
    modalidad: 'presencial',
    objetivos: 'Mejorar habilidades de presentación, manejo de audiencias y comunicación visual efectiva.'
  },
  {
    id: 'course-8',
    codigo: 'EXT-008',
    nombre: 'Marketing Digital y Redes Sociales',
    duracionHoras: 14,
    fechaInicio: '2025-09-22',
    fechaFin: '2025-09-26',
    modalidad: 'teams',
    objetivos: 'Estrategias de marketing digital, gestión de redes sociales y análisis de métricas para el crecimiento empresarial.'
  }
];

// Sesiones de cursos con horarios específicos
export const mockSessions: Session[] = [
  // Excel Avanzado - 3 días
  {
    id: 'session-1',
    courseId: 'course-1',
    fecha: '2025-09-10',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-2',
    courseId: 'course-1',
    fecha: '2025-09-11',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-3',
    courseId: 'course-1',
    fecha: '2025-09-12',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },

  // Power BI - 5 días
  {
    id: 'session-4',
    courseId: 'course-2',
    fecha: '2025-09-15',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-5',
    courseId: 'course-2',
    fecha: '2025-09-16',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-6',
    courseId: 'course-2',
    fecha: '2025-09-17',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-7',
    courseId: 'course-2',
    fecha: '2025-09-18',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-8',
    courseId: 'course-2',
    fecha: '2025-09-19',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },

  // Gestión Ágil - 4 días (PRESENCIAL = 30 butacas)
  {
    id: 'session-9',
    courseId: 'course-3',
    fecha: '2025-09-20',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-10',
    courseId: 'course-3',
    fecha: '2025-09-23',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-11',
    courseId: 'course-3',
    fecha: '2025-09-24',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-12',
    courseId: 'course-3',
    fecha: '2025-09-25',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },

  // Seguridad Informática - 2 días (TEAMS = 200 butacas)
  {
    id: 'session-13',
    courseId: 'course-6',
    fecha: '2025-09-12',
    horaInicio: '15:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-14',
    courseId: 'course-6',
    fecha: '2025-09-13',
    horaInicio: '15:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },

  // Técnicas de Presentación - 2 días
  {
    id: 'session-15',
    courseId: 'course-7',
    fecha: '2025-09-18',
    horaInicio: '10:00',
    horaFin: '13:00',
    capacity: 20,
    seats: []
  },
  {
    id: 'session-16',
    courseId: 'course-7',
    fecha: '2025-09-19',
    horaInicio: '10:00',
    horaFin: '13:00',
    capacity: 20,
    seats: []
  },

  // Marketing Digital - 5 días
  // Marketing Digital - 5 días (TEAMS = 200 butacas)
  {
    id: 'session-17',
    courseId: 'course-8',
    fecha: '2025-09-22',
    horaInicio: '16:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-18',
    courseId: 'course-8',
    fecha: '2025-09-23',
    horaInicio: '16:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-19',
    courseId: 'course-8',
    fecha: '2025-09-24',
    horaInicio: '16:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-20',
    courseId: 'course-8',
    fecha: '2025-09-25',
    horaInicio: '16:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-21',
    courseId: 'course-8',
    fecha: '2025-09-26',
    horaInicio: '16:00',
    horaFin: '19:00',
    capacity: 200,
    seats: []
  },

  // Análisis de Datos con Python - 5 días (TEAMS = 200 butacas)
  {
    id: 'session-22',
    courseId: 'course-4',
    fecha: '2025-10-01',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-23',
    courseId: 'course-4',
    fecha: '2025-10-02',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-24',
    courseId: 'course-4',
    fecha: '2025-10-03',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-25',
    courseId: 'course-4',
    fecha: '2025-10-04',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },
  {
    id: 'session-26',
    courseId: 'course-4',
    fecha: '2025-10-05',
    horaInicio: '14:00',
    horaFin: '18:00',
    capacity: 200,
    seats: []
  },

  // Liderazgo y Comunicación - 3 días (PRESENCIAL = 30 butacas)
  {
    id: 'session-27',
    courseId: 'course-5',
    fecha: '2025-10-08',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-28',
    courseId: 'course-5',
    fecha: '2025-10-09',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-29',
    courseId: 'course-5',
    fecha: '2025-10-10',
    horaInicio: '09:00',
    horaFin: '13:00',
    capacity: 30,
    seats: []
  },

  // Técnicas de Presentación - 2 días (PRESENCIAL = 30 butacas)
  {
    id: 'session-30',
    courseId: 'course-7',
    fecha: '2025-09-18',
    horaInicio: '14:00',
    horaFin: '17:00',
    capacity: 30,
    seats: []
  },
  {
    id: 'session-31',
    courseId: 'course-7',
    fecha: '2025-09-19',
    horaInicio: '14:00',
    horaFin: '17:00',
    capacity: 30,
    seats: []
  }
];

// Participantes con datos realistas y consistentes
export const mockParticipants: Participant[] = [
  // Excel Avanzado - Session 1
  {
    id: 'participant-1',
    sessionId: 'session-1',
    nombre: 'Juan Carlos Pérez González',
    rut: '12.345.678-5',
    contractor: 'Empresa ABC Ltda.',
    asistencia: 95,
    nota: 6.8,
    estado: 'aprobado'
  },
  {
    id: 'participant-2',
    sessionId: 'session-1',
    nombre: 'María Elena González Silva',
    rut: '98.765.432-1',
    contractor: 'Constructora XYZ S.A.',
    asistencia: 88,
    nota: 6.2,
    estado: 'aprobado'
  },
  {
    id: 'participant-3',
    sessionId: 'session-1',
    nombre: 'Carlos Alberto Rodríguez López',
    rut: '15.678.234-9',
    contractor: 'Empresa ABC Ltda.',
    asistencia: 92,
    nota: 6.5,
    estado: 'aprobado'
  },
  {
    id: 'participant-4',
    sessionId: 'session-1',
    nombre: 'Ana Patricia Morales Díaz',
    rut: '19.876.543-2',
    contractor: 'Servicios Integrales DEF',
    asistencia: 75,
    nota: 5.8,
    estado: 'aprobado'
  },
  {
    id: 'participant-5',
    sessionId: 'session-1',
    nombre: 'Roberto Francisco Herrera Castro',
    rut: '11.234.567-8',
    contractor: 'Constructora XYZ S.A.',
    asistencia: 65,
    nota: 4.2,
    estado: 'reprobado'
  },

  // Power BI - Session 4
  {
    id: 'participant-6',
    sessionId: 'session-4',
    nombre: 'Laura Patricia Fernández Morales',
    rut: '14.567.890-1',
    contractor: 'Tech Solutions SpA',
    asistencia: 98,
    nota: 6.9,
    estado: 'aprobado'
  },
  {
    id: 'participant-7',
    sessionId: 'session-4',
    nombre: 'Diego Alejandro Vargas Soto',
    rut: '16.789.012-3',
    contractor: 'Consultora Beta Ltda.',
    asistencia: 85,
    nota: 6.1,
    estado: 'aprobado'
  },
  {
    id: 'participant-8',
    sessionId: 'session-4',
    nombre: 'Claudia Beatriz Jiménez Rojas',
    rut: '17.890.123-4',
    contractor: 'Innovación Digital S.A.',
    asistencia: 90,
    nota: 6.4,
    estado: 'aprobado'
  },

  // Gestión Ágil - Session 9
  {
    id: 'participant-9',
    sessionId: 'session-9',
    nombre: 'Andrés Felipe Muñoz Contreras',
    rut: '18.901.234-5',
    contractor: 'Empresa ABC Ltda.',
    asistencia: 100,
    nota: 7.0,
    estado: 'aprobado'
  },
  {
    id: 'participant-10',
    sessionId: 'session-9',
    nombre: 'Valentina Isabel Torres Mendoza',
    rut: '20.012.345-6',
    contractor: 'Constructora XYZ S.A.',
    asistencia: 78,
    nota: 5.5,
    estado: 'aprobado'
  },

  // Seguridad Informática - Session 13
  {
    id: 'participant-11',
    sessionId: 'session-13',
    nombre: 'Sebastián Ignacio Ramírez Flores',
    rut: '21.123.456-7',
    contractor: 'Tech Solutions SpA',
    asistencia: 95,
    nota: 6.7,
    estado: 'aprobado'
  },
  {
    id: 'participant-12',
    sessionId: 'session-13',
    nombre: 'Francisca Alejandra Cortés Vega',
    rut: '22.234.567-8',
    contractor: 'Servicios Integrales DEF',
    asistencia: 82,
    nota: 5.9,
    estado: 'aprobado'
  },

  // Técnicas de Presentación - Session 15
  {
    id: 'participant-13',
    sessionId: 'session-15',
    nombre: 'Matías Esteban Guerrero Pinto',
    rut: '23.345.678-9',
    contractor: 'Consultora Beta Ltda.',
    asistencia: 100,
    nota: 6.8,
    estado: 'aprobado'
  },
  {
    id: 'participant-14',
    sessionId: 'session-15',
    nombre: 'Camila Antonia Espinoza Ruiz',
    rut: '24.456.789-0',
    contractor: 'Innovación Digital S.A.',
    asistencia: 88,
    nota: 6.3,
    estado: 'aprobado'
  },

  // Marketing Digital - Session 17
  {
    id: 'participant-15',
    sessionId: 'session-17',
    nombre: 'Nicolás Benjamín Salinas Herrera',
    rut: '25.567.890-1',
    contractor: 'Tech Solutions SpA',
    asistencia: 92,
    nota: 6.6,
    estado: 'aprobado'
  },
  {
    id: 'participant-16',
    sessionId: 'session-17',
    nombre: 'Carmen Esperanza López Martínez',
    rut: '26.678.901-2',
    contractor: 'Servicios Integrales DEF',
    asistencia: 85,
    nota: 6.0,
    estado: 'aprobado'
  },
  {
    id: 'participant-17',
    sessionId: 'session-9',
    nombre: 'Joaquín Emilio Reyes Sandoval',
    rut: '27.789.012-3',
    contractor: 'Empresa ABC Ltda.',
    asistencia: 95,
    nota: 6.7,
    estado: 'aprobado'
  },
  {
    id: 'participant-18',
    sessionId: 'session-13',
    nombre: 'Isidora Fernanda Bravo Castillo',
    rut: '28.890.123-4',
    contractor: 'Constructora XYZ S.A.',
    asistencia: 70,
    nota: 5.1,
    estado: 'aprobado'
  }
];