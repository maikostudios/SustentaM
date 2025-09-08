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
    theme: 'dark',
    systemPreference: 'dark',
    effectiveTheme: 'dark',
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

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Forzar modo oscuro independientemente de la configuración guardada
        const effectiveTheme = 'dark';

        setConfig({
          theme: 'dark',
          systemPreference: 'dark',
          effectiveTheme: 'dark',
          transitions: parsed.transitions || true,
          highContrast: parsed.highContrast || false
        });

        applyTheme(effectiveTheme, parsed.transitions || true, parsed.highContrast || false);
      } catch (error) {
        console.error('Error loading theme config:', error);
        // Usar configuración por defecto - modo oscuro
        setConfig(prev => ({
          ...prev,
          theme: 'dark',
          systemPreference: 'dark',
          effectiveTheme: 'dark'
        }));
        applyTheme('dark', true, false);
      }
    } else {
      // Primera carga - forzar modo oscuro
      setConfig(prev => ({
        ...prev,
        theme: 'dark',
        systemPreference: 'dark',
        effectiveTheme: 'dark'
      }));
      applyTheme('dark', true, false);
    }
  }, [applyTheme]);

  // Listener de cambios del sistema DESACTIVADO - solo modo oscuro
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //
  //   const handleChange = (e: MediaQueryListEvent) => {
  //     // No hacer nada - mantener siempre modo oscuro
  //   };
  //
  //   mediaQuery.addEventListener('change', handleChange);
  //   return () => mediaQuery.removeEventListener('change', handleChange);
  // }, []);

  // Guardar configuración cuando cambie - FORZADO A MODO OSCURO
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
      theme: 'dark',
      transitions: config.transitions,
      highContrast: config.highContrast
    }));
  }, [config.transitions, config.highContrast]);

  // Cambiar tema - FORZADO A MODO OSCURO
  const setTheme = useCallback(async (newTheme: Theme) => {
    setIsChanging(true);

    // Siempre forzar modo oscuro independientemente del tema solicitado
    const forcedTheme = 'dark';

    setConfig(prev => ({
      ...prev,
      theme: 'dark',
      effectiveTheme: 'dark'
    }));

    applyTheme('dark', config.transitions, config.highContrast);

    // Esperar a que termine la transición
    if (config.transitions) {
      await new Promise(resolve => setTimeout(resolve, THEME_TRANSITION_DURATION));
    }

    setIsChanging(false);
  }, [config.transitions, config.highContrast, applyTheme]);

  // Toggle entre light y dark - DESACTIVADO (siempre oscuro)
  const toggleTheme = useCallback(async () => {
    // No hacer nada - mantener siempre modo oscuro
    console.log('Toggle theme desactivado - manteniendo modo oscuro');
  }, []);

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
