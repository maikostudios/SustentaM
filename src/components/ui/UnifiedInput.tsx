import React, { useState, useCallback, forwardRef } from 'react';
import { clsx } from 'clsx';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useThemeAware } from '../../hooks/useTheme';
import { formatRUT, validarRUT } from '../../lib/validations';

interface UnifiedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'basic' | 'enhanced' | 'rut' | 'email' | 'password';
  
  // Para variant enhanced
  realTimeValidation?: boolean;
  showValidationIcon?: boolean;
  success?: boolean;
  
  // Para variant rut
  autoFormat?: boolean;
  
  // Para variant password
  showPasswordToggle?: boolean;
  
  // Callback unificado
  onChange?: (value: string, isValid?: boolean, formatted?: string) => void;
  onValidation?: (isValid: boolean, error?: string) => void;
}

export const UnifiedInput = forwardRef<HTMLInputElement, UnifiedInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    variant = 'basic',
    realTimeValidation = false,
    showValidationIcon = false,
    success = false,
    autoFormat = true,
    showPasswordToggle = true,
    onChange,
    onValidation,
    className, 
    id, 
    type: propType,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(props.value || '');
    const [showPassword, setShowPassword] = useState(false);
    const [validationState, setValidationState] = useState<{
      isValid: boolean;
      error: string;
      formatted: string;
    }>({
      isValid: false,
      error: '',
      formatted: ''
    });
    
    const theme = useThemeAware();
    const inputId = id || crypto.randomUUID();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Determinar el tipo de input
    const inputType = variant === 'password' 
      ? (showPassword ? 'text' : 'password')
      : propType || 'text';

    // Validación según el variant
    const validateInput = useCallback((value: string) => {
      let isValid = true;
      let errorMsg = '';
      let formatted = value;

      switch (variant) {
        case 'rut':
          if (autoFormat) {
            formatted = formatRUT(value);
          }
          if (value.trim()) {
            const rutValidation = validarRUT(value);
            isValid = rutValidation.valido;
            errorMsg = rutValidation.mensaje;
          }
          break;
          
        case 'email':
          if (value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            errorMsg = isValid ? '' : 'Email inválido';
          }
          break;
          
        case 'enhanced':
          // Validación personalizada si se requiere
          if (props.required && !value.trim()) {
            isValid = false;
            errorMsg = 'Campo requerido';
          }
          break;
          
        default:
          // Validación básica
          if (props.required && !value.trim()) {
            isValid = false;
            errorMsg = 'Campo requerido';
          }
      }

      const newState = { isValid, error: errorMsg, formatted };
      setValidationState(newState);
      
      if (onValidation) {
        onValidation(isValid, errorMsg);
      }
      
      return newState;
    }, [variant, autoFormat, props.required, onValidation]);

    // Manejar cambios en el input
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInternalValue(value);
      
      let processedValue = value;
      let isValid = true;
      let formatted = value;
      
      if (realTimeValidation || variant === 'rut' || variant === 'email') {
        const validation = validateInput(value);
        isValid = validation.isValid;
        formatted = validation.formatted;
        
        if (variant === 'rut' && autoFormat) {
          processedValue = formatted;
          setInternalValue(formatted);
        }
      }
      
      if (onChange) {
        onChange(processedValue, isValid, formatted);
      }
    }, [realTimeValidation, variant, autoFormat, validateInput, onChange]);

    // Determinar el estado visual
    const hasError = error || validationState.error;
    const isSuccess = success || (realTimeValidation && validationState.isValid && internalValue.length > 0);
    const showIcon = showValidationIcon && (hasError || isSuccess);

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className={`block font-sans text-sm font-medium ${theme.text}`}
          >
            {label}
            {props.required && (
              <span className="text-error-500 ml-1" aria-label="Campo requerido">*</span>
            )}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={variant === 'rut' && autoFormat ? validationState.formatted || internalValue : internalValue}
            onChange={handleChange}
            className={clsx(
              // Base styles
              'block w-full min-h-[2.75rem] px-4 py-3 font-sans text-base',
              'border-2 rounded transition-all duration-150 ease-in-out',
              `${theme.bg} ${theme.text}`,
              'placeholder-text-muted',
              
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              
              // Estados condicionales
              hasError 
                ? 'border-error-500 focus:border-error-500' 
                : isSuccess
                ? 'border-secondary-500 focus:border-secondary-500'
                : `border-border-light focus:border-primary-500 ${theme.border}`,
              
              // Padding para iconos
              showIcon && 'pr-12',
              variant === 'password' && showPasswordToggle && 'pr-12',
              
              className
            )}
            aria-describedby={clsx({
              [errorId]: hasError,
              [helperId]: helperText
            })}
            aria-invalid={!!hasError}
            {...props}
          />
          
          {/* Icono de validación */}
          {showIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {hasError ? (
                <ExclamationCircleIcon className="w-5 h-5 text-error-500" />
              ) : (
                <CheckCircleIcon className="w-5 h-5 text-secondary-500" />
              )}
            </div>
          )}
          
          {/* Toggle de contraseña */}
          {variant === 'password' && showPasswordToggle && (
            <button
              type="button"
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme.textMuted} hover:${theme.textSecondary} transition-colors`}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        
        {/* Mensajes de error */}
        {hasError && (
          <p 
            id={errorId} 
            className="font-sans text-sm text-error-500 dark:text-error-400 font-medium" 
            role="alert"
            aria-live="polite"
          >
            {error || validationState.error}
          </p>
        )}
        
        {/* Texto de ayuda */}
        {helperText && !hasError && (
          <p 
            id={helperId} 
            className={`font-sans text-sm ${theme.textMuted}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

UnifiedInput.displayName = 'UnifiedInput';

// Componentes de conveniencia
export function RutInput(props: Omit<UnifiedInputProps, 'variant'>) {
  return <UnifiedInput {...props} variant="rut" />;
}

export function EmailInput(props: Omit<UnifiedInputProps, 'variant'>) {
  return <UnifiedInput {...props} variant="email" />;
}

export function PasswordInput(props: Omit<UnifiedInputProps, 'variant'>) {
  return <UnifiedInput {...props} variant="password" />;
}

export function EnhancedInput(props: Omit<UnifiedInputProps, 'variant'>) {
  return <UnifiedInput {...props} variant="enhanced" />;
}
