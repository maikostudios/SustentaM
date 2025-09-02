import React, { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  EyeIcon, 
  EyeSlashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks/usePerformanceOptimization';

interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  loading?: boolean;
  showValidationIcon?: boolean;
  realTimeValidation?: boolean;
  validationDelay?: number;
  suggestions?: string[];
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestionSelect?: (suggestion: string) => void;
}

export function EnhancedInput({
  label,
  error,
  helperText,
  success,
  loading,
  showValidationIcon = true,
  realTimeValidation = false,
  validationDelay = 300,
  suggestions = [],
  onValidationChange,
  onChange,
  onSuggestionSelect,
  className,
  type = 'text',
  id,
  value,
  ...props
}: EnhancedInputProps) {
  const [internalValue, setInternalValue] = useState(value || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedValue = useDebounce(internalValue, validationDelay);
  
  const inputId = id || `input-${crypto.randomUUID()}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const suggestionsId = `${inputId}-suggestions`;

  // Sincronizar valor interno con prop value
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(String(value));
    }
  }, [value, internalValue]);

  // Manejar validación en tiempo real
  useEffect(() => {
    if (realTimeValidation && debouncedValue && onValidationChange) {
      // Aquí se podría integrar con el hook de validación
      onValidationChange(!error, error);
    }
  }, [debouncedValue, realTimeValidation, onValidationChange, error]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue, e);
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInternalValue(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    onChange?.(suggestion, { target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
  }, [onSuggestionSelect, onChange]);

  const getValidationIcon = () => {
    if (!showValidationIcon) return null;
    
    if (loading) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
      );
    }
    
    if (error) {
      return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
    }
    
    if (success) {
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    }
    
    return null;
  };

  const getInputClasses = () => {
    return clsx(
      'block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm',
      {
        // Estados normales
        'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !error && !success,
        
        // Estado de error
        'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50': error,
        
        // Estado de éxito
        'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50': success && !error,
        
        // Padding para iconos
        'pr-10': showValidationIcon || type === 'password',
        
        // Estado de carga
        'bg-gray-50': loading,
      },
      className
    );
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1 relative">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={getInputClasses()}
          aria-describedby={clsx({
            [errorId]: error,
            [helperId]: helperText,
            [suggestionsId]: showSuggestions
          })}
          aria-invalid={!!error}
          aria-expanded={showSuggestions}
          aria-haspopup={suggestions.length > 0 ? 'listbox' : undefined}
          disabled={loading}
          {...props}
        />
        
        {/* Iconos de validación y controles */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          )}
          
          {getValidationIcon()}
        </div>
        
        {/* Sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            id={suggestionsId}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected={false}
              >
                <div className="flex items-center">
                  <InformationCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-900">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Mensajes de error */}
      {error && (
        <div id={errorId} className="flex items-center space-x-1" role="alert">
          <ExclamationCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Texto de ayuda */}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
      
      {/* Indicador de éxito */}
      {success && !error && (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-600">Campo válido</p>
        </div>
      )}
    </div>
  );
}

// Componente especializado para RUT
interface RutInputProps extends Omit<EnhancedInputProps, 'type' | 'onChange'> {
  onChange?: (rut: string, isValid: boolean, formatted: string) => void;
}

export function RutInput({ onChange, ...props }: RutInputProps) {
  const [rutState, setRutState] = useState({
    raw: '',
    formatted: '',
    isValid: false,
    error: ''
  });

  const validateAndFormatRut = useCallback((value: string) => {
    if (!value.trim()) {
      const state = { raw: '', formatted: '', isValid: false, error: '' };
      setRutState(state);
      onChange?.('', false, '');
      return state;
    }

    // Limpiar entrada
    const cleaned = value.replace(/[^0-9Kk]/g, '').toUpperCase();
    
    if (cleaned.length < 2) {
      const state = { raw: value, formatted: value, isValid: false, error: 'RUT incompleto' };
      setRutState(state);
      onChange?.(value, false, value);
      return state;
    }

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Validar formato
    if (!/^\d+$/.test(body)) {
      const state = { raw: value, formatted: value, isValid: false, error: 'Formato inválido' };
      setRutState(state);
      onChange?.(value, false, value);
      return state;
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
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    const error = isValid ? '' : 'Dígito verificador incorrecto';

    const state = { raw: value, formatted, isValid, error };
    setRutState(state);
    onChange?.(value, isValid, formatted);
    
    return state;
  }, [onChange]);

  const handleRutChange = useCallback((value: string) => {
    validateAndFormatRut(value);
  }, [validateAndFormatRut]);

  return (
    <EnhancedInput
      {...props}
      type="text"
      value={rutState.formatted}
      error={rutState.error}
      success={rutState.isValid && rutState.raw.length > 0}
      onChange={handleRutChange}
      placeholder="12.345.678-5"
      helperText="Formato: 12.345.678-5"
      maxLength={12}
    />
  );
}

// Componente especializado para email con sugerencias
interface EmailInputProps extends Omit<EnhancedInputProps, 'type'> {
  showSuggestions?: boolean;
}

export function EmailInput({ showSuggestions = true, ...props }: EmailInputProps) {
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);

  const generateEmailSuggestions = useCallback((email: string) => {
    if (!showSuggestions || !email.includes('@')) {
      setEmailSuggestions([]);
      return;
    }

    const [localPart, domain] = email.split('@');
    const suggestions: string[] = [];

    // Sugerencias para dominios mal escritos
    if (domain) {
      if (domain.includes('gmial') || domain.includes('gmai')) {
        suggestions.push(`${localPart}@gmail.com`);
      }
      if (domain.includes('hotmial') || domain.includes('hotmai')) {
        suggestions.push(`${localPart}@hotmail.com`);
      }
      if (domain.includes('yahooo') || domain.includes('yaho')) {
        suggestions.push(`${localPart}@yahoo.com`);
      }
      if (domain.includes('outlok') || domain.includes('outloo')) {
        suggestions.push(`${localPart}@outlook.com`);
      }
    }

    setEmailSuggestions(suggestions);
  }, [showSuggestions]);

  const handleEmailChange = useCallback((value: string, event: React.ChangeEvent<HTMLInputElement>) => {
    generateEmailSuggestions(value);
    props.onChange?.(value, event);
  }, [generateEmailSuggestions, props]);

  return (
    <EnhancedInput
      {...props}
      type="email"
      onChange={handleEmailChange}
      suggestions={emailSuggestions}
      onSuggestionSelect={(suggestion) => {
        setEmailSuggestions([]);
        props.onSuggestionSelect?.(suggestion);
      }}
    />
  );
}
