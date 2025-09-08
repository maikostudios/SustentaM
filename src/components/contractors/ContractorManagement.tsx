import React, { useState, useMemo } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { DeleteConfirmationModal } from '../ui/ConfirmationModal';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/ToastContext';

interface Contractor {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  rut: string;
  direccion: string;
  fechaRegistro: string;
  estado: 'activo' | 'inactivo';
}

// Datos mock de contratistas
const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: '1',
    nombre: 'Juan Carlos Pérez',
    empresa: 'TechSolutions SpA',
    email: 'juan.perez@techsolutions.cl',
    telefono: '+56 9 8765 4321',
    rut: '12.345.678-5',
    direccion: 'Av. Providencia 1234, Santiago',
    fechaRegistro: '2024-01-15',
    estado: 'activo'
  },
  {
    id: '2',
    nombre: 'María Elena Rodríguez',
    empresa: 'Innovación Digital Ltda',
    email: 'maria.rodriguez@innovacion.cl',
    telefono: '+56 9 7654 3210',
    rut: '98.765.432-1',
    direccion: 'Las Condes 567, Santiago',
    fechaRegistro: '2024-02-20',
    estado: 'activo'
  },
  {
    id: '3',
    nombre: 'Carlos Alberto Muñoz',
    empresa: 'Capacitación Pro',
    email: 'carlos.munoz@capacitacionpro.cl',
    telefono: '+56 9 5432 1098',
    rut: '15.678.234-9',
    direccion: 'Ñuñoa 890, Santiago',
    fechaRegistro: '2024-03-10',
    estado: 'inactivo'
  },
  {
    id: '4',
    nombre: 'Ana Patricia López',
    empresa: 'Formación Empresarial',
    email: 'ana.lopez@formacion.cl',
    telefono: '+56 9 3210 9876',
    rut: '22.456.789-3',
    direccion: 'Maipú 456, Santiago',
    fechaRegistro: '2024-04-05',
    estado: 'activo'
  }
];

export function ContractorManagement() {
  const [contractors, setContractors] = useState<Contractor[]>(MOCK_CONTRACTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const notifications = useNotifications();

  // Filtrar contratistas por término de búsqueda
  const filteredContractors = useMemo(() => {
    if (!searchTerm) return contractors;
    
    const term = searchTerm.toLowerCase();
    return contractors.filter(contractor =>
      contractor.nombre.toLowerCase().includes(term) ||
      contractor.empresa.toLowerCase().includes(term) ||
      contractor.email.toLowerCase().includes(term) ||
      contractor.rut.includes(term)
    );
  }, [contractors, searchTerm]);

  const handleCreate = () => {
    setEditingContractor(null);
    setShowForm(true);
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setShowForm(true);
  };

  const handleDelete = (contractorId: string) => {
    setShowDeleteConfirm(contractorId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      const contractor = contractors.find(c => c.id === showDeleteConfirm);
      setContractors(prev => prev.filter(c => c.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
      
      notifications.success(
        'Contratista eliminado',
        `${contractor?.nombre} ha sido eliminado exitosamente.`
      );
    }
  };

  const handleSubmit = (contractorData: Omit<Contractor, 'id' | 'fechaRegistro'>) => {
    if (editingContractor) {
      // Actualizar contratista existente
      setContractors(prev => prev.map(c => 
        c.id === editingContractor.id 
          ? { ...contractorData, id: editingContractor.id, fechaRegistro: editingContractor.fechaRegistro }
          : c
      ));
      notifications.success(
        'Contratista actualizado',
        `${contractorData.nombre} ha sido actualizado exitosamente.`
      );
    } else {
      // Crear nuevo contratista
      const newContractor: Contractor = {
        ...contractorData,
        id: Date.now().toString(),
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      setContractors(prev => [...prev, newContractor]);
      notifications.success(
        'Contratista creado',
        `${contractorData.nombre} ha sido agregado exitosamente.`
      );
    }
    setShowForm(false);
    setEditingContractor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Contratistas</h2>
          <p className="font-sans text-gray-600 dark:text-gray-400">Administra los contratistas y sus datos de contacto</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Nuevo Contratista</span>
        </Button>
      </div>

      {/* Buscador */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Buscar por nombre, empresa, email o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <UserIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            <div className="ml-3">
              <div className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">{contractors.length}</div>
              <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Total Contratistas</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
            <div className="ml-3">
              <div className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">
                {contractors.filter(c => c.estado === 'activo').length}
              </div>
              <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Activos</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <EnvelopeIcon className="w-8 h-8 text-amber-500 dark:text-amber-400" />
            <div className="ml-3">
              <div className="font-sans text-2xl font-bold text-gray-900 dark:text-gray-100">
                {contractors.filter(c => c.estado === 'inactivo').length}
              </div>
              <div className="font-sans text-sm text-gray-600 dark:text-gray-400">Inactivos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de contratistas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contratista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContractors.map((contractor) => (
                <tr key={contractor.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-sans text-sm font-medium text-gray-900 dark:text-gray-100">{contractor.nombre}</div>
                      <div className="font-sans text-sm text-gray-500 dark:text-gray-400">{contractor.rut}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-sans text-sm text-gray-900 dark:text-gray-100">{contractor.empresa}</div>
                    <div className="font-sans text-sm text-gray-500 dark:text-gray-400">{contractor.direccion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-sans text-sm text-gray-900 dark:text-gray-100">{contractor.email}</div>
                    <div className="font-sans text-sm text-gray-500 dark:text-gray-400">{contractor.telefono}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contractor.estado === 'activo'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {contractor.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(contractor.fechaRegistro).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(contractor)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contractor.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContractors.length === 0 && (
          <div className="text-center py-8">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="font-sans mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No se encontraron contratistas</h3>
            <p className="font-sans mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando un nuevo contratista.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <ContractorForm
          contractor={editingContractor}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingContractor(null);
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Eliminar Contratista"
        message={`¿Estás seguro de que deseas eliminar a ${contractors.find(c => c.id === showDeleteConfirm)?.nombre}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}

// Componente de formulario (se implementará en el siguiente paso)
function ContractorForm({ contractor, onSubmit, onCancel }: {
  contractor: Contractor | null;
  onSubmit: (data: Omit<Contractor, 'id' | 'fechaRegistro'>) => void;
  onCancel: () => void;
}) {
  return (
    <Modal 
      isOpen={true} 
      onClose={onCancel} 
      title={contractor ? 'Editar Contratista' : 'Nuevo Contratista'}
    >
      <div className="p-4">
        <p>Formulario de contratista (por implementar)</p>
        <div className="flex justify-end space-x-3 mt-4">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button onClick={() => onSubmit({
            nombre: 'Test',
            empresa: 'Test',
            email: 'test@test.com',
            telefono: '123456789',
            rut: '12345678-9',
            direccion: 'Test',
            estado: 'activo'
          })}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
