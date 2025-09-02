import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  clave: z.string().min(1, 'Clave requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setAuthError('');
    
    try {
      const success = await login(data.usuario, data.clave);
      if (!success) {
        setAuthError('Usuario o clave incorrectos');
      }
    } catch (error) {
      setAuthError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-blue-900" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Plataforma de Gestión de Cursos
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Usuario (RUT)"
              type="text"
              autoComplete="username"
              required
              error={errors.usuario?.message}
              placeholder="Ej: 12345678-5"
              {...register('usuario')}
            />

            <div className="relative">
              <Input
                label="Clave"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                error={errors.clave?.message}
                {...register('clave')}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3" role="alert">
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            size="lg"
          >
            Ingresar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Admin:</strong> Usuario: 1-9, Clave: admin</p>
              <p><strong>Contratista:</strong> Usuario: 2-7, Clave: 1234</p>
              <p><strong>Usuario:</strong> Usuario: 12345678-5, Clave: user123</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Maqueta Interactiva - Datos de Demostración</p>
            <p>Esta es una simulación completa del sistema de gestión de cursos</p>
          </div>
        </div>
      </div>
    </div>
  );
}