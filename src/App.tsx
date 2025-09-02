import React, { useEffect, useRef } from 'react';
import { useAuthStore } from './store/authStore';
import { initializeData } from './lib/database';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContractorDashboard } from './pages/ContractorDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const initializeRef = useRef(false);

  useEffect(() => {
    // Initialize sample data only once
    if (!initializeRef.current) {
      initializeRef.current = true;
      initializeData().catch(error => {
        console.warn('Failed to initialize database:', error);
      });
    }
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user?.rol) {
      case 'administrador':
        return <AdminDashboard />;
      case 'contratista':
        return <ContractorDashboard />;
      case 'usuario':
        return <UserDashboard />;
      default:
        return <div>Rol no reconocido</div>;
    }
  };

  return (
    <ToastProvider defaultPosition="bottom-right" maxToasts={5}>
      <div className="min-h-screen bg-gray-50">
        {renderDashboard()}
      </div>
    </ToastProvider>
  );
}

export default App;
