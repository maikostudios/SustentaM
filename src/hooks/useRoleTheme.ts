import { useAuthStore } from '../store/authStore';
import { useThemeAware } from './useTheme';

interface RoleThemeColors {
  // Colores de fondo
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  
  // Colores de texto
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Colores de borde
  border: string;
  borderLight: string;
  
  // Colores de acento
  accent: string;
  accentHover: string;
  accentLight: string;
  
  // Colores específicos del rol
  primary: string;
  primaryHover: string;
  primaryLight: string;
}

/**
 * Hook que proporciona colores de tema basados en el rol del usuario
 */
export function useRoleTheme(): RoleThemeColors {
  const { user } = useAuthStore();
  const baseTheme = useThemeAware();
  
  // Colores base que se mantienen iguales para todos los roles
  const baseColors = {
    text: baseTheme.text,
    textSecondary: baseTheme.textSecondary,
    textMuted: baseTheme.textMuted,
    border: baseTheme.border,
    borderLight: baseTheme.borderLight,
  };
  
  // Definir colores según el rol
  switch (user?.rol) {
    case 'administrador':
      // ADMIN - Mantener colores actuales (azul)
      return {
        ...baseColors,
        bg: baseTheme.isDark ? 'bg-slate-900' : 'bg-white',
        bgSecondary: baseTheme.isDark ? 'bg-slate-800' : 'bg-gray-50',
        bgTertiary: baseTheme.isDark ? 'bg-slate-700' : 'bg-gray-100',
        accent: 'text-blue-600',
        accentHover: 'text-blue-700',
        accentLight: 'text-blue-500',
        primary: baseTheme.isDark ? 'bg-blue-900' : 'bg-blue-600',
        primaryHover: baseTheme.isDark ? 'bg-blue-800' : 'bg-blue-700',
        primaryLight: baseTheme.isDark ? 'bg-blue-900/50' : 'bg-blue-50',
      };
      
    case 'contratista':
      // EMPRESA - Celeste (#007fd1, #b7ddff, #f1f2f2)
      return {
        ...baseColors,
        bg: baseTheme.isDark ? 'bg-slate-900' : 'bg-gray-50', // #f1f2f2 aproximado
        bgSecondary: baseTheme.isDark ? 'bg-slate-800' : 'bg-sky-50', // #b7ddff aproximado
        bgTertiary: baseTheme.isDark ? 'bg-slate-700' : 'bg-sky-100',
        accent: 'text-sky-600', // #007fd1 aproximado
        accentHover: 'text-sky-700',
        accentLight: 'text-sky-500',
        primary: baseTheme.isDark ? 'bg-sky-900' : 'bg-sky-600', // #007fd1
        primaryHover: baseTheme.isDark ? 'bg-sky-800' : 'bg-sky-700',
        primaryLight: baseTheme.isDark ? 'bg-sky-900/50' : 'bg-sky-50', // #b7ddff aproximado
      };
      
    case 'usuario':
      // PARTICIPANTE - Morado (#443f9a)
      return {
        ...baseColors,
        bg: baseTheme.isDark ? 'bg-slate-900' : 'bg-white',
        bgSecondary: baseTheme.isDark ? 'bg-slate-800' : 'bg-purple-50',
        bgTertiary: baseTheme.isDark ? 'bg-slate-700' : 'bg-purple-100',
        accent: 'text-purple-600', // #443f9a aproximado
        accentHover: 'text-purple-700',
        accentLight: 'text-purple-500',
        primary: baseTheme.isDark ? 'bg-purple-900' : 'bg-purple-600', // #443f9a
        primaryHover: baseTheme.isDark ? 'bg-purple-800' : 'bg-purple-700',
        primaryLight: baseTheme.isDark ? 'bg-purple-900/50' : 'bg-purple-50',
      };
      
    default:
      // Fallback a colores por defecto
      return {
        ...baseColors,
        bg: baseTheme.bg,
        bgSecondary: baseTheme.bgSecondary,
        bgTertiary: baseTheme.isDark ? 'bg-slate-700' : 'bg-gray-100',
        accent: 'text-gray-600',
        accentHover: 'text-gray-700',
        accentLight: 'text-gray-500',
        primary: baseTheme.isDark ? 'bg-gray-900' : 'bg-gray-600',
        primaryHover: baseTheme.isDark ? 'bg-gray-800' : 'bg-gray-700',
        primaryLight: baseTheme.isDark ? 'bg-gray-900/50' : 'bg-gray-50',
      };
  }
}

/**
 * Hook que proporciona clases CSS específicas para el navbar según el rol
 */
export function useRoleNavbarTheme() {
  const { user } = useAuthStore();
  const baseTheme = useThemeAware();
  
  switch (user?.rol) {
    case 'administrador':
      // ADMIN - Azul (mantener actual)
      return {
        navbar: baseTheme.isDark 
          ? 'bg-blue-900 border-blue-800' 
          : 'bg-blue-600 border-blue-700',
        text: 'text-white',
        textSecondary: 'text-blue-100',
        textMuted: 'text-blue-200',
      };
      
    case 'contratista':
      // EMPRESA - Celeste
      return {
        navbar: baseTheme.isDark 
          ? 'bg-sky-900 border-sky-800' 
          : 'bg-sky-600 border-sky-700', // #007fd1 aproximado
        text: 'text-white',
        textSecondary: 'text-sky-100',
        textMuted: 'text-sky-200',
      };
      
    case 'usuario':
      // PARTICIPANTE - Morado
      return {
        navbar: baseTheme.isDark 
          ? 'bg-purple-900 border-purple-800' 
          : 'bg-purple-600 border-purple-700', // #443f9a aproximado
        text: 'text-white',
        textSecondary: 'text-purple-100',
        textMuted: 'text-purple-200',
      };
      
    default:
      return {
        navbar: baseTheme.isDark 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-gray-600 border-gray-700',
        text: 'text-white',
        textSecondary: 'text-gray-100',
        textMuted: 'text-gray-200',
      };
  }
}

/**
 * Hook que proporciona el color de fondo principal de la aplicación según el rol
 */
export function useRoleBackgroundTheme() {
  const { user } = useAuthStore();
  const baseTheme = useThemeAware();
  
  switch (user?.rol) {
    case 'administrador':
      // ADMIN - Mantener actual
      return baseTheme.isDark ? 'bg-slate-900' : 'bg-gray-50';
      
    case 'contratista':
      // EMPRESA - Fondo gris claro (#f1f2f2)
      return baseTheme.isDark ? 'bg-slate-900' : 'bg-gray-100';
      
    case 'usuario':
      // PARTICIPANTE - Fondo con tinte morado muy sutil
      return baseTheme.isDark ? 'bg-slate-900' : 'bg-purple-50';
      
    default:
      return baseTheme.bg;
  }
}
