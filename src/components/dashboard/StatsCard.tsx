import React from 'react';

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
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-600';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-600';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-600';
      case 'gray':
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
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