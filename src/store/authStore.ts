import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

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
        // Import mock users from database
        const { db } = await import('../lib/database');
        const mockUsers = await db.users.toArray();
        
        const user = mockUsers.find(u => u.rut === usuario && u.clave === clave);
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);