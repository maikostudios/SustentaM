/**
 * Utilidades para manejo de calificaciones y porcentajes
 */

/**
 * Convierte una calificación decimal (1-7) a porcentaje (0-100%)
 * @param grade - Calificación en escala 1-7
 * @returns Porcentaje redondeado
 */
export function gradeToPercentage(grade: number): number {
  // Convertir de escala 1-7 a 0-100%
  // 1.0 = 0%, 4.0 = 60%, 7.0 = 100%
  const percentage = ((grade - 1) / 6) * 100;
  return Math.round(Math.max(0, Math.min(100, percentage)));
}

/**
 * Convierte un porcentaje (0-100%) a calificación decimal (1-7)
 * @param percentage - Porcentaje 0-100
 * @returns Calificación en escala 1-7
 */
export function percentageToGrade(percentage: number): number {
  // Convertir de 0-100% a escala 1-7
  // 0% = 1.0, 60% = 4.0, 100% = 7.0
  const grade = 1 + (percentage / 100) * 6;
  return Math.round(grade * 10) / 10; // Redondear a 1 decimal
}

/**
 * Formatea una calificación como porcentaje con símbolo %
 * @param grade - Calificación en escala 1-7
 * @returns String formateado como "85%"
 */
export function formatGradeAsPercentage(grade: number): string {
  const percentage = gradeToPercentage(grade);
  return `${percentage}%`;
}

/**
 * Determina si una calificación está aprobada (≥ 80%)
 * @param grade - Calificación en escala 1-7
 * @returns true si está aprobada, false si no
 */
export function isGradeApproved(grade: number): boolean {
  const percentage = gradeToPercentage(grade);
  return percentage >= 80;
}

/**
 * Obtiene el estado de una calificación
 * @param grade - Calificación en escala 1-7
 * @returns 'aprobado' | 'reprobado'
 */
export function getGradeStatus(grade: number): 'aprobado' | 'reprobado' {
  return isGradeApproved(grade) ? 'aprobado' : 'reprobado';
}

/**
 * Obtiene las clases CSS para mostrar una calificación según su estado
 * @param grade - Calificación en escala 1-7
 * @returns Objeto con clases CSS para texto y fondo
 */
export function getGradeStatusClasses(grade: number) {
  const isApproved = isGradeApproved(grade);
  
  return {
    text: isApproved ? 'text-green-700' : 'text-red-700',
    bg: isApproved ? 'bg-green-100' : 'bg-red-100',
    badge: isApproved 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200'
  };
}

/**
 * Formatea una calificación con su estado visual
 * @param grade - Calificación en escala 1-7
 * @returns Objeto con porcentaje formateado y clases CSS
 */
export function formatGradeWithStatus(grade: number) {
  const percentage = formatGradeAsPercentage(grade);
  const status = getGradeStatus(grade);
  const classes = getGradeStatusClasses(grade);
  
  return {
    percentage,
    status,
    classes,
    isApproved: isGradeApproved(grade)
  };
}

/**
 * Valida que un porcentaje esté en el rango válido (0-100)
 * @param percentage - Porcentaje a validar
 * @returns true si es válido, false si no
 */
export function isValidPercentage(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100 && !isNaN(percentage);
}

/**
 * Convierte un string de porcentaje a número
 * @param percentageStr - String como "85%" o "85"
 * @returns Número del porcentaje o null si es inválido
 */
export function parsePercentage(percentageStr: string): number | null {
  const cleaned = percentageStr.replace('%', '').trim();
  const num = parseFloat(cleaned);
  
  if (isNaN(num) || !isValidPercentage(num)) {
    return null;
  }
  
  return num;
}

/**
 * Obtiene estadísticas de un array de calificaciones
 * @param grades - Array de calificaciones en escala 1-7
 * @returns Estadísticas calculadas
 */
export function getGradeStatistics(grades: number[]) {
  if (grades.length === 0) {
    return {
      total: 0,
      approved: 0,
      failed: 0,
      approvalRate: 0,
      averagePercentage: 0
    };
  }
  
  const approved = grades.filter(grade => isGradeApproved(grade)).length;
  const failed = grades.length - approved;
  const approvalRate = (approved / grades.length) * 100;
  
  const totalPercentage = grades.reduce((sum, grade) => sum + gradeToPercentage(grade), 0);
  const averagePercentage = totalPercentage / grades.length;
  
  return {
    total: grades.length,
    approved,
    failed,
    approvalRate: Math.round(approvalRate),
    averagePercentage: Math.round(averagePercentage)
  };
}
