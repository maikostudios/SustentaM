import { useState, useCallback, useEffect } from 'react';
import { useForm, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Hook para validación en tiempo real
export function useRealTimeValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options?: {
    mode?: 'onChange' | 'onBlur' | 'onSubmit';
    reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
    delayMs?: number;
  }
): UseFormReturn<T> & {
  validateField: (field: Path<T>, value: any) => Promise<string | undefined>;
  isFieldValid: (field: Path<T>) => boolean;
  getFieldError: (field: Path<T>) => string | undefined;
} {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: options?.mode || 'onChange',
    reValidateMode: options?.reValidateMode || 'onChange'
  });

  const [fieldValidationStates, setFieldValidationStates] = useState<
    Record<string, { isValid: boolean; error?: string }>
  >({});

  // Validar campo individual
  const validateField = useCallback(async (field: Path<T>, value: any): Promise<string | undefined> => {
    try {
      // Crear objeto parcial para validación
      const partialData = { [field]: value } as Partial<T>;
      
      // Validar solo el campo específico
      const fieldSchema = schema.pick({ [field]: true } as any);
      await fieldSchema.parseAsync(partialData);
      
      setFieldValidationStates(prev => ({
        ...prev,
        [field]: { isValid: true }
      }));
      
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(field as string));
        const errorMessage = fieldError?.message || 'Error de validación';
        
        setFieldValidationStates(prev => ({
          ...prev,
          [field]: { isValid: false, error: errorMessage }
        }));
        
        return errorMessage;
      }
      return 'Error de validación';
    }
  }, [schema]);

  // Verificar si un campo es válido
  const isFieldValid = useCallback((field: Path<T>): boolean => {
    return fieldValidationStates[field]?.isValid ?? false;
  }, [fieldValidationStates]);

  // Obtener error de un campo
  const getFieldError = useCallback((field: Path<T>): string | undefined => {
    return fieldValidationStates[field]?.error;
  }, [fieldValidationStates]);

  return {
    ...form,
    validateField,
    isFieldValid,
    getFieldError
  };
}

// Hook para validación de RUT chileno mejorada
export function useRutValidation() {
  const [rutState, setRutState] = useState({
    value: '',
    formatted: '',
    isValid: false,
    error: '',
    isValidating: false
  });

  const validateRut = useCallback(async (rut: string): Promise<{
    isValid: boolean;
    error: string;
    formatted: string;
  }> => {
    if (!rut.trim()) {
      return {
        isValid: false,
        error: 'RUT es requerido',
        formatted: ''
      };
    }

    // Limpiar RUT
    const cleaned = rut.replace(/[^0-9Kk]/g, '').toUpperCase();
    
    if (cleaned.length < 2) {
      return {
        isValid: false,
        error: 'RUT incompleto',
        formatted: rut
      };
    }

    if (cleaned.length < 8) {
      return {
        isValid: false,
        error: 'RUT debe tener al menos 7 dígitos más el dígito verificador',
        formatted: rut
      };
    }

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Validar que el cuerpo sean solo números
    if (!/^\d+$/.test(body)) {
      return {
        isValid: false,
        error: 'El cuerpo del RUT debe contener solo números',
        formatted: rut
      };
    }

    // Calcular dígito verificador
    let sum = 0;
    let factor = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }

    const remainder = sum % 11;
    let calculatedDv = 11 - remainder;

    if (calculatedDv === 11) calculatedDv = 0;
    else if (calculatedDv === 10) calculatedDv = 'K';

    const isValid = calculatedDv.toString() === dv;

    // Formatear RUT
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;

    return {
      isValid,
      error: isValid ? '' : 'Dígito verificador incorrecto',
      formatted
    };
  }, []);

  const handleRutChange = useCallback(async (value: string) => {
    setRutState(prev => ({ ...prev, value, isValidating: true }));

    const result = await validateRut(value);
    
    setRutState({
      value,
      formatted: result.formatted,
      isValid: result.isValid,
      error: result.error,
      isValidating: false
    });

    return result;
  }, [validateRut]);

  const resetRut = useCallback(() => {
    setRutState({
      value: '',
      formatted: '',
      isValid: false,
      error: '',
      isValidating: false
    });
  }, []);

  return {
    ...rutState,
    handleRutChange,
    validateRut,
    resetRut
  };
}

// Hook para validación de email mejorada
export function useEmailValidation() {
  const validateEmail = useCallback((email: string): {
    isValid: boolean;
    error: string;
    suggestions?: string[];
  } => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email es requerido' };
    }

    // Regex más estricta para email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Formato de email inválido' };
    }

    // Verificar dominios comunes y sugerir correcciones
    const commonDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    const [localPart, domain] = email.split('@');
    
    if (domain) {
      const suggestions: string[] = [];
      
      // Sugerir correcciones para dominios mal escritos
      if (domain.includes('gmial') || domain.includes('gmai')) {
        suggestions.push(`${localPart}@gmail.com`);
      }
      if (domain.includes('hotmial') || domain.includes('hotmai')) {
        suggestions.push(`${localPart}@hotmail.com`);
      }
      if (domain.includes('yahooo') || domain.includes('yaho')) {
        suggestions.push(`${localPart}@yahoo.com`);
      }

      if (suggestions.length > 0) {
        return {
          isValid: true,
          error: '',
          suggestions
        };
      }
    }

    return { isValid: true, error: '' };
  }, []);

  return { validateEmail };
}

// Hook para validación de contraseñas
export function usePasswordValidation() {
  const validatePassword = useCallback((password: string): {
    isValid: boolean;
    score: number;
    errors: string[];
    suggestions: string[];
  } => {
    const errors: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    if (!password) {
      return {
        isValid: false,
        score: 0,
        errors: ['Contraseña es requerida'],
        suggestions: []
      };
    }

    // Longitud mínima
    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
      suggestions.push('Agrega más caracteres');
    } else {
      score += 1;
    }

    // Mayúsculas
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
      suggestions.push('Agrega una letra mayúscula');
    } else {
      score += 1;
    }

    // Minúsculas
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
      suggestions.push('Agrega una letra minúscula');
    } else {
      score += 1;
    }

    // Números
    if (!/\d/.test(password)) {
      errors.push('Debe contener al menos un número');
      suggestions.push('Agrega un número');
    } else {
      score += 1;
    }

    // Caracteres especiales
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
      suggestions.push('Agrega un carácter especial (!@#$%^&*)');
    } else {
      score += 1;
    }

    // Patrones comunes débiles
    const weakPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i
    ];

    if (weakPatterns.some(pattern => pattern.test(password))) {
      errors.push('Evita patrones comunes como "123456" o "password"');
      suggestions.push('Usa una combinación única de caracteres');
      score = Math.max(0, score - 2);
    }

    return {
      isValid: errors.length === 0 && score >= 4,
      score,
      errors,
      suggestions
    };
  }, []);

  return { validatePassword };
}

// Hook para validación de fechas
export function useDateValidation() {
  const validateDateRange = useCallback((startDate: string, endDate: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (!startDate) {
      errors.push('Fecha de inicio es requerida');
    }

    if (!endDate) {
      errors.push('Fecha de fin es requerida');
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        errors.push('La fecha de inicio no puede ser anterior a hoy');
      }

      if (end <= start) {
        errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }

      // Verificar que no sea más de 1 año en el futuro
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      if (start > oneYearFromNow || end > oneYearFromNow) {
        errors.push('Las fechas no pueden ser más de un año en el futuro');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return { validateDateRange };
}
