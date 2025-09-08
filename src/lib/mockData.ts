import { Course, Session, Participant, User } from '../types';

// Usuarios del sistema - CREDENCIALES PARA PRESENTACIÓN AL CLIENTE
export const mockUsers: User[] = [
  // ADMINISTRADOR
  {
    id: 'admin-1',
    nombre: 'Administrador Principal',
    rut: '11.111.111-1',
    rol: 'administrador',
    clave: 'admin'
  },
  {
    id: 'admin-2',
    nombre: 'Administrador Principal',
    rut: 'admin@sustenta.cl',
    rol: 'administrador',
    clave: 'admin123'
  },

  // CONTRATISTAS
  {
    id: 'contractor-1',
    nombre: 'Empresa Contratista ABC',
    rut: '22.222.222-2',
    rol: 'contratista',
    clave: '1234',
    empresa: 'Empresa ABC Ltda.'
  },
  {
    id: 'contractor-1b',
    nombre: 'Empresa Contratista Principal',
    rut: 'contratista@empresa.cl',
    rol: 'contratista',
    clave: 'contratista123',
    empresa: 'Empresa Contratista Principal S.A.'
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

  // PARTICIPANTES
  {
    id: 'user-1',
    nombre: 'Juan Carlos Pérez González',
    rut: '12.345.678-5',
    rol: 'usuario',
    clave: 'user123'
  },
  {
    id: 'user-1b',
    nombre: 'Juan Carlos Pérez González',
    rut: 'participante@email.cl',
    rol: 'usuario',
    clave: 'participante123'
  },
  {
    id: 'user-2',
    nombre: 'María Elena Rodríguez Silva',
    rut: '98.765.432-5',
    rol: 'usuario',
    clave: 'user123'
  },
  {
    id: 'user-3',
    nombre: 'Carlos Alberto Muñoz Torres',
    rut: '15.678.234-3',
    rol: 'usuario',
    clave: 'user123'
  }
];

// Cursos disponibles - ACTUALIZADOS PARA PRESENTACIÓN AL CLIENTE
export const mockCourses: Course[] = [
  // TABLA 1: PROPIOS Y EE.CC.
  {
    id: 'course-1',
    codigo: 'SSO-001',
    nombre: 'INDUCCIÓN SEGURIDAD Y SALUD OCUPACIONAL SSO',
    duracionHoras: 16,
    fechaInicio: '2025-09-10',
    fechaFin: '2025-09-12',
    modalidad: 'presencial',
    objetivos: 'Proporcionar conocimientos fundamentales sobre seguridad y salud ocupacional, normativas vigentes y procedimientos de prevención de riesgos laborales.'
  },
  {
    id: 'course-2',
    codigo: 'MINSAL-002',
    nombre: 'PROTOCOLOS MINISTERIO DE SALUD',
    duracionHoras: 4,
    fechaInicio: '2025-09-15',
    fechaFin: '2025-09-15',
    modalidad: 'teams',
    objetivos: 'Conocer y aplicar los protocolos sanitarios establecidos por el Ministerio de Salud para el ámbito laboral.'
  },
  {
    id: 'course-3',
    codigo: 'BEL-003',
    nombre: 'PROGRAMA BAJA EXPERIENCIA LABORAL (BEL)-TUTOR',
    duracionHoras: 4,
    fechaInicio: '2025-09-20',
    fechaFin: '2025-09-20',
    modalidad: 'presencial',
    objetivos: 'Capacitar a tutores para el acompañamiento y formación de trabajadores con baja experiencia laboral.'
  },
  {
    id: 'course-4',
    codigo: 'BEL-004',
    nombre: 'PROGRAMA BAJA EXPERIENCIA LABORAL (BEL)-PARTICIPANTE',
    duracionHoras: 4,
    fechaInicio: '2025-09-22',
    fechaFin: '2025-09-22',
    modalidad: 'presencial',
    objetivos: 'Formar a trabajadores con baja experiencia laboral en competencias básicas y procedimientos de seguridad.'
  },
  {
    id: 'course-5',
    codigo: 'MINSUB-005',
    nombre: 'CONTROL DE RIESGOS MINERÍA SUBTERRÁNEA',
    duracionHoras: 8,
    fechaInicio: '2025-09-25',
    fechaFin: '2025-09-26',
    modalidad: 'presencial',
    objetivos: 'Identificar y controlar los riesgos específicos asociados a las operaciones de minería subterránea.'
  },
  {
    id: 'course-6',
    codigo: 'LIDER-006',
    nombre: 'LIDERAZGO SIGO SUPERVISORES EE.CC.',
    duracionHoras: 8,
    fechaInicio: '2025-09-28',
    fechaFin: '2025-09-29',
    modalidad: 'teams',
    objetivos: 'Desarrollar competencias de liderazgo en supervisores de empresas colaboradoras bajo el sistema SIGO.'
  },
  {
    id: 'course-7',
    codigo: 'CONF-007',
    nombre: 'ESPACIOS CONFINADOS',
    duracionHoras: 4,
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-01',
    modalidad: 'presencial',
    objetivos: 'Capacitar en procedimientos seguros para trabajo en espacios confinados y uso de equipos de protección.'
  },
  {
    id: 'course-8',
    codigo: 'TCAL-008',
    nombre: 'TRABAJO EN CALIENTE',
    duracionHoras: 4,
    fechaInicio: '2025-10-03',
    fechaFin: '2025-10-03',
    modalidad: 'presencial',
    objetivos: 'Establecer procedimientos seguros para trabajos en caliente y prevención de incendios.'
  },
  {
    id: 'course-9',
    codigo: 'ECF-009',
    nombre: 'ECF N° 22 INSTALACIONES INDUSTRIALES Y SUS ESTRUCTURAS',
    duracionHoras: 4,
    fechaInicio: '2025-10-05',
    fechaFin: '2025-10-05',
    modalidad: 'teams',
    objetivos: 'Conocer las normativas ECF N°22 para instalaciones industriales y sus estructuras de soporte.'
  },
  {
    id: 'course-10',
    codigo: 'SUST-010',
    nombre: 'MANEJO DE SUSTANCIAS PELIGROSAS',
    duracionHoras: 8,
    fechaInicio: '2025-10-08',
    fechaFin: '2025-10-09',
    modalidad: 'presencial',
    objetivos: 'Capacitar en el manejo seguro, almacenamiento y transporte de sustancias peligrosas.'
  },
  {
    id: 'course-11',
    codigo: 'GUARD-011',
    nombre: 'GUARDAS Y PROTECCIONES',
    duracionHoras: 8,
    fechaInicio: '2025-10-12',
    fechaFin: '2025-10-13',
    modalidad: 'presencial',
    objetivos: 'Implementar sistemas de guardas y protecciones en maquinaria y equipos industriales.'
  },
  {
    id: 'course-12',
    codigo: 'OBS-012',
    nombre: 'OBSERVADOR DE CONDUCTAS',
    duracionHoras: 4,
    fechaInicio: '2025-10-15',
    fechaFin: '2025-10-15',
    modalidad: 'teams',
    objetivos: 'Formar observadores de conductas seguras para la prevención de accidentes laborales.'
  },
  {
    id: 'course-13',
    codigo: 'GUIA-013',
    nombre: 'EQUIPO GUÍA',
    duracionHoras: 4,
    fechaInicio: '2025-10-18',
    fechaFin: '2025-10-18',
    modalidad: 'presencial',
    objetivos: 'Capacitar equipos guía para liderazgo en seguridad y procedimientos de emergencia.'
  },
  {
    id: 'course-14',
    codigo: 'ELEC-014',
    nombre: 'SEGURIDAD ELÉCTRICA G.1',
    duracionHoras: 16,
    fechaInicio: '2025-10-20',
    fechaFin: '2025-10-22',
    modalidad: 'presencial',
    objetivos: 'Capacitar en seguridad eléctrica nivel básico para trabajos con instalaciones de baja tensión.'
  },
  {
    id: 'course-15',
    codigo: 'ELEC-015',
    nombre: 'SEGURIDAD ELÉCTRICA G.2',
    duracionHoras: 16,
    fechaInicio: '2025-10-25',
    fechaFin: '2025-10-27',
    modalidad: 'presencial',
    objetivos: 'Capacitar en seguridad eléctrica nivel avanzado para trabajos con instalaciones de media y alta tensión.'
  },
  {
    id: 'course-16',
    codigo: 'RC04-016',
    nombre: 'RC 04 PÉRDIDA DE CONTROL DE ENERGÍA A ALTA INTENSIDAD (HIDRÁULICA Y NEUMÁTICA)',
    duracionHoras: 8,
    fechaInicio: '2025-10-30',
    fechaFin: '2025-10-31',
    modalidad: 'teams',
    objetivos: 'Prevenir accidentes por pérdida de control de energía en sistemas hidráulicos y neumáticos de alta intensidad.'
  },

  // TABLA 2: PROPIOS
  {
    id: 'course-17',
    codigo: 'PAUX-017',
    nombre: 'PRIMEROS AUXILIOS / USO Y MANEJO DE EXTINTORES',
    duracionHoras: 8,
    fechaInicio: '2025-11-05',
    fechaFin: '2025-11-06',
    modalidad: 'presencial',
    objetivos: 'Capacitar en técnicas de primeros auxilios y uso correcto de extintores para situaciones de emergencia.'
  },
  {
    id: 'course-18',
    codigo: 'AISL-018',
    nombre: 'AISLACIÓN Y BLOQUEO DE ENERGÍAS',
    duracionHoras: 8,
    fechaInicio: '2025-11-08',
    fechaFin: '2025-11-09',
    modalidad: 'presencial',
    objetivos: 'Implementar procedimientos de aislación y bloqueo de energías para trabajos de mantenimiento seguro.'
  },
  {
    id: 'course-19',
    codigo: 'FUND-019',
    nombre: 'MATERIALES FUNDIDOS',
    duracionHoras: 8,
    fechaInicio: '2025-11-12',
    fechaFin: '2025-11-13',
    modalidad: 'presencial',
    objetivos: 'Capacitar en el manejo seguro de materiales fundidos y procedimientos de fundición industrial.'
  },
  {
    id: 'course-20',
    codigo: 'BRIG-020',
    nombre: 'BRIGADISTAS RAJO',
    duracionHoras: 12,
    fechaInicio: '2025-11-15',
    fechaFin: '2025-11-17',
    modalidad: 'presencial',
    objetivos: 'Formar brigadistas especializados en operaciones de rajo abierto y procedimientos de emergencia minera.'
  },
  {
    id: 'course-21',
    codigo: 'ALT-021',
    nombre: 'TRABAJO EN ALTURA',
    duracionHoras: 16,
    fechaInicio: '2025-11-20',
    fechaFin: '2025-11-22',
    modalidad: 'presencial',
    objetivos: 'Capacitar en técnicas seguras de trabajo en altura y uso de equipos de protección anticaídas.'
  },
  {
    id: 'course-22',
    codigo: 'MONT-022',
    nombre: 'MONTACARGAS',
    duracionHoras: 16,
    fechaInicio: '2025-11-25',
    fechaFin: '2025-11-27',
    modalidad: 'presencial',
    objetivos: 'Formar operadores de montacargas en técnicas de operación segura y mantenimiento básico.'
  },
  {
    id: 'course-23',
    codigo: 'MINI-023',
    nombre: 'MINICARGADORES',
    duracionHoras: 16,
    fechaInicio: '2025-11-30',
    fechaFin: '2025-12-02',
    modalidad: 'presencial',
    objetivos: 'Capacitar operadores de minicargadores en técnicas de operación segura y eficiente.'
  },
  {
    id: 'course-24',
    codigo: 'RIGG-024',
    nombre: 'TÉCNICAS DE OPERACIÓN SEGURA DE PUENTES GRÚA E IZAJE DE CARGAS (RIGGER)',
    duracionHoras: 32,
    fechaInicio: '2025-12-05',
    fechaFin: '2025-12-10',
    modalidad: 'presencial',
    objetivos: 'Formar riggers especializados en operación de puentes grúa e izaje seguro de cargas pesadas.'
  },
  {
    id: 'course-25',
    codigo: 'INV-025',
    nombre: 'OPERACIÓN INVIERNO',
    duracionHoras: 2,
    fechaInicio: '2025-12-12',
    fechaFin: '2025-12-12',
    modalidad: 'teams',
    objetivos: 'Preparar a los trabajadores para operaciones seguras durante la temporada de invierno.'
  },
  {
    id: 'course-26',
    codigo: 'REGL-026',
    nombre: 'REGLAMENTO INTERNO Y MANEJO A LA DEFENSIVA-LICENCIA POR PRIMERA VEZ',
    duracionHoras: 8,
    fechaInicio: '2025-12-15',
    fechaFin: '2025-12-16',
    modalidad: 'presencial',
    objetivos: 'Capacitar en reglamento interno de tránsito y técnicas de manejo defensivo para nuevos conductores.'
  },
  {
    id: 'course-27',
    codigo: '4X4-027',
    nombre: 'CONDUCCIÓN 4X4 DET',
    duracionHoras: 16,
    fechaInicio: '2025-12-18',
    fechaFin: '2025-12-20',
    modalidad: 'presencial',
    objetivos: 'Formar conductores especializados en vehículos 4x4 para operaciones en terreno difícil.'
  },
  {
    id: 'course-28',
    codigo: 'TMERT-028',
    nombre: 'TMERT CPHS - SINDICATOS',
    duracionHoras: 8,
    fechaInicio: '2025-12-22',
    fechaFin: '2025-12-23',
    modalidad: 'teams',
    objetivos: 'Capacitar a representantes de CPHS y sindicatos en TMERT (Taller de Manejo de Emergencias y Rescate en Terreno).'
  },
  {
    id: 'course-29',
    codigo: 'TMERT-029',
    nombre: 'TMERT TRABAJADORES - SUPERVISORES',
    duracionHoras: 8,
    fechaInicio: '2025-12-25',
    fechaFin: '2025-12-26',
    modalidad: 'presencial',
    objetivos: 'Capacitar a trabajadores y supervisores en técnicas de manejo de emergencias y rescate en terreno.'
  },
  {
    id: 'course-30',
    codigo: 'TMERT-030',
    nombre: 'TMERT JEFATURAS',
    duracionHoras: 16,
    fechaInicio: '2025-12-28',
    fechaFin: '2025-12-30',
    modalidad: 'presencial',
    objetivos: 'Formar jefaturas en liderazgo de emergencias y coordinación de operaciones de rescate en terreno.'
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
    nombre: 'María Elena Rodríguez Silva',
    rut: '98.765.432-5',
    contractor: 'Constructora XYZ S.A.',
    asistencia: 88,
    nota: 6.2,
    estado: 'aprobado'
  },
  {
    id: 'participant-3',
    sessionId: 'session-1',
    nombre: 'Carlos Alberto Muñoz Torres',
    rut: '15.678.234-3',
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