import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Course } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const courseSchema = z.object({
  codigo: z.string().min(1, 'Código requerido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  duracionHoras: z.number().min(1, 'Duración debe ser mayor a 0'),
  fechaInicio: z.string().min(1, 'Fecha de inicio requerida'),
  fechaFin: z.string().min(1, 'Fecha de fin requerida'),
  modalidad: z.enum(['presencial', 'teams']),
  objetivos: z.string().min(1, 'Objetivos requeridos')
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CourseForm({ course, onSubmit, onCancel, loading }: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course || {
      modalidad: 'presencial'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Código del Curso"
          required
          error={errors.codigo?.message}
          placeholder="Ej: C-001"
          {...register('codigo')}
        />

        <Input
          label="Nombre del Curso"
          required
          error={errors.nombre?.message}
          placeholder="Ej: Excel Avanzado"
          {...register('nombre')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Duración (horas)"
          type="number"
          required
          error={errors.duracionHoras?.message}
          placeholder="8"
          {...register('duracionHoras', { valueAsNumber: true })}
        />

        <Input
          label="Fecha de Inicio"
          type="date"
          required
          error={errors.fechaInicio?.message}
          {...register('fechaInicio')}
        />

        <Input
          label="Fecha de Fin"
          type="date"
          required
          error={errors.fechaFin?.message}
          {...register('fechaFin')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modalidad <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="presencial"
              className="w-4 h-4 text-blue-600"
              {...register('modalidad')}
            />
            <div>
              <div className="font-medium">Presencial</div>
              <div className="text-sm text-gray-500">Capacidad: 30 personas</div>
            </div>
          </label>
          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="teams"
              className="w-4 h-4 text-blue-600"
              {...register('modalidad')}
            />
            <div>
              <div className="font-medium">Virtual (Teams)</div>
              <div className="text-sm text-gray-500">Capacidad: 200 personas</div>
            </div>
          </label>
        </div>
        {errors.modalidad && (
          <p className="mt-1 text-sm text-red-600">{errors.modalidad.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700 mb-1">
          Objetivos del Curso <span className="text-red-500">*</span>
        </label>
        <textarea
          id="objetivos"
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Describe los objetivos y contenidos del curso..."
          {...register('objetivos')}
        />
        {errors.objetivos && (
          <p className="mt-1 text-sm text-red-600">{errors.objetivos.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          {course ? 'Actualizar Curso' : 'Crear Curso'}
        </Button>
      </div>
    </form>
  );
}