import React from 'react';
import { useThemeAware } from '../../hooks/useTheme';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend
}: StatsCardProps) {
  const theme = useThemeAware();
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400';
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400';
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400';
      case 'gray':
        return `${theme.bgSecondary} border ${theme.border} ${theme.textSecondary}`;
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h3 className={`text-sm font-medium ${theme.textSecondary}`}>{title}</h3>
          </div>

          <div className={`text-3xl font-bold ${theme.text} mb-1`}>
            {value}
          </div>

          {subtitle && (
            <p className={`text-sm ${theme.textMuted}`}>{subtitle}</p>
          )}
          
          {trend && (
            <div className={`text-sm mt-2 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}