import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha al formato DD-MM-AAAA
 * @param date - Fecha como string ISO, Date object, o timestamp
 * @returns Fecha formateada como DD-MM-AAAA
 */
export function formatDateDDMMYYYY(date: string | Date | number): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Si es string ISO (YYYY-MM-DD)
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      // Si es timestamp
      dateObj = new Date(date);
    } else {
      // Si ya es Date object
      dateObj = date;
    }
    
    return format(dateObj, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha al formato DD-MM-AAAA con nombre del mes
 * @param date - Fecha como string ISO, Date object, o timestamp
 * @returns Fecha formateada como "DD de MMMM de AAAA"
 */
export function formatDateLongDDMMYYYY(date: string | Date | number): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha al formato DD/MM/AAAA (con barras)
 * @param date - Fecha como string ISO, Date object, o timestamp
 * @returns Fecha formateada como DD/MM/AAAA
 */
export function formatDateDDMMYYYYSlash(date: string | Date | number): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    return format(dateObj, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha para mostrar en tablas (formato corto)
 * @param date - Fecha como string ISO, Date object, o timestamp
 * @returns Fecha formateada como DD-MM-AA
 */
export function formatDateShort(date: string | Date | number): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    return format(dateObj, 'dd-MM-yy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

/**
 * Convierte una fecha del formato DD-MM-AAAA al formato ISO (YYYY-MM-DD)
 * @param dateStr - Fecha en formato DD-MM-AAAA
 * @returns Fecha en formato ISO YYYY-MM-DD
 */
export function convertDDMMYYYYToISO(dateStr: string): string {
  try {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return '';
  }
}

/**
 * Valida si una fecha está en formato DD-MM-AAAA
 * @param dateStr - String de fecha a validar
 * @returns true si es válida, false si no
 */
export function isValidDDMMYYYY(dateStr: string): boolean {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateStr)) return false;
  
  try {
    const isoDate = convertDDMMYYYYToISO(dateStr);
    const date = parseISO(isoDate);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
