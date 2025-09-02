import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { usePasswordValidation } from '../../hooks/useFormValidation';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  showStrengthIndicator?: boolean;
  showRequirements?: boolean;
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  onChange?: (value: string, validation: { isValid: boolean; score: number; errors: string[] }) => void;
}

export function PasswordInput({
  label = 'Contraseña',
  error,
  helperText,
  showStrengthIndicator = true,
  showRequirements = true,
  minLength = 8,
  requireUppercase = true,
  requireLowercase = true,
  requireNumbers = true,
  requireSpecialChars = true,
  onChange,
  className,
  id,
  value,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  
  const { validatePassword } = usePasswordValidation();
  
  const inputId = id || `password-${crypto.randomUUID()}`;
  const requirementsId = `${inputId}-requirements`;
  const strengthId = `${inputId}-strength`;

  // Validación de contraseña
  const passwordValidation = useMemo(() => {
    if (!internalValue) {
      return {
        isValid: false,
        score: 0,
        errors: [],
        suggestions: []
      };
    }
    return validatePassword(internalValue);
  }, [internalValue, validatePassword]);

  // Requisitos personalizados
  const requirements = useMemo(() => {
    const reqs = [];
    
    if (minLength > 0) {
      reqs.push({
        label: `Al menos ${minLength} caracteres`,
        met: internalValue.length >= minLength,
        test: (pwd: string) => pwd.length >= minLength
      });
    }
    
    if (requireUppercase) {
      reqs.push({
        label: 'Una letra mayúscula',
        met: /[A-Z]/.test(internalValue),
        test: (pwd: string) => /[A-Z]/.test(pwd)
      });
    }
    
    if (requireLowercase) {
      reqs.push({
        label: 'Una letra minúscula',
        met: /[a-z]/.test(internalValue),
        test: (pwd: string) => /[a-z]/.test(pwd)
      });
    }
    
    if (requireNumbers) {
      reqs.push({
        label: 'Un número',
        met: /\d/.test(internalValue),
        test: (pwd: string) => /\d/.test(pwd)
      });
    }
    
    if (requireSpecialChars) {
      reqs.push({
        label: 'Un carácter especial (!@#$%^&*)',
        met: /[!@#$%^&*(),.?":{}|<>]/.test(internalValue),
        test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
      });
    }
    
    return reqs;
  }, [internalValue, minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars]);

  // Nivel de fortaleza
  const strengthLevel = useMemo(() => {
    const metRequirements = requirements.filter(req => req.met).length;
    const totalRequirements = requirements.length;
    const percentage = totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 0;
    
    if (percentage === 0) return { level: 'none', label: '', color: 'gray' };
    if (percentage < 50) return { level: 'weak', label: 'Débil', color: 'red' };
    if (percentage < 75) return { level: 'medium', label: 'Media', color: 'yellow' };
    if (percentage < 100) return { level: 'strong', label: 'Fuerte', color: 'blue' };
    return { level: 'very-strong', label: 'Muy Fuerte', color: 'green' };
  }, [requirements]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    const validation = validatePassword(newValue);
    onChange?.(newValue, validation);
  }, [onChange, validatePassword]);

  const getStrengthBarColor = (index: number) => {
    const metRequirements = requirements.filter(req => req.met).length;
    const isActive = index < metRequirements;
    
    if (!isActive) return 'bg-gray-200';
    
    switch (strengthLevel.color) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getInputClasses = () => {
    return clsx(
      'block w-full pl-3 pr-10 py-2 border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm',
      {
        'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !error,
        'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50': error,
      },
      className
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={getInputClasses()}
          aria-describedby={clsx({
            [requirementsId]: showRequirements,
            [strengthId]: showStrengthIndicator
          })}
          aria-invalid={!!error}
          {...props}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Indicador de fortaleza */}
      {showStrengthIndicator && internalValue && (
        <div id={strengthId} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Fortaleza de la contraseña:</span>
            <span className={clsx('text-xs font-medium', {
              'text-red-600': strengthLevel.color === 'red',
              'text-yellow-600': strengthLevel.color === 'yellow',
              'text-blue-600': strengthLevel.color === 'blue',
              'text-green-600': strengthLevel.color === 'green',
            })}>
              {strengthLevel.label}
            </span>
          </div>
          
          <div className="flex space-x-1">
            {Array.from({ length: requirements.length }).map((_, index) => (
              <div
                key={index}
                className={clsx('h-1 flex-1 rounded-full transition-colors duration-300', 
                  getStrengthBarColor(index)
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lista de requisitos */}
      {showRequirements && (isFocused || internalValue) && (
        <div id={requirementsId} className="bg-gray-50 border border-gray-200 rounded-md p-3 space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Requisitos de contraseña:</span>
          </div>
          
          <ul className="space-y-1">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-center space-x-2">
                {requirement.met ? (
                  <CheckIcon className="h-3 w-3 text-green-500 flex-shrink-0" />
                ) : (
                  <XMarkIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                )}
                <span className={clsx('text-xs', {
                  'text-green-600': requirement.met,
                  'text-gray-600': !requirement.met
                })}>
                  {requirement.label}
                </span>
              </li>
            ))}
          </ul>
          
          {/* Sugerencias adicionales */}
          {passwordValidation.suggestions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-700">Sugerencias:</span>
              <ul className="mt-1 space-y-1">
                {passwordValidation.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center space-x-1" role="alert">
          <XMarkIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Componente para confirmar contraseña
interface PasswordConfirmInputProps extends Omit<PasswordInputProps, 'showStrengthIndicator' | 'showRequirements'> {
  originalPassword: string;
  onMatch?: (isMatch: boolean) => void;
}

export function PasswordConfirmInput({
  originalPassword,
  onMatch,
  label = 'Confirmar Contraseña',
  ...props
}: PasswordConfirmInputProps) {
  const [confirmValue, setConfirmValue] = useState('');
  const [hasBlurred, setHasBlurred] = useState(false);

  const isMatch = confirmValue === originalPassword;
  const showError = hasBlurred && confirmValue && !isMatch;

  const handleChange = useCallback((value: string) => {
    setConfirmValue(value);
    const match = value === originalPassword;
    onMatch?.(match);
  }, [originalPassword, onMatch]);

  return (
    <PasswordInput
      {...props}
      label={label}
      value={confirmValue}
      onChange={(value) => handleChange(value)}
      onBlur={() => setHasBlurred(true)}
      error={showError ? 'Las contraseñas no coinciden' : props.error}
      showStrengthIndicator={false}
      showRequirements={false}
    />
  );
}
