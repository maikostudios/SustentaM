import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles - altura mínima uniforme, padding consistente, bordes redondeados 4px
        'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-all duration-150 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        'rounded border-2',
        {
          // Primary - Azul oscuro (#0A3D62)
          'bg-primary-500 text-text-inverse border-primary-500 hover:bg-primary-600 hover:border-primary-600 hover:-translate-y-0.5 hover:shadow-md':
            variant === 'primary',

          // Secondary - Verde (#4CAF50)
          'bg-secondary-500 text-text-inverse border-secondary-500 hover:bg-secondary-600 hover:border-secondary-600 hover:-translate-y-0.5 hover:shadow-md':
            variant === 'secondary',

          // Outline - Borde primario, fondo transparente
          'bg-transparent text-primary-500 border-primary-500 hover:bg-primary-500 hover:text-text-inverse':
            variant === 'outline',

          // Warning - Naranja (#F57C00)
          'bg-warning-500 text-text-inverse border-warning-500 hover:bg-warning-600 hover:border-warning-600 hover:-translate-y-0.5 hover:shadow-md':
            variant === 'warning',

          // Error - Rojo (#D32F2F)
          'bg-error-500 text-text-inverse border-error-500 hover:bg-error-600 hover:border-error-600 hover:-translate-y-0.5 hover:shadow-md':
            variant === 'error',

          // Ghost - Sin fondo, solo texto
          'bg-transparent text-text-primary border-transparent hover:bg-background-tertiary':
            variant === 'ghost',

          // Tamaños con altura mínima uniforme
          'min-h-[2rem] px-3 text-sm': size === 'sm',      // 32px altura mínima
          'min-h-[2.75rem] px-6 text-base': size === 'md',  // 44px altura mínima (estándar)
          'min-h-[3.5rem] px-8 text-lg': size === 'lg'      // 56px altura mínima
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          aria-label="Cargando..."
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}