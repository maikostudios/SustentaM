import React from 'react';

interface SeatIconProps {
  number?: number;
  status: 'available' | 'occupied' | 'total';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  showNumber?: boolean;
}

export function SeatIcon({
  number,
  status,
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  showNumber = true
}: SeatIconProps) {
  // Configuración de tamaños - aumentados para mejor visibilidad
  const sizeConfig = {
    sm: { width: 40, height: 40, fontSize: '12px' },
    md: { width:50, height: 50, fontSize: '14px' },
    lg: { width: 60, height: 60, fontSize: '16px' }
  };

  const { width, height, fontSize } = sizeConfig[size];

  // Configuración de colores según el estado usando paleta SUSTENTA
  const getColors = () => {
    switch (status) {
      case 'available':
        return {
          fill: 'var(--color-success, #10b981)', // Verde success del tema
          stroke: 'var(--color-success, #10b981)',
          textColor: 'var(--color-success, #10b981)'
        };
      case 'occupied':
        return {
          fill: 'var(--color-error, #ef4444)', // Rojo error del tema
          stroke: 'var(--color-error, #ef4444)',
          textColor: 'var(--color-error, #ef4444)'
        };
      case 'total':
        return {
          fill: 'var(--color-text-primary, #1a1a1a)', // Color de texto principal del tema
          stroke: 'var(--color-text-primary, #1a1a1a)',
          textColor: 'var(--color-text-primary, #1a1a1a)'
        };
      default:
        return {
          fill: 'var(--color-text-secondary, #666666)', // Color de texto secundario del tema
          stroke: 'var(--color-text-secondary, #666666)',
          textColor: 'var(--color-text-secondary, #666666)'
        };
    }
  };

  const colors = getColors();

  // Clases CSS para interactividad
  const interactiveClasses = onClick && !disabled 
    ? 'cursor-pointer hover:opacity-80 transition-opacity' 
    : disabled 
    ? 'cursor-not-allowed opacity-50' 
    : '';

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`inline-block ${interactiveClasses} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !disabled ? 0 : -1}
      role={onClick ? 'button' : 'img'}
      aria-label={showNumber && number ? `Butaca ${number} ${status === 'occupied' ? 'ocupada' : status === 'available' ? 'disponible' : ''}` : `Butaca ${status === 'occupied' ? 'ocupada' : status === 'available' ? 'disponible' : 'total'}`}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Butaca simplificada */}
        <g>
          {/* Respaldo */}
          <rect
            x="15"
            y="15"
            width="70"
            height="45"
            rx="8"
            ry="8"
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth="2"
          />

          {/* Asiento */}
          <rect
            x="20"
            y="50"
            width="60"
            height="30"
            rx="6"
            ry="6"
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth="2"
          />

          {/* Patas */}
          <rect x="25" y="75" width="4" height="10" fill={colors.fill} />
          <rect x="71" y="75" width="4" height="10" fill={colors.fill} />

          {/* Círculo central para el número - solo si showNumber es true */}
          {showNumber && (
            <circle
              cx="50"
              cy="40"
              r="15"
              fill="white"
              stroke={colors.stroke}
              strokeWidth="2"
            />
          )}
        </g>

        {/* Número en el centro - solo si showNumber es true */}
        {showNumber && number && (
          <text
            x="50"
            y="40"
            textAnchor="middle"
            dominantBaseline="central"
            fill={colors.textColor}
            fontSize={fontSize}
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{ userSelect: 'none' }}
          >
            {number}
          </text>
        )}
      </svg>
    </div>
  );
}
