import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { logger } from '../utils/logger';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (usuario: string, clave: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (usuario: string, clave: string) => {
        logger.info('AuthStore', 'Iniciando proceso de login', { usuario });

        try {
          // Import mock users from database
          logger.debug('AuthStore', 'Importando base de datos');
          const { db } = await import('../lib/database');

          logger.debug('AuthStore', 'Obteniendo usuarios de la base de datos');
          const mockUsers = await db.users.toArray();
          logger.debug('AuthStore', 'Usuarios encontrados en BD', {
            count: mockUsers.length,
            users: mockUsers.map(u => ({ rut: u.rut, rol: u.rol, nombre: u.nombre }))
          });

          // Log detallado de todos los usuarios para debug
          mockUsers.forEach(user => {
            logger.debug('AuthStore', `Usuario en BD: ${user.rut} (${user.rol}) - ${user.nombre}`);
          });

          logger.debug('AuthStore', 'Buscando usuario con credenciales', { usuario, clave });
          const user = mockUsers.find(u => u.rut === usuario && u.clave === clave);

          if (user) {
            logger.info('AuthStore', 'Usuario encontrado, estableciendo sesión', { userId: user.id, rol: user.rol });
            set({ user, isAuthenticated: true });
            return true;
          } else {
            logger.warn('AuthStore', 'Usuario no encontrado con esas credenciales');
            return false;
          }
        } catch (error) {
          logger.error('AuthStore', 'Error durante el proceso de login', error);
          return false;
        }
      },
      
      logout: () => {
        logger.info('AuthStore', 'Cerrando sesión de usuario');

        // Limpiar estado de autenticación
        set({ user: null, isAuthenticated: false });

        // Limpiar localStorage (Zustand persist lo maneja automáticamente)
        // Pero podemos limpiar otros datos si es necesario
        try {
          // Limpiar cualquier otro dato de sesión si existe
          localStorage.removeItem('theme-preference');
          localStorage.removeItem('user-preferences');
        } catch (error) {
          logger.warn('AuthStore', 'Error limpiando localStorage', error);
        }

        // Forzar recarga de la página para asegurar estado limpio
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);