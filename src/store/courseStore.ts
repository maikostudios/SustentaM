import { create } from 'zustand';
import { Course, Session, Participant } from '../types';
import { db } from '../lib/database';

interface CourseState {
  courses: Course[];
  sessions: Session[];
  participants: Participant[];
  loading: boolean;
  
  fetchCourses: () => Promise<void>;
  loadCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  fetchSessions: (courseId?: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  fetchParticipants: (courseId?: string) => Promise<void>;
  fetchParticipantsBySession: (sessionId: string) => Promise<void>;
  addParticipants: (sessionId: string, participants: Array<{nombre: string; rut: string; contractor: string}>) => Promise<void>;
  updateAttendance: (participantId: string, asistencia: number, nota: number) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  sessions: [],
  participants: [],
  loading: false,
  
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const courses = await db.courses.toArray();
      set({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadCourses: async () => {
    set({ loading: true });
    try {
      const courses = await db.courses.toArray();
      set({ courses });
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      set({ loading: false });
    }
  },

  addCourse: async (courseData) => {
    const course: Course = {
      ...courseData,
      id: crypto.randomUUID()
    };
    
    await db.courses.add(course);
    
    // Generate sessions for course dates
    const sessions = generateSessionsForCourse(course);
    await db.sessions.bulkAdd(sessions);
    
    get().fetchCourses();
  },
  
  updateCourse: async (id, updates) => {
    await db.courses.update(id, updates);
    get().fetchCourses();
  },
  
  deleteCourse: async (id) => {
    await db.courses.delete(id);
    await db.sessions.where('courseId').equals(id).delete();
    get().fetchCourses();
  },
  
  fetchSessions: async (courseId) => {
    const query = courseId ? db.sessions.where('courseId').equals(courseId) : db.sessions;
    const sessions = await query.toArray();
    set({ sessions });
  },

  loadSessions: async () => {
    const sessions = await db.sessions.toArray();
    // Agregar conteo de inscritos a cada sesión
    const sessionsWithCount = await Promise.all(
      sessions.map(async (session) => {
        const enrolledCount = await db.participants.where('sessionId').equals(session.id).count();
        return { ...session, enrolledCount };
      })
    );
    set({ sessions: sessionsWithCount });
  },

  fetchParticipants: async (courseId) => {
    if (courseId) {
      const sessions = await db.sessions.where('courseId').equals(courseId).toArray();
      const sessionIds = sessions.map(s => s.id);
      const participants = await db.participants.where('sessionId').anyOf(sessionIds).toArray();
      set({ participants });
    } else {
      const participants = await db.participants.toArray();
      set({ participants });
    }
  },

  fetchParticipantsBySession: async (sessionId) => {
    const participants = await db.participants.where('sessionId').equals(sessionId).toArray();
    set({ participants });
  },
  
  addParticipants: async (sessionId, participantsData) => {
    const participants: Participant[] = participantsData.map(p => ({
      id: crypto.randomUUID(),
      sessionId,
      ...p,
      asistencia: 0,
      nota: 0,
      estado: 'inscrito'
    }));

    await db.participants.bulkAdd(participants);
    // No llamamos fetchParticipants aquí para evitar conflictos
    // El componente se encarga de actualizar los datos específicos
  },
  
  updateAttendance: async (participantId, asistencia, nota) => {
    const estado = asistencia >= 50 && nota >= 4.0 ? 'aprobado' : 'reprobado';
    await db.participants.update(participantId, { asistencia, nota, estado });
    get().fetchParticipants();
  }
}));

function generateSessionsForCourse(course: Course): Session[] {
  const sessions: Session[] = [];
  const startDate = new Date(course.fechaInicio.split('-').reverse().join('-'));
  const endDate = new Date(course.fechaFin.split('-').reverse().join('-'));
  
  const capacity = course.modalidad === 'teams' ? 200 : 30;
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Skip weekends for in-person courses
    if (course.modalidad === 'presencial' && (d.getDay() === 0 || d.getDay() === 6)) {
      continue;
    }
    
    sessions.push({
      id: crypto.randomUUID(),
      courseId: course.id,
      fecha: d.toISOString().split('T')[0].split('-').reverse().join('-'),
      capacity,
      seats: Array.from({ length: capacity }, (_, i) => ({
        id: crypto.randomUUID(),
        sessionId: '', // Will be set after session creation
        estado: 'libre'
      }))
    });
  }
  
  return sessions;
}