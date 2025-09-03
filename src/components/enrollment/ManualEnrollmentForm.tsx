import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validarRUT, formatRUT } from '../../lib/validations';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

// Datos hardcodeados para simulación de validación nombre-RUT
const VALID_NAME_RUT_COMBINATIONS = [
  { nombre: 'Juan Carlos Pérez González', rut: '12.345.678-5' },
  { nombre: 'María Elena Rodríguez Silva', rut: '98.765.432-1' },
  { nombre: 'Carlos Alberto Muñoz Torres', rut: '15.678.234-9' },
  { nombre: 'Ana Patricia López Herrera', rut: '22.456.789-3' },
  { nombre: 'Roberto Francisco Díaz Morales', rut: '18.234.567-8' }
];

const enrollmentSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  rut: z.string().refine((rut) => validarRUT(rut).valido, {
    message: 'RUT inválido'
  }),
  contractor: z.string().min(1, 'Contratista requerido')
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface ManualEnrollmentFormProps {
  onSubmit: (data: EnrollmentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  existingRuts?: string[];
}

export function ManualEnrollmentForm({ 
  onSubmit, 
  onCancel, 
  loading, 
  existingRuts = [] 
}: ManualEnrollmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema)
  });

  const rutValue = watch('rut');

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setValue('rut', formatted);
  };

  const validateNameRutCombination = (nombre: string, rut: string): boolean => {
    // Normalizar nombre para comparación (sin tildes, minúsculas, espacios múltiples)
    const normalizeString = (str: string) =>
      str.toLowerCase()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .replace(/\s+/g, ' ')
         .trim();

    const normalizedInputName = normalizeString(nombre);

    return VALID_NAME_RUT_COMBINATIONS.some(combination => {
      const normalizedValidName = normalizeString(combination.nombre);
      return normalizedValidName === normalizedInputName && combination.rut === rut;
    });
  };

  const handleFormSubmit = (data: EnrollmentFormData) => {
    // Check for duplicate RUT
    if (existingRuts.includes(data.rut)) {
      setError('rut', {
        type: 'manual',
        message: 'Este RUT ya está inscrito en el curso'
      });
      return;
    }

    // Validar combinación nombre-RUT
    if (!validateNameRutCombination(data.nombre, data.rut)) {
      setError('nombre', {
        type: 'manual',
        message: 'El nombre no pertenece al RUT'
      });
      setError('rut', {
        type: 'manual',
        message: 'El RUT no corresponde al nombre ingresado'
      });
      return;
    }

    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      {/* Ayuda para testing */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          💡 Datos de prueba válidos:
        </h4>
        <div className="text-xs text-blue-700 space-y-1">
          {VALID_NAME_RUT_COMBINATIONS.slice(0, 3).map((combo, index) => (
            <div key={index}>
              <strong>{combo.nombre}</strong> - {combo.rut}
            </div>
          ))}
          <div className="text-blue-600 mt-2">
            <em>Usa estos datos para probar la validación exitosa</em>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Nombre Completo"
        required
        error={errors.nombre?.message}
        placeholder="Ej: Juan Pérez González"
        {...register('nombre')}
      />

      <Input
        label="RUT"
        required
        error={errors.rut?.message}
        value={rutValue || ''}
        onChange={handleRutChange}
        placeholder="Ej: 12345678-5"
        helperText="Formato: 12345678-5"
      />

      <Input
        label="Empresa Contratista"
        required
        error={errors.contractor?.message}
        placeholder="Ej: Empresa ABC Ltda."
        {...register('contractor')}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          Inscribir Participante
        </Button>
      </div>
    </form>
    </div>
  );
}