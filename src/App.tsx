import React, { useEffect, useRef } from 'react';
import { useAuthStore } from './store/authStore';
import { initializeData } from './lib/database';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContractorDashboard } from './pages/ContractorDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { ToastProvider } from './contexts/ToastContext';
import { logger } from './utils/logger';
import { LogViewer } from './components/debug/LogViewer';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const initializeRef = useRef(false);

  useEffect(() => {
    logger.info('App', 'Aplicación iniciada');
    // Initialize sample data only once
    if (!initializeRef.current) {
      initializeRef.current = true;
      logger.debug('App', 'Inicializando base de datos');
      initializeData().catch(error => {
        logger.error('App', 'Error al inicializar base de datos', error);
        console.warn('Failed to initialize database:', error);
      });
    }
  }, []);

  useEffect(() => {
    logger.info('App', 'Estado de autenticación cambiado', {
      isAuthenticated,
      userRole: user?.rol,
      userId: user?.id
    });
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    logger.debug('App', 'Usuario no autenticado, mostrando LoginForm');
    return <LoginForm />;
  }

  const renderDashboard = () => {
    logger.debug('App', 'Renderizando dashboard', { userRole: user?.rol });
    switch (user?.rol) {
      case 'administrador':
        logger.info('App', 'Cargando AdminDashboard');
        return <AdminDashboard />;
      case 'contratista':
        logger.info('App', 'Cargando ContractorDashboard');
        return <ContractorDashboard />;
      case 'usuario':
        logger.info('App', 'Cargando UserDashboard');
        return <UserDashboard />;
      default:
        logger.warn('App', 'Rol no reconocido', { rol: user?.rol });
        return <div>Rol no reconocido</div>;
    }
  };

  return (
    <ToastProvider defaultPosition="bottom-right" maxToasts={5}>
      <div className="min-h-screen bg-gray-50">
        {renderDashboard()}
      </div>
      <LogViewer />
    </ToastProvider>
  );
}

export default App;
