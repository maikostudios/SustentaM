import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// Skeleton Loaders
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
        ))}
      </div>
      <div className="bg-gray-200 h-64 rounded-lg"></div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="p-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-80 rounded-lg"></div>
        <div className="bg-gray-200 h-80 rounded-lg"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white shadow rounded-lg animate-pulse">
      <div className="px-4 py-5 sm:p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex space-x-3">
        <div className="h-10 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

// Lazy Components con Suspense
const LazySimpleReportsDashboard = lazy(() => import('../reports/SimpleReportsDashboard'));
const LazySimpleCourseCalendar = lazy(() => import('../calendar/SimpleCourseCalendar'));
const LazySimpleCertificateGenerator = lazy(() => import('../certificates/SimpleCertificateGenerator'));
const LazyCertificatePreview = lazy(() => import('../certificates/CertificatePreview'));
const LazyAttendanceImportDialog = lazy(() => import('../attendance/AttendanceImportDialog'));
const LazyNotificationDemo = lazy(() => import('../demo/NotificationDemo'));

// Wrapper Components con Suspense y Error Boundaries
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

function LazyWrapper({ children, fallback, errorFallback }: LazyWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Error al cargar componente</h3>
          <p className="text-red-600 text-sm mt-1">
            Ha ocurrido un error al cargar este componente. Intenta recargar la página.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Exported Lazy Components
export function LazyReports(props: any) {
  return (
    <LazyWrapper
      fallback={<ReportsSkeleton />}
      errorFallback={
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">No se pudo cargar el dashboard de reportes.</p>
        </div>
      }
    >
      <LazySimpleReportsDashboard {...props} />
    </LazyWrapper>
  );
}

export function LazyCalendar(props: any) {
  return (
    <LazyWrapper
      fallback={<CalendarSkeleton />}
      errorFallback={
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">No se pudo cargar el calendario.</p>
        </div>
      }
    >
      <LazySimpleCourseCalendar {...props} />
    </LazyWrapper>
  );
}

export function LazyCertificateGenerator(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Cargando generador de certificados...</span>
        </div>
      }
    >
      <LazySimpleCertificateGenerator {...props} />
    </LazyWrapper>
  );
}

export function LazyCertificatePreviewComponent(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Cargando vista previa...</span>
        </div>
      }
    >
      <LazyCertificatePreview {...props} />
    </LazyWrapper>
  );
}

export function LazyAttendanceImport(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Cargando importador de asistencia...</span>
        </div>
      }
    >
      <LazyAttendanceImportDialog {...props} />
    </LazyWrapper>
  );
}

export function LazyNotificationDemoComponent(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Cargando demo de notificaciones...</span>
        </div>
      }
    >
      <LazyNotificationDemo {...props} />
    </LazyWrapper>
  );
}
