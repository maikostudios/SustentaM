import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeConfig {
  theme: Theme;
  systemPreference: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
  transitions: boolean;
  highContrast: boolean;
}

const THEME_STORAGE_KEY = 'app-theme-config';
const THEME_TRANSITION_DURATION = 300;

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>({
    theme: 'auto',
    systemPreference: 'light',
    effectiveTheme: 'light',
    transitions: true,
    highContrast: false
  });

  const [isChanging, setIsChanging] = useState(false);

  // Detectar preferencia del sistema
  const detectSystemPreference = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Calcular tema efectivo
  const calculateEffectiveTheme = useCallback((theme: Theme, systemPreference: 'light' | 'dark'): 'light' | 'dark' => {
    if (theme === 'auto') {
      return systemPreference;
    }
    return theme;
  }, []);

  // Aplicar tema al DOM
  const applyTheme = useCallback((effectiveTheme: 'light' | 'dark', transitions: boolean, highContrast: boolean) => {
    const root = document.documentElement;
    
    // Aplicar/remover clase de transiciones
    if (transitions) {
      root.style.setProperty('--theme-transition-duration', `${THEME_TRANSITION_DURATION}ms`);
      root.classList.add('theme-transitions');
    } else {
      root.classList.remove('theme-transitions');
    }

    // Aplicar tema
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Aplicar alto contraste
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Actualizar meta theme-color para navegadores móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = effectiveTheme === 'dark' ? '#0f172a' : '#ffffff';
      document.head.appendChild(meta);
    }
  }, []);

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem(THEME_STORAGE_KEY);
    const systemPreference = detectSystemPreference();
    
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        const effectiveTheme = calculateEffectiveTheme(parsed.theme, systemPreference);
        
        setConfig({
          ...parsed,
          systemPreference,
          effectiveTheme
        });
        
        applyTheme(effectiveTheme, parsed.transitions, parsed.highContrast);
      } catch (error) {
        console.error('Error loading theme config:', error);
        // Usar configuración por defecto
        const effectiveTheme = calculateEffectiveTheme('auto', systemPreference);
        setConfig(prev => ({
          ...prev,
          systemPreference,
          effectiveTheme
        }));
        applyTheme(effectiveTheme, true, false);
      }
    } else {
      // Primera carga - usar configuración por defecto
      const effectiveTheme = calculateEffectiveTheme('auto', systemPreference);
      setConfig(prev => ({
        ...prev,
        systemPreference,
        effectiveTheme
      }));
      applyTheme(effectiveTheme, true, false);
    }
  }, [detectSystemPreference, calculateEffectiveTheme, applyTheme]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemPreference = e.matches ? 'dark' : 'light';
      const newEffectiveTheme = calculateEffectiveTheme(config.theme, newSystemPreference);
      
      setConfig(prev => ({
        ...prev,
        systemPreference: newSystemPreference,
        effectiveTheme: newEffectiveTheme
      }));
      
      applyTheme(newEffectiveTheme, config.transitions, config.highContrast);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config.theme, config.transitions, config.highContrast, calculateEffectiveTheme, applyTheme]);

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
      theme: config.theme,
      transitions: config.transitions,
      highContrast: config.highContrast
    }));
  }, [config.theme, config.transitions, config.highContrast]);

  // Cambiar tema
  const setTheme = useCallback(async (newTheme: Theme) => {
    setIsChanging(true);
    
    const newEffectiveTheme = calculateEffectiveTheme(newTheme, config.systemPreference);
    
    setConfig(prev => ({
      ...prev,
      theme: newTheme,
      effectiveTheme: newEffectiveTheme
    }));
    
    applyTheme(newEffectiveTheme, config.transitions, config.highContrast);
    
    // Esperar a que termine la transición
    if (config.transitions) {
      await new Promise(resolve => setTimeout(resolve, THEME_TRANSITION_DURATION));
    }
    
    setIsChanging(false);
  }, [config.systemPreference, config.transitions, config.highContrast, calculateEffectiveTheme, applyTheme]);

  // Toggle entre light y dark (ignora auto)
  const toggleTheme = useCallback(async () => {
    const newTheme = config.effectiveTheme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  }, [config.effectiveTheme, setTheme]);

  // Configurar transiciones
  const setTransitions = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, transitions: enabled }));
    applyTheme(config.effectiveTheme, enabled, config.highContrast);
  }, [config.effectiveTheme, config.highContrast, applyTheme]);

  // Configurar alto contraste
  const setHighContrast = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, highContrast: enabled }));
    applyTheme(config.effectiveTheme, config.transitions, enabled);
  }, [config.effectiveTheme, config.transitions, applyTheme]);

  // Obtener colores del tema actual
  const getThemeColors = useCallback(() => {
    const isDark = config.effectiveTheme === 'dark';
    
    return {
      background: {
        primary: isDark ? '#0f172a' : '#ffffff',
        secondary: isDark ? '#1e293b' : '#f8fafc',
        tertiary: isDark ? '#334155' : '#f1f5f9'
      },
      text: {
        primary: isDark ? '#f8fafc' : '#1f2937',
        secondary: isDark ? '#e2e8f0' : '#6b7280',
        muted: isDark ? '#94a3b8' : '#9ca3af'
      },
      border: {
        primary: isDark ? '#334155' : '#e5e7eb',
        secondary: isDark ? '#475569' : '#d1d5db'
      },
      accent: {
        primary: isDark ? '#3b82f6' : '#2563eb',
        success: isDark ? '#10b981' : '#059669',
        warning: isDark ? '#f59e0b' : '#d97706',
        error: isDark ? '#ef4444' : '#dc2626'
      }
    };
  }, [config.effectiveTheme]);

  // Verificar si un color tiene buen contraste
  const hasGoodContrast = useCallback((foreground: string, background: string): boolean => {
    // Función simplificada - en producción usar una librería como chroma-js
    const getLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(foreground);
    const lum2 = getLuminance(background);
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    
    return ratio >= 4.5; // WCAG AA standard
  }, []);

  return {
    // Estado actual
    theme: config.theme,
    effectiveTheme: config.effectiveTheme,
    systemPreference: config.systemPreference,
    transitions: config.transitions,
    highContrast: config.highContrast,
    isChanging,
    
    // Funciones de control
    setTheme,
    toggleTheme,
    setTransitions,
    setHighContrast,
    
    // Utilidades
    getThemeColors,
    hasGoodContrast,
    isDark: config.effectiveTheme === 'dark',
    isLight: config.effectiveTheme === 'light',
    isAuto: config.theme === 'auto'
  };
}

// Hook para componentes que necesitan reaccionar a cambios de tema
export function useThemeAware() {
  const { effectiveTheme, getThemeColors, isDark, isLight } = useTheme();
  
  return {
    theme: effectiveTheme,
    colors: getThemeColors(),
    isDark,
    isLight,
    // Clases CSS condicionales
    bg: isDark ? 'bg-dark-primary' : 'bg-white',
    bgSecondary: isDark ? 'bg-dark-secondary' : 'bg-gray-50',
    text: isDark ? 'text-dark-primary' : 'text-gray-900',
    textSecondary: isDark ? 'text-dark-secondary' : 'text-gray-600',
    textMuted: isDark ? 'text-dark-muted' : 'text-gray-500',
    border: isDark ? 'border-dark-border' : 'border-gray-200',
    borderLight: isDark ? 'border-dark-border-light' : 'border-gray-300'
  };
}
