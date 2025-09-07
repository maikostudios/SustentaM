import Dexie, { Table } from 'dexie';
import { User, Course, Session, Seat, Participant, Certificate } from '../types';
import { mockUsers, mockCourses, mockSessions, mockParticipants } from './mockData';
import { logger } from '../utils/logger';

export class AppDB extends Dexie {
  users!: Table<User, string>;
  courses!: Table<Course, string>;
  sessions!: Table<Session, string>;
  seats!: Table<Seat, string>;
  participants!: Table<Participant, string>;
  certificates!: Table<Certificate, string>;

  constructor() {
    super('CourseManagementDB');
    this.version(1).stores({
      users: 'id, rut, rol',
      courses: 'id, codigo, nombre',
      sessions: 'id, courseId, fecha',
      seats: 'id, sessionId, participantId',
      participants: 'id, sessionId, rut',
      certificates: 'id, participantId, courseId'
    });
  }
}

export const db = new AppDB();

// Function to clear all data (useful for development)
export async function clearDatabase() {
  try {
    await db.transaction('rw', [db.users, db.courses, db.sessions, db.seats, db.participants, db.certificates], async () => {
      await db.users.clear();
      await db.courses.clear();
      await db.sessions.clear();
      await db.seats.clear();
      await db.participants.clear();
      await db.certificates.clear();
    });
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

// Initialize with sample data
export async function initializeData() {
  try {
    // Verificar si ya hay datos
    const [userCount, courseCount, sessionCount, participantCount] = await Promise.all([
      db.users.count(),
      db.courses.count(),
      db.sessions.count(),
      db.participants.count()
    ]);

    logger.info('Database', 'Verificando estado de la base de datos', { userCount, courseCount, sessionCount, participantCount });
    console.log('Database counts:', { userCount, courseCount, sessionCount, participantCount });

    // FORZAR REINICIALIZACIÓN DE USUARIOS para debug
    if (userCount < mockUsers.length) {
      logger.warn('Database', 'Reinicializando usuarios - count insuficiente', {
        currentCount: userCount,
        expectedCount: mockUsers.length
      });
      console.log('Reinicializando usuarios - count insuficiente');
      await db.users.clear();
      await db.users.bulkAdd(mockUsers);
      logger.info('Database', 'Usuarios reinicializados correctamente', { count: mockUsers.length });
      console.log('Users reinitialized with', mockUsers.length, 'users');
    }

    // Si ya hay datos suficientes, no inicializar el resto
    if (courseCount > 0 && sessionCount > 0 && participantCount > 0) {
      console.log('Database already contains sufficient data, skipping course initialization');
      return;
    }

    // Inicializar cada tabla por separado para mejor manejo de errores
    try {
      if (userCount === 0) {
        await db.users.bulkAdd(mockUsers);
        console.log('Users initialized');
      }
    } catch (error) {
      console.warn('Error adding users:', error);
    }

    try {
      if (courseCount === 0) {
        await db.courses.bulkAdd(mockCourses);
        console.log('Courses initialized');
      }
    } catch (error) {
      console.warn('Error adding courses:', error);
    }

    try {
      if (sessionCount === 0) {
        await db.sessions.bulkAdd(mockSessions);
        console.log('Sessions initialized');
      }
    } catch (error) {
      console.warn('Error adding sessions:', error);
    }

    try {
      if (participantCount === 0) {
        await db.participants.bulkAdd(mockParticipants);
        console.log('Participants initialized');
      }
    } catch (error) {
      console.warn('Error adding participants:', error);
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.warn('Error during database initialization:', error);
  }
}

// Function to reset database with fresh data
export async function resetDatabase() {
  try {
    await clearDatabase();
    await initializeData();
    console.log('Database reset completed');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}