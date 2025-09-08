import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EyeIcon, EyeSlashIcon, UserIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { logger } from '../../utils/logger';
import { LogViewer } from '../debug/LogViewer';
import { formatRUT } from '../../lib/validations';
import { useThemeAware, useTheme } from '../../hooks/useTheme';

const loginSchema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  clave: z.string().min(1, 'Clave requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const { login } = useAuthStore();
  const theme = useThemeAware();
  const { theme: currentTheme, setTheme } = useTheme();

  useEffect(() => {
    logger.info('LoginForm', 'Componente LoginForm montado');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Formateo automático de RUT
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatRUT(value);
    setValue('usuario', formatted);
  };

  const onSubmit = async (data: LoginFormData) => {
    logger.info('LoginForm', 'Intento de login iniciado', { usuario: data.usuario });
    setLoading(true);
    setAuthError('');

    try {
      logger.debug('LoginForm', 'Llamando función login del store');
      const success = await login(data.usuario, data.clave);

      if (success) {
        logger.info('LoginForm', 'Login exitoso');
      } else {
        logger.warn('LoginForm', 'Login fallido - credenciales incorrectas');
        setAuthError('Usuario o clave incorrectos');
      }
    } catch (error) {
      logger.error('LoginForm', 'Error durante el login', error);
      setAuthError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      setAuthError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setAuthError('');

    // Simulación de envío de email
    setTimeout(() => {
      setForgotPasswordSent(true);
      setLoading(false);
      logger.info('LoginForm', 'Simulación de recuperación de contraseña enviada', { email: forgotPasswordEmail });
    }, 2000);
  };

  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'light':
        return <SunIcon className="w-4 h-4" />;
      case 'dark':
        return <MoonIcon className="w-4 h-4" />;
      default:
        return <ComputerDesktopIcon className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      default:
        return 'Auto';
    }
  };

  const cycleTheme = () => {
    const themes = ['auto', 'light', 'dark'] as const;
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${theme.bg}`}>
      {/* Selector de Tema Oculto para evitar problemas de elementos perdidos */}

      <div className="max-w-md w-full space-y-8">
        {/* Header con logo SUSTENTA y tipografía consistente */}
        <div className="text-center">
          {/* Logo SUSTENTA cuadrado con efectos modernos */}
          <div className="mx-auto w-24 h-24 mb-8 relative">
            <div className={`absolute inset-0 rounded-2xl ${theme.bgSecondary} shadow-lg`}></div>
            <div className="relative p-3">
              <img
                src="/img/logo/logo_sustenta_cuadrado.png"
                alt="SUSTENTA Logo"
                className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className={`font-sans text-3xl font-bold ${theme.text} mb-2`}>
            Iniciar Sesión
          </h1>
          <p className={`font-sans text-base ${theme.textSecondary}`}>
            Plataforma de Gestión de Cursos
          </p>
          <div className={`mt-1 text-sm font-medium ${theme.text} opacity-80`}>
            SUSTENTA
          </div>
        </div>
        
        {/* Formulario con espaciado consistente */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Input
              label="Usuario (RUT)"
              type="text"
              autoComplete="username"
              required
              error={errors.usuario?.message}
              placeholder="Ej: 12.345.678-5"
              {...register('usuario', {
                onChange: handleRutChange
              })}
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
                className="absolute right-4 top-12 text-text-muted hover:text-text-secondary transition-colors"
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

          {/* Mensaje de error con sistema de temas */}
          {authError && (
            <div className="bg-error-50 border border-error-200 rounded p-4 dark:bg-error-900/20 dark:border-error-800" role="alert">
              <p className="font-sans text-sm text-error-700 dark:text-error-400 font-medium">{authError}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Ingresar
          </Button>

          {/* Enlace de recuperación de contraseña */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={`text-sm ${theme.textSecondary} hover:${theme.text} transition-colors underline`}
            >
              ¿Se te olvidó la contraseña?
            </button>
          </div>
        </form>

        {/* Información de usuarios de prueba - OCULTA PARA PRESENTACIÓN AL CLIENTE */}
        {/*
        <div className="mt-8 text-center">
          <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4`}>
            <p className={`font-sans text-sm font-semibold ${theme.text} mb-3`}>
              Usuarios de prueba:
            </p>
            <div className={`space-y-2 font-sans text-xs ${theme.textSecondary}`}>
              <p><strong className={theme.text}>Admin:</strong> Usuario: 11.111.111-1, Clave: admin</p>
              <p><strong className={theme.text}>Contratista:</strong> Usuario: 22.222.222-2, Clave: 1234</p>
              <p><strong className={theme.text}>Usuarios válidos para pruebas:</strong></p>
              <div className="ml-4 space-y-1">
                <p>• Juan Carlos Pérez González - 12.345.678-5, Clave: user123</p>
                <p>• María Elena Rodríguez Silva - 98.765.432-5, Clave: user123</p>
                <p>• Carlos Alberto Muñoz Torres - 15.678.234-3, Clave: user123</p>
              </div>
            </div>
          </div>
        </div>
        */}

        {/* Sección de Maqueta Interactiva con temas */}
        <div className="mt-6 text-center">
          <div className={`${theme.bgSecondary} border ${theme.border} p-4 rounded-xl shadow-sm`}>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className={`text-sm font-bold ${theme.text}`}>Maqueta Interactiva - Datos de Demostración</p>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <p className={`text-xs ${theme.textSecondary} mb-3`}>
              Esta es una simulación completa del sistema de gestión de cursos
            </p>

            {/* Información de temas - OCULTO */}
            {false && (
              <div className={`${theme.bg} border ${theme.borderLight} rounded-lg p-3 mb-3`}>
                <p className={`text-xs font-semibold ${theme.text} mb-2`}>🎨 Temas Disponibles:</p>
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <SunIcon className="w-3 h-3 text-yellow-500" />
                    <span className={theme.textSecondary}>Claro</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MoonIcon className="w-3 h-3 text-blue-500" />
                    <span className={theme.textSecondary}>Oscuro</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ComputerDesktopIcon className="w-3 h-3 text-gray-500" />
                    <span className={theme.textSecondary}>Auto</span>
                  </div>
                </div>
              </div>
            )}

            {/* Usuarios de prueba - OCULTO */}
            {false && (
              <div className={`${theme.bg} border ${theme.borderLight} rounded-lg p-3`}>
                <p className={`text-xs font-semibold ${theme.text} mb-2`}>👥 Usuarios de Prueba:</p>
                <div className={`space-y-1 text-xs ${theme.textSecondary}`}>
                  <div className="flex justify-between">
                    <span className="font-medium">Admin:</span>
                    <span>11.111.111-1 / admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Contratista:</span>
                    <span>22.222.222-2 / 1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Usuario:</span>
                    <span>12.345.678-5 / user123</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Recuperación de Contraseña */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${theme.bg} rounded-xl shadow-2xl max-w-md w-full p-6 border ${theme.border}`}>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${theme.text} mb-2`}>¿Olvidaste tu contraseña?</h3>
                <p className={`text-sm ${theme.textSecondary}`}>
                  {forgotPasswordSent
                    ? 'Te hemos enviado un enlace de recuperación a tu email'
                    : 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña'
                  }
                </p>
              </div>

              {!forgotPasswordSent ? (
                <div className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />

                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail('');
                        setForgotPasswordSent(false);
                        setAuthError('');
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleForgotPassword}
                      loading={loading}
                      className="flex-1"
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`${theme.bgSecondary} border ${theme.border} rounded-lg p-4`}>
                    <p className={`text-sm ${theme.text} font-medium mb-2`}>📧 Simulación de Email Enviado</p>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      En un sistema real, se enviaría un email a: <strong>{forgotPasswordEmail}</strong>
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                      setForgotPasswordSent(false);
                    }}
                    className="w-full"
                  >
                    Entendido
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <LogViewer />
    </div>
  );
}