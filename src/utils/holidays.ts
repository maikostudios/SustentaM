import { format } from 'date-fns';

// Feriados fijos de Chile
export const FIXED_HOLIDAYS = [
  { date: '01-01', name: 'Año Nuevo' },
  { date: '05-01', name: 'Día del Trabajador' },
  { date: '05-21', name: 'Día de las Glorias Navales' },
  { date: '06-29', name: 'San Pedro y San Pablo' },
  { date: '07-16', name: 'Día de la Virgen del Carmen' },
  { date: '08-15', name: 'Asunción de la Virgen' },
  { date: '09-18', name: 'Independencia Nacional' },
  { date: '09-19', name: 'Día de las Glorias del Ejército' },
  { date: '10-12', name: 'Encuentro de Dos Mundos' },
  { date: '10-31', name: 'Día de las Iglesias Evangélicas y Protestantes' },
  { date: '11-01', name: 'Día de Todos los Santos' },
  { date: '12-08', name: 'Inmaculada Concepción' },
  { date: '12-25', name: 'Navidad' }
];

// Feriados variables por año (Semana Santa principalmente)
export const VARIABLE_HOLIDAYS_2025 = [
  { date: '2025-04-18', name: 'Viernes Santo' },
  { date: '2025-04-19', name: 'Sábado Santo' }
];

export const VARIABLE_HOLIDAYS_2024 = [
  { date: '2024-03-29', name: 'Viernes Santo' },
  { date: '2024-03-30', name: 'Sábado Santo' }
];

export const VARIABLE_HOLIDAYS_2026 = [
  { date: '2026-04-03', name: 'Viernes Santo' },
  { date: '2026-04-04', name: 'Sábado Santo' }
];

// Función para verificar si una fecha es feriado
export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const monthDay = format(date, 'MM-dd');
  const fullDate = format(date, 'yyyy-MM-dd');

  // Verificar feriados fijos
  const isFixedHoliday = FIXED_HOLIDAYS.some(holiday => holiday.date === monthDay);
  
  // Verificar feriados variables según el año
  let variableHolidays: Array<{ date: string; name: string }> = [];
  
  switch (year) {
    case 2024:
      variableHolidays = VARIABLE_HOLIDAYS_2024;
      break;
    case 2025:
      variableHolidays = VARIABLE_HOLIDAYS_2025;
      break;
    case 2026:
      variableHolidays = VARIABLE_HOLIDAYS_2026;
      break;
  }
  
  const isVariableHoliday = variableHolidays.some(holiday => holiday.date === fullDate);
  
  return isFixedHoliday || isVariableHoliday;
}

// Función para obtener el nombre del feriado
export function getHolidayName(date: Date): string | null {
  const year = date.getFullYear();
  const monthDay = format(date, 'MM-dd');
  const fullDate = format(date, 'yyyy-MM-dd');

  // Buscar en feriados fijos
  const fixedHoliday = FIXED_HOLIDAYS.find(holiday => holiday.date === monthDay);
  if (fixedHoliday) return fixedHoliday.name;

  // Buscar en feriados variables
  let variableHolidays: Array<{ date: string; name: string }> = [];
  
  switch (year) {
    case 2024:
      variableHolidays = VARIABLE_HOLIDAYS_2024;
      break;
    case 2025:
      variableHolidays = VARIABLE_HOLIDAYS_2025;
      break;
    case 2026:
      variableHolidays = VARIABLE_HOLIDAYS_2026;
      break;
  }
  
  const variableHoliday = variableHolidays.find(holiday => holiday.date === fullDate);
  if (variableHoliday) return variableHoliday.name;

  return null;
}

// Función para verificar si es fin de semana
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Domingo = 0, Sábado = 6
}

// Función para verificar si es día no laborable (feriado o fin de semana)
export function isNonWorkingDay(date: Date): boolean {
  return isHoliday(date) || isWeekend(date);
}
