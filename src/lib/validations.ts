// Chilean RUT validation using Module 11 algorithm
export function validarRUT(rut: string): { valido: boolean; mensaje: string } {
  if (!rut) return { valido: false, mensaje: 'RUT requerido' };
  
  // Clean and format RUT
  const limpio = rut.replace(/[^0-9Kk]/g, '').toUpperCase();
  if (limpio.length < 2) return { valido: false, mensaje: 'Formato insuficiente' };
  
  const cuerpo = limpio.slice(0, -1);
  const dvIngresado = limpio.slice(-1);
  
  if (cuerpo.length < 7) return { valido: false, mensaje: 'RUT debe tener al menos 7 dígitos' };
  
  // Calculate verification digit using Module 11
  let suma = 0;
  let factor = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  
  const resto = suma % 11;
  let dvCalculado = 11 - resto;
  
  if (dvCalculado === 11) dvCalculado = 0;
  else if (dvCalculado === 10) dvCalculado = 'K';
  
  const esValido = dvCalculado.toString() === dvIngresado;
  
  return {
    valido: esValido,
    mensaje: esValido ? 'RUT válido' : 'Dígito verificador incorrecto'
  };
}

export function formatRUT(rut: string): string {
  const clean = rut.replace(/[^0-9Kk]/g, '');
  if (clean.length < 2) return clean;
  
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  // Add dots every 3 digits from right to left
  const formatted = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

export function validateEnrollmentCapacity(currentCount: number, newCount: number, capacity: number): boolean {
  return currentCount + newCount <= capacity;
}

export function calculateParticipantStatus(asistencia: number, nota: number): 'aprobado' | 'reprobado' {
  return asistencia >= 50 && nota >= 4.0 ? 'aprobado' : 'reprobado';
}