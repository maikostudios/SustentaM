import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validarRUT, formatRUT } from '../../lib/validations';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

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

  const handleFormSubmit = (data: EnrollmentFormData) => {
    // Check for duplicate RUT
    if (existingRuts.includes(data.rut)) {
      setError('rut', { 
        type: 'manual', 
        message: 'Este RUT ya está inscrito en el curso' 
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
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
  );
}