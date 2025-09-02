import React from 'react';
import { Button } from '../ui/Button';
import { useNotifications, NotificationTemplates } from '../../contexts/ToastContext';

export function NotificationDemo() {
  const notifications = useNotifications();

  const demoNotifications = [
    {
      title: 'Notificación de Éxito',
      action: () => notifications.success(
        'Operación exitosa',
        'La operación se completó correctamente.',
        { duration: 4000 }
      )
    },
    {
      title: 'Notificación de Error',
      action: () => notifications.error(
        'Error crítico',
        'Ha ocurrido un error que requiere atención inmediata.',
        { persistent: true }
      )
    },
    {
      title: 'Notificación de Advertencia',
      action: () => notifications.warning(
        'Advertencia importante',
        'Esta acción puede tener consecuencias importantes.',
        { duration: 6000 }
      )
    },
    {
      title: 'Notificación Informativa',
      action: () => notifications.info(
        'Información útil',
        'Aquí tienes información relevante sobre el sistema.',
        { duration: 5000 }
      )
    },
    {
      title: 'Con Acción',
      action: () => notifications.success(
        'Archivo subido',
        'El archivo se ha subido correctamente.',
        {
          action: {
            label: 'Ver archivo',
            onClick: () => notifications.info('Abriendo archivo...')
          }
        }
      )
    },
    {
      title: 'Posición Superior Izquierda',
      action: () => notifications.info(
        'Posición personalizada',
        'Esta notificación aparece en la esquina superior izquierda.',
        { position: 'top-left' }
      )
    },
    {
      title: 'Posición Superior Centro',
      action: () => notifications.warning(
        'Notificación centrada',
        'Esta notificación aparece en el centro superior.',
        { position: 'top-center' }
      )
    },
    {
      title: 'Posición Inferior Centro',
      action: () => notifications.success(
        'Notificación centrada abajo',
        'Esta notificación aparece en el centro inferior.',
        { position: 'bottom-center' }
      )
    },
    {
      title: 'Notificación Persistente',
      action: () => notifications.error(
        'Error persistente',
        'Esta notificación no se cierra automáticamente.',
        { persistent: true }
      )
    },
    {
      title: 'Múltiples Notificaciones',
      action: () => {
        notifications.success('Primera notificación', 'Mensaje 1');
        setTimeout(() => notifications.info('Segunda notificación', 'Mensaje 2'), 500);
        setTimeout(() => notifications.warning('Tercera notificación', 'Mensaje 3'), 1000);
      }
    }
  ];

  const templateDemos = [
    {
      title: 'Guardado Exitoso',
      action: () => notifications.addToast(NotificationTemplates.saveSuccess('curso'))
    },
    {
      title: 'Error al Guardar',
      action: () => notifications.addToast(NotificationTemplates.saveError('Error de validación'))
    },
    {
      title: 'Eliminación Exitosa',
      action: () => notifications.addToast(NotificationTemplates.deleteSuccess('participante'))
    },
    {
      title: 'Error de Red',
      action: () => notifications.addToast(NotificationTemplates.networkError())
    },
    {
      title: 'Sesión Expirada',
      action: () => notifications.addToast(NotificationTemplates.sessionExpired())
    },
    {
      title: 'Archivo Subido',
      action: () => notifications.addToast(NotificationTemplates.uploadSuccess('documento.pdf'))
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Demo del Sistema de Notificaciones Mejorado
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Prueba las diferentes funcionalidades del sistema de notificaciones:
        </p>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Tipos y Posiciones</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {demoNotifications.map((demo, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={demo.action}
              className="text-left justify-start"
            >
              {demo.title}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Plantillas Predefinidas</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {templateDemos.map((demo, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={demo.action}
              className="text-left justify-start"
            >
              {demo.title}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Acciones de Control</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => notifications.removeAllToasts()}
          >
            Limpiar Todas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const id = notifications.info('Notificación temporal', 'Esta se actualizará en 2 segundos...');
              setTimeout(() => {
                notifications.updateToast(id, {
                  type: 'success',
                  title: 'Notificación actualizada',
                  message: 'El contenido ha sido actualizado dinámicamente.'
                });
              }, 2000);
            }}
          >
            Actualizar Notificación
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Características Implementadas:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Múltiples tipos (success, error, warning, info)</li>
          <li>✅ Posicionamiento configurable (6 posiciones)</li>
          <li>✅ Animaciones suaves de entrada y salida</li>
          <li>✅ Notificaciones persistentes y temporales</li>
          <li>✅ Botones de acción personalizados</li>
          <li>✅ Barra de progreso para duración</li>
          <li>✅ Plantillas predefinidas para casos comunes</li>
          <li>✅ Control programático (crear, actualizar, eliminar)</li>
          <li>✅ Límite máximo de notificaciones</li>
          <li>✅ Accesibilidad mejorada (ARIA, lectores de pantalla)</li>
        </ul>
      </div>
    </div>
  );
}
