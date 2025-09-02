import { useEffect, useCallback, useState, useRef } from 'react';

// Hook para gestión de foco
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const moveFocus = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    
    let nextIndex: number;
    
    switch (direction) {
      case 'next':
        nextIndex = currentIndex + 1;
        if (nextIndex >= focusableElements.length) nextIndex = 0;
        break;
      case 'previous':
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = focusableElements.length - 1;
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = focusableElements.length - 1;
        break;
      default:
        return;
    }

    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
    }
  }, []);

  return {
    focusedElement,
    saveFocus,
    restoreFocus,
    trapFocus,
    moveFocus
  };
}

// Hook para navegación por teclado
export function useKeyboardNavigation(options: {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  enabled?: boolean;
} = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          options.onEscape?.();
          break;
        case 'Enter':
          if (event.target === document.activeElement) {
            options.onEnter?.();
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          options.onArrowRight?.();
          break;
        case 'Home':
          event.preventDefault();
          options.onHome?.();
          break;
        case 'End':
          event.preventDefault();
          options.onEnd?.();
          break;
        case 'PageUp':
          event.preventDefault();
          options.onPageUp?.();
          break;
        case 'PageDown':
          event.preventDefault();
          options.onPageDown?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, options]);
}

// Hook para anuncios de lector de pantalla
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Crear elemento temporal para anuncio
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover después de un tiempo
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  const announceNavigation = useCallback((from: string, to: string) => {
    announce(`Navegando de ${from} a ${to}`, 'polite');
  }, [announce]);

  const announceAction = useCallback((action: string, result?: string) => {
    const message = result ? `${action}: ${result}` : action;
    announce(message, 'assertive');
  }, [announce]);

  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((success: string) => {
    announce(`Éxito: ${success}`, 'polite');
  }, [announce]);

  return {
    announce,
    announceNavigation,
    announceAction,
    announceError,
    announceSuccess,
    announcements
  };
}

// Hook para detección de preferencias de accesibilidad
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersLargeText: false,
    prefersColorScheme: 'light' as 'light' | 'dark'
  });

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersLargeText: window.matchMedia('(prefers-reduced-data: reduce)').matches,
        prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      });
    };

    updatePreferences();

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-reduced-data: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  return preferences;
}

// Hook para validación de contraste de colores
export function useColorContrast() {
  const calculateContrast = useCallback((color1: string, color2: string): number => {
    // Función simplificada para calcular contraste
    // En una implementación real, usarías una librería como chroma-js
    const getLuminance = (color: string): number => {
      // Convertir color hex a RGB y calcular luminancia
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  const checkContrast = useCallback((foreground: string, background: string) => {
    const ratio = calculateContrast(foreground, background);
    
    return {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      passesAALarge: ratio >= 3,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'
    };
  }, [calculateContrast]);

  return { checkContrast, calculateContrast };
}

// Hook para gestión de regiones ARIA
export function useAriaRegions() {
  const [regions, setRegions] = useState<Map<string, HTMLElement>>(new Map());

  const registerRegion = useCallback((id: string, element: HTMLElement, label?: string) => {
    element.setAttribute('role', 'region');
    element.setAttribute('aria-labelledby', `${id}-heading`);
    if (label) {
      element.setAttribute('aria-label', label);
    }
    
    setRegions(prev => new Map(prev).set(id, element));
  }, []);

  const unregisterRegion = useCallback((id: string) => {
    setRegions(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const navigateToRegion = useCallback((id: string) => {
    const element = regions.get(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [regions]);

  return {
    registerRegion,
    unregisterRegion,
    navigateToRegion,
    regions: Array.from(regions.keys())
  };
}

// Hook para skip links
export function useSkipLinks() {
  const [skipLinks, setSkipLinks] = useState<Array<{ id: string; label: string; target: string }>>([]);

  const addSkipLink = useCallback((id: string, label: string, target: string) => {
    setSkipLinks(prev => [...prev.filter(link => link.id !== id), { id, label, target }]);
  }, []);

  const removeSkipLink = useCallback((id: string) => {
    setSkipLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const skipToTarget = useCallback((target: string) => {
    const element = document.querySelector(target) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return {
    skipLinks,
    addSkipLink,
    removeSkipLink,
    skipToTarget
  };
}
