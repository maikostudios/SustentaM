import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Course } from '../../types';
import { EnhancedInput, RutInput, EmailInput } from '../ui/EnhancedInput';
import { Button } from '../ui/Button';
import { useDateValidation } from '../../hooks/useFormValidation';
import { useNotifications } from '../../contexts/ToastContext';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserGroupIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

// Schema de validación mejorado
const enhancedCourseSchema = z.object({
  codigo: z.string()
    .min(1, 'Código es requerido')
    .min(3, 'Código debe tener al menos 3 caracteres')
    .max(20, 'Código no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'Código debe contener solo letras mayúsculas, números y guiones'),
  
  nombre: z.string()
    .min(1, 'Nombre es requerido')
    .min(5, 'Nombre debe tener al menos 5 caracteres')
    .max(100, 'Nombre no puede exceder 100 caracteres'),
  
  descripcion: z.string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(500, 'Descripción no puede exceder 500 caracteres'),
  
  duracionHoras: z.number()
    .min(1, 'Duración debe ser mayor a 0')
    .max(200, 'Duración no puede exceder 200 horas')
    .int('Duración debe ser un número entero'),
  
  fechaInicio: z.string()
    .min(1, 'Fecha de inicio es requerida'),
  
  fechaFin: z.string()
    .min(1, 'Fecha de fin es requerida'),
  
  modalidad: z.enum(['presencial', 'virtual', 'híbrido'], {
    errorMap: () => ({ message: 'Selecciona una modalidad válida' })
  }),
  
  capacidadMaxima: z.number()
    .min(1, 'Capacidad debe ser mayor a 0')
    .max(100, 'Capacidad no puede exceder 100 participantes')
    .int('Capacidad debe ser un número entero'),
  
  objetivos: z.string()
    .min(20, 'Objetivos deben tener al menos 20 caracteres')
    .max(1000, 'Objetivos no pueden exceder 1000 caracteres'),
  
  instructor: z.string()
    .min(1, 'Instructor es requerido')
    .min(3, 'Nombre del instructor debe tener al menos 3 caracteres'),
  
  emailInstructor: z.string()
    .email('Email del instructor debe ser válido'),
  
  ubicacion: z.string()
    .min(1, 'Ubicación es requerida')
    .max(200, 'Ubicación no puede exceder 200 caracteres'),
  
  costo: z.number()
    .min(0, 'Costo no puede ser negativo')
    .max(10000000, 'Costo no puede exceder $10.000.000'),
  
  requisitos: z.string()
    .max(500, 'Requisitos no pueden exceder 500 caracteres')
    .optional()
}).refine((data) => {
  const fechaInicio = new Date(data.fechaInicio);
  const fechaFin = new Date(data.fechaFin);
  return fechaFin > fechaInicio;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fechaFin']
});

type EnhancedCourseFormData = z.infer<typeof enhancedCourseSchema>;

interface EnhancedCourseFormProps {
  course?: Course;
  onSubmit: (data: EnhancedCourseFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EnhancedCourseForm({ 
  course, 
  onSubmit, 
  onCancel, 
  loading = false 
}: EnhancedCourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const notifications = useNotifications();
  const { validateDateRange } = useDateValidation();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, dirtyFields },
    trigger
  } = useForm<EnhancedCourseFormData>({
    resolver: zodResolver(enhancedCourseSchema),
    mode: 'onChange',
    defaultValues: course ? {
      codigo: course.codigo || '',
      nombre: course.nombre || '',
      descripcion: course.descripcion || '',
      duracionHoras: course.duracion || 8,
      fechaInicio: course.fechaInicio || '',
      fechaFin: course.fechaFin || '',
      modalidad: course.modalidad || 'presencial',
      capacidadMaxima: course.capacidadMaxima || 30,
      objetivos: course.objetivos || '',
      instructor: course.instructor || '',
      emailInstructor: course.emailInstructor || '',
      ubicacion: course.ubicacion || '',
      costo: course.costo || 0,
      requisitos: course.requisitos || ''
    } : {
      modalidad: 'presencial',
      duracionHoras: 8,
      capacidadMaxima: 30,
      costo: 0
    }
  });

  // Observar cambios en las fechas para validación en tiempo real
  const fechaInicio = watch('fechaInicio');
  const fechaFin = watch('fechaFin');

  // Validación de fechas en tiempo real
  React.useEffect(() => {
    if (fechaInicio && fechaFin) {
      const dateValidation = validateDateRange(fechaInicio, fechaFin);
      if (!dateValidation.isValid) {
        setValidationErrors(prev => ({
          ...prev,
          fechas: dateValidation.errors[0]
        }));
      } else {
        setValidationErrors(prev => {
          const { fechas, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [fechaInicio, fechaFin, validateDateRange]);

  const handleFormSubmit = useCallback(async (data: EnhancedCourseFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validación adicional de fechas
      const dateValidation = validateDateRange(data.fechaInicio, data.fechaFin);
      if (!dateValidation.isValid) {
        notifications.error(
          'Error de validación',
          dateValidation.errors[0]
        );
        return;
      }

      await onSubmit(data);
      
      notifications.success(
        course ? 'Curso actualizado' : 'Curso creado',
        `El curso "${data.nombre}" se ha ${course ? 'actualizado' : 'creado'} correctamente.`
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      notifications.error(
        'Error al guardar',
        'Ha ocurrido un error al guardar el curso. Inténtalo nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [course, onSubmit, validateDateRange, notifications]);

  const handleFieldValidation = useCallback(async (fieldName: keyof EnhancedCourseFormData) => {
    await trigger(fieldName);
  }, [trigger]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Información básica */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <AcademicCapIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="Código del Curso"
            required
            error={errors.codigo?.message}
            success={dirtyFields.codigo && !errors.codigo}
            placeholder="Ej: EXCEL-ADV-001"
            helperText="Solo letras mayúsculas, números y guiones"
            realTimeValidation
            onValidationChange={() => handleFieldValidation('codigo')}
            {...register('codigo')}
          />

          <EnhancedInput
            label="Nombre del Curso"
            required
            error={errors.nombre?.message}
            success={dirtyFields.nombre && !errors.nombre}
            placeholder="Ej: Excel Avanzado para Profesionales"
            realTimeValidation
            onValidationChange={() => handleFieldValidation('nombre')}
            {...register('nombre')}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Curso <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe el contenido y alcance del curso..."
            {...register('descripcion')}
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* Detalles del curso */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <ClockIcon className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium text-gray-900">Detalles del Curso</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedInput
            label="Duración (horas)"
            type="number"
            required
            error={errors.duracionHoras?.message}
            success={dirtyFields.duracionHoras && !errors.duracionHoras}
            placeholder="8"
            min="1"
            max="200"
            {...register('duracionHoras', { valueAsNumber: true })}
          />

          <EnhancedInput
            label="Capacidad Máxima"
            type="number"
            required
            error={errors.capacidadMaxima?.message}
            success={dirtyFields.capacidadMaxima && !errors.capacidadMaxima}
            placeholder="30"
            min="1"
            max="100"
            {...register('capacidadMaxima', { valueAsNumber: true })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modalidad <span className="text-red-500">*</span>
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('modalidad')}
            >
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="híbrido">Híbrido</option>
            </select>
            {errors.modalidad && (
              <p className="mt-1 text-sm text-red-600">{errors.modalidad.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">Fechas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="Fecha de Inicio"
            type="date"
            required
            error={errors.fechaInicio?.message || validationErrors.fechas}
            success={dirtyFields.fechaInicio && !errors.fechaInicio && !validationErrors.fechas}
            {...register('fechaInicio')}
          />

          <EnhancedInput
            label="Fecha de Fin"
            type="date"
            required
            error={errors.fechaFin?.message}
            success={dirtyFields.fechaFin && !errors.fechaFin && !validationErrors.fechas}
            {...register('fechaFin')}
          />
        </div>
      </div>

      {/* Instructor */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <UserGroupIcon className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-medium text-gray-900">Instructor</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="Nombre del Instructor"
            required
            error={errors.instructor?.message}
            success={dirtyFields.instructor && !errors.instructor}
            placeholder="Ej: María González"
            {...register('instructor')}
          />

          <Controller
            name="emailInstructor"
            control={control}
            render={({ field }) => (
              <EmailInput
                label="Email del Instructor"
                required
                error={errors.emailInstructor?.message}
                success={dirtyFields.emailInstructor && !errors.emailInstructor}
                placeholder="instructor@empresa.com"
                {...field}
              />
            )}
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedInput
              label="Ubicación"
              required
              error={errors.ubicacion?.message}
              success={dirtyFields.ubicacion && !errors.ubicacion}
              placeholder="Ej: Sala de Conferencias A, Edificio Principal"
              {...register('ubicacion')}
            />

            <EnhancedInput
              label="Costo (CLP)"
              type="number"
              error={errors.costo?.message}
              success={dirtyFields.costo && !errors.costo}
              placeholder="0"
              min="0"
              {...register('costo', { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivos del Curso <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Describe los objetivos de aprendizaje del curso..."
              {...register('objetivos')}
            />
            {errors.objetivos && (
              <p className="mt-1 text-sm text-red-600">{errors.objetivos.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requisitos Previos
            </label>
            <textarea
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Conocimientos o experiencia previa requerida (opcional)..."
              {...register('requisitos')}
            />
            {errors.requisitos && (
              <p className="mt-1 text-sm text-red-600">{errors.requisitos.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || loading}
          disabled={!isValid || Object.keys(validationErrors).length > 0}
        >
          {course ? 'Actualizar Curso' : 'Crear Curso'}
        </Button>
      </div>
    </form>
  );
}
