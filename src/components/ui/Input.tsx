import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || crypto.randomUUID();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-sans text-sm font-medium text-text-primary dark:text-dark-primary"
          >
            {label}
            {props.required && (
              <span className="text-error-500 ml-1" aria-label="Campo requerido">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            // Base styles - altura mínima uniforme, padding consistente, bordes redondeados 4px
            'block w-full min-h-[2.75rem] px-4 py-3 font-sans text-base',
            'border-2 rounded border-border-light',
            'bg-background-secondary text-text-primary',
            'placeholder-text-muted',
            'transition-all duration-150 ease-in-out',
            // Focus states accesibles
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            // Dark mode
            'dark:bg-dark-secondary dark:text-dark-primary dark:border-dark-border',
            'dark:placeholder-dark-muted dark:focus:border-primary-400',
            {
              // Error state - borde rojo
              'border-error-500 focus:border-error-500 focus:ring-error-500/20': error
            },
            className
          )}
          aria-describedby={clsx({
            [errorId]: error,
            [helperId]: helperText
          })}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="font-sans text-sm text-error-500 dark:text-error-400 font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="font-sans text-sm text-text-muted dark:text-dark-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';