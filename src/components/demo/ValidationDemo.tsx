import React, { useState } from 'react';
import { EnhancedInput, RutInput, EmailInput } from '../ui/EnhancedInput';
import { PasswordInput, PasswordConfirmInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';
import { 
  useRutValidation, 
  useEmailValidation, 
  usePasswordValidation,
  useDateValidation 
} from '../../hooks/useFormValidation';
import { 
  ShieldCheckIcon, 
  UserIcon, 
  EnvelopeIcon,
  KeyIcon,
  CalendarDaysIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function ValidationDemo() {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: ''
  });

  const [validationStates, setValidationStates] = useState({
    nombre: { isValid: false, error: '' },
    rut: { isValid: false, error: '' },
    email: { isValid: false, error: '' },
    password: { isValid: false, error: '' },
    confirmPassword: { isValid: false, error: '' }
  });

  const { validateEmail } = useEmailValidation();
  const { validatePassword } = usePasswordValidation();
  const { validateDateRange } = useDateValidation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRutChange = (rut: string, isValid: boolean, formatted: string) => {
    setFormData(prev => ({ ...prev, rut: formatted }));
    setValidationStates(prev => ({
      ...prev,
      rut: { isValid, error: isValid ? '' : 'RUT inválido' }
    }));
  };

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    const validation = validateEmail(email);
    setValidationStates(prev => ({
      ...prev,
      email: { isValid: validation.isValid, error: validation.error }
    }));
  };

  const handlePasswordChange = (password: string, validation: any) => {
    setFormData(prev => ({ ...prev, password }));
    setValidationStates(prev => ({
      ...prev,
      password: { isValid: validation.isValid, error: validation.errors[0] || '' }
    }));
  };

  const handleConfirmPasswordChange = (isMatch: boolean) => {
    setValidationStates(prev => ({
      ...prev,
      confirmPassword: { isValid: isMatch, error: isMatch ? '' : 'Las contraseñas no coinciden' }
    }));
  };

  const isFormValid = Object.values(validationStates).every(state => state.isValid) &&
    Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShieldCheckIcon className="w-6 h-6 mr-2" />
          Demo de Validación de Formularios Mejorada
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Demostración de validación en tiempo real, RUT chileno, contraseñas seguras, 
          sugerencias de email y feedback visual mejorado.
        </p>
      </div>

      {/* Formulario de demostración */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h4 className="text-md font-medium text-gray-800 mb-6">Formulario de Registro</h4>
        
        <div className="space-y-6">
          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <h5 className="font-medium text-gray-700">Información Personal</h5>
              </div>
              
              <div className="space-y-4">
                <EnhancedInput
                  label="Nombre Completo"
                  required
                  value={formData.nombre}
                  onChange={(value) => handleInputChange('nombre', value)}
                  placeholder="Ej: Juan Pérez González"
                  helperText="Ingresa tu nombre completo"
                  realTimeValidation
                  showValidationIcon
                />

                <RutInput
                  label="RUT"
                  required
                  onChange={handleRutChange}
                  helperText="Formato automático: 12.345.678-5"
                />

                <EnhancedInput
                  label="Fecha de Nacimiento"
                  type="date"
                  required
                  value={formData.fechaNacimiento}
                  onChange={(value) => handleInputChange('fechaNacimiento', value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <EnvelopeIcon className="h-5 w-5 text-green-600" />
                <h5 className="font-medium text-gray-700">Información de Contacto</h5>
              </div>
              
              <div className="space-y-4">
                <EmailInput
                  label="Email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="usuario@ejemplo.com"
                  helperText="Recibirás sugerencias para dominios mal escritos"
                  showSuggestions
                />

                <EnhancedInput
                  label="Teléfono"
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(value) => handleInputChange('telefono', value)}
                  placeholder="+56 9 1234 5678"
                  helperText="Incluye código de país"
                />

                <EnhancedInput
                  label="Dirección"
                  required
                  value={formData.direccion}
                  onChange={(value) => handleInputChange('direccion', value)}
                  placeholder="Calle, número, comuna, ciudad"
                />
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <KeyIcon className="h-5 w-5 text-purple-600" />
              <h5 className="font-medium text-gray-700">Seguridad</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordInput
                label="Contraseña"
                required
                onChange={handlePasswordChange}
                showStrengthIndicator
                showRequirements
                helperText="Debe cumplir todos los requisitos de seguridad"
              />

              <PasswordConfirmInput
                label="Confirmar Contraseña"
                required
                originalPassword={formData.password}
                onMatch={handleConfirmPasswordChange}
                helperText="Debe coincidir con la contraseña anterior"
              />
            </div>
          </div>
        </div>

        {/* Estado del formulario */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-3">Estado de Validación</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(validationStates).map(([field, state]) => (
              <div key={field} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  state.isValid ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                {state.isValid && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={!isFormValid}
            className={isFormValid ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isFormValid ? 'Formulario Válido - Enviar' : 'Completa todos los campos'}
          </Button>
        </div>
      </div>

      {/* Ejemplos de validación específica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Validación de RUT */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="text-blue-900 font-medium mb-3">Validación de RUT Chileno</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>✅ Formato automático con puntos y guión</li>
            <li>✅ Validación de dígito verificador</li>
            <li>✅ Feedback visual en tiempo real</li>
            <li>✅ Manejo de RUTs con K</li>
            <li>✅ Limpieza automática de caracteres inválidos</li>
          </ul>
          
          <div className="mt-4">
            <p className="text-xs text-blue-700 font-medium">Ejemplos válidos:</p>
            <p className="text-xs text-blue-600">12.345.678-5, 9.876.543-K</p>
          </div>
        </div>

        {/* Validación de contraseñas */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h4 className="text-purple-900 font-medium mb-3">Validación de Contraseñas</h4>
          <ul className="text-purple-800 text-sm space-y-1">
            <li>✅ Indicador de fortaleza visual</li>
            <li>✅ Requisitos en tiempo real</li>
            <li>✅ Detección de patrones débiles</li>
            <li>✅ Sugerencias de mejora</li>
            <li>✅ Confirmación de contraseña</li>
          </ul>
          
          <div className="mt-4">
            <p className="text-xs text-purple-700 font-medium">Requisitos:</p>
            <p className="text-xs text-purple-600">8+ caracteres, mayúsculas, minúsculas, números, símbolos</p>
          </div>
        </div>

        {/* Validación de email */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="text-green-900 font-medium mb-3">Validación de Email</h4>
          <ul className="text-green-800 text-sm space-y-1">
            <li>✅ Validación de formato RFC compliant</li>
            <li>✅ Sugerencias para dominios mal escritos</li>
            <li>✅ Detección de errores comunes</li>
            <li>✅ Feedback visual inmediato</li>
          </ul>
          
          <div className="mt-4">
            <p className="text-xs text-green-700 font-medium">Sugerencias automáticas:</p>
            <p className="text-xs text-green-600">gmial.com → gmail.com</p>
          </div>
        </div>

        {/* Validación de fechas */}
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h4 className="text-orange-900 font-medium mb-3">Validación de Fechas</h4>
          <ul className="text-orange-800 text-sm space-y-1">
            <li>✅ Validación de rangos lógicos</li>
            <li>✅ Verificación de fechas futuras/pasadas</li>
            <li>✅ Validación de períodos</li>
            <li>✅ Restricciones de edad</li>
          </ul>
          
          <div className="mt-4">
            <p className="text-xs text-orange-700 font-medium">Validaciones:</p>
            <p className="text-xs text-orange-600">Fecha fin &gt; fecha inicio, límites de edad</p>
          </div>
        </div>
      </div>

      {/* Resumen de características */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="text-gray-900 font-medium mb-3">Características Implementadas:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-gray-700 text-sm space-y-1">
            <li>✅ Validación en tiempo real con debounce</li>
            <li>✅ Feedback visual inmediato</li>
            <li>✅ Mensajes de error específicos</li>
            <li>✅ Sugerencias automáticas</li>
            <li>✅ Indicadores de fortaleza</li>
            <li>✅ Validación de RUT chileno completa</li>
          </ul>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>✅ Esquemas de validación con Zod</li>
            <li>✅ Hooks personalizados reutilizables</li>
            <li>✅ Componentes optimizados con React.memo</li>
            <li>✅ Accesibilidad mejorada (ARIA)</li>
            <li>✅ Integración con React Hook Form</li>
            <li>✅ Manejo de errores robusto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
