import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AdminLayout } from './AdminLayout';
import { ContractorLayout } from './ContractorLayout';
import { UserLayout } from './UserLayout';

interface LayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  breadcrumbs?: Array<{ label: string; href?: string; current?: boolean }>;
  title?: string;
  onHelpClick?: () => void;
}

export function Layout({
  children,
  activeSection,
  onSectionChange,
  breadcrumbs,
  title,
  onHelpClick
}: LayoutProps) {
  const { user } = useAuthStore();

  if (!user) return <>{children}</>;

  switch (user.rol) {
    case 'administrador':
      return (
        <AdminLayout
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          breadcrumbs={breadcrumbs}
          title={title}
          onHelpClick={onHelpClick}
        >
          {children}
        </AdminLayout>
      );
    case 'contratista':
      return (
        <ContractorLayout
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          breadcrumbs={breadcrumbs}
          title={title}
          onHelpClick={onHelpClick}
        >
          {children}
        </ContractorLayout>
      );
    case 'usuario':
      return <UserLayout>{children}</UserLayout>;
    default:
      return <>{children}</>;
  }
}