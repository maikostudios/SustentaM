import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { 
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
  itemName?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  loading = false,
  itemName
}: ConfirmationModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <TrashIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />;
      default:
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          iconBg: 'bg-yellow-100',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      default:
        return {
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
    }
  };

  const colors = getColors();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="space-y-6">
        {/* Icon and Title */}
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>{message}</p>
              
              {itemName && (
                <div className={`p-3 rounded-md ${colors.bg} border`}>
                  <p className="font-medium text-gray-900">
                    Elemento a eliminar:
                  </p>
                  <p className="text-gray-700 mt-1">
                    {itemName}
                  </p>
                </div>
              )}
              
              {type === 'danger' && (
                <p className="text-red-600 font-medium">
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>{cancelText}</span>
          </Button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
              ${colors.confirmButton}
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                {type === 'danger' && <TrashIcon className="w-4 h-4 mr-2" />}
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Componente específico para eliminación
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'elemento',
  loading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  loading?: boolean;
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Eliminar ${itemType}`}
      message={`¿Estás seguro de que deseas eliminar este ${itemType}? Esta acción eliminará permanentemente todos los datos asociados.`}
      confirmText="Eliminar"
      cancelText="Cancelar"
      type="danger"
      loading={loading}
      itemName={itemName}
    />
  );
}

// Componente para confirmación de acciones importantes
export function ActionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  actionName,
  loading = false,
  type = 'warning'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  actionName: string;
  loading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      confirmText={actionName}
      cancelText="Cancelar"
      type={type}
      loading={loading}
    />
  );
}
