import React, { useRef, useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { useFocusManagement, useKeyboardNavigation, useScreenReader } from '../../hooks/useAccessibility';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Componente de botón accesible mejorado
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  announceOnClick?: string;
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  ariaLabel,
  ariaDescribedBy,
  announceOnClick,
  className,
  onClick,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const { announce } = useScreenReader();
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (announceOnClick) {
      announce(announceOnClick, 'polite');
    }
    onClick?.(e);
  }, [onClick, announceOnClick, announce]);

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm min-w-[2rem]',
    md: 'h-10 px-4 text-sm min-w-[2.5rem]',
    lg: 'h-12 px-6 text-base min-w-[3rem]'
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={clsx('h-4 w-4', children && 'mr-2')} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={clsx('h-4 w-4', children && 'ml-2')} />
      )}
    </button>
  );
}

// Componente de lista accesible con navegación por teclado
interface AccessibleListProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isSelected: boolean, isFocused: boolean) => React.ReactNode;
  onSelect?: (item: T, index: number) => void;
  onActivate?: (item: T, index: number) => void;
  selectedIndex?: number;
  multiSelect?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function AccessibleList<T>({
  items,
  renderItem,
  onSelect,
  onActivate,
  selectedIndex = -1,
  multiSelect = false,
  ariaLabel = 'Lista de elementos',
  className
}: AccessibleListProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const listRef = useRef<HTMLUListElement>(null);
  const { announce } = useScreenReader();

  useKeyboardNavigation({
    onArrowDown: () => {
      setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
    },
    onArrowUp: () => {
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    },
    onHome: () => {
      setFocusedIndex(0);
    },
    onEnd: () => {
      setFocusedIndex(items.length - 1);
    },
    onEnter: () => {
      if (focusedIndex >= 0 && focusedIndex < items.length) {
        handleActivate(focusedIndex);
      }
    }
  });

  const handleSelect = useCallback((index: number) => {
    if (multiSelect) {
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
    onSelect?.(items[index], index);
    announce(`Elemento ${index + 1} seleccionado`, 'polite');
  }, [items, onSelect, multiSelect, announce]);

  const handleActivate = useCallback((index: number) => {
    onActivate?.(items[index], index);
    announce(`Elemento ${index + 1} activado`, 'polite');
  }, [items, onActivate, announce]);

  useEffect(() => {
    if (listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.focus();
      }
    }
  }, [focusedIndex]);

  return (
    <ul
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      aria-multiselectable={multiSelect}
      aria-activedescendant={`list-item-${focusedIndex}`}
      className={clsx('focus:outline-none', className)}
      tabIndex={0}
    >
      {items.map((item, index) => (
        <li
          key={index}
          id={`list-item-${index}`}
          role="option"
          aria-selected={multiSelect ? selectedItems.has(index) : index === selectedIndex}
          tabIndex={-1}
          className={clsx(
            'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
            index === focusedIndex && 'ring-2 ring-blue-500 ring-inset'
          )}
          onClick={() => handleSelect(index)}
          onDoubleClick={() => handleActivate(index)}
        >
          {renderItem(item, index, multiSelect ? selectedItems.has(index) : index === selectedIndex, index === focusedIndex)}
        </li>
      ))}
    </ul>
  );
}

// Componente de acordeón accesible
interface AccessibleAccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
  }>;
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

export function AccessibleAccordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className
}: AccessibleAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(defaultExpanded));
  const { announce } = useScreenReader();

  const toggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      const isExpanded = newSet.has(id);
      
      if (isExpanded) {
        newSet.delete(id);
        announce(`Sección ${id} colapsada`, 'polite');
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
        announce(`Sección ${id} expandida`, 'polite');
      }
      
      return newSet;
    });
  }, [allowMultiple, announce]);

  return (
    <div className={clsx('space-y-2', className)}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.has(item.id);
        const headingId = `accordion-heading-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="border border-gray-200 rounded-lg">
            <h3 id={headingId}>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => !item.disabled && toggleItem(item.id)}
                className={clsx(
                  'flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-900 hover:bg-gray-50'
                )}
              >
                <span>{item.title}</span>
                {isExpanded ? (
                  <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </h3>
            
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isExpanded}
              className={clsx(
                'transition-all duration-200',
                isExpanded ? 'block' : 'hidden'
              )}
            >
              <div className="px-4 py-3 border-t border-gray-200">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Componente de alerta accesible
interface AccessibleAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function AccessibleAlert({
  type,
  title,
  children,
  dismissible = false,
  onDismiss,
  className
}: AccessibleAlertProps) {
  const { announce } = useScreenReader();

  useEffect(() => {
    if (type === 'error') {
      announce(`Error: ${title || 'Se ha producido un error'}`, 'assertive');
    } else if (type === 'success') {
      announce(`Éxito: ${title || 'Operación completada'}`, 'polite');
    }
  }, [type, title, announce]);

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <InformationCircleIcon className="h-5 w-5" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
    }
  };

  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={clsx(
        'rounded-md border p-4',
        getStyles(),
        className
      )}
    >
      <div className="flex">
        <div className={clsx('flex-shrink-0', getIconColor())}>
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Cerrar alerta"
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  type === 'info' && 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600',
                  type === 'success' && 'text-green-500 hover:bg-green-100 focus:ring-green-600',
                  type === 'warning' && 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                  type === 'error' && 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                )}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de skip links
interface SkipLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function SkipLinks({ links }: SkipLinksProps) {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-50 bg-blue-600 text-white p-2 space-x-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="inline-block px-3 py-1 bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// Componente de región landmark
interface LandmarkRegionProps {
  role: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  className?: string;
}

export function LandmarkRegion({
  role,
  ariaLabel,
  ariaLabelledBy,
  children,
  className
}: LandmarkRegionProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      {children}
    </div>
  );
}

// Componente de anuncio para lectores de pantalla
interface ScreenReaderAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

export function ScreenReaderAnnouncement({
  message,
  priority = 'polite',
  clearAfter = 1000
}: ScreenReaderAnnouncementProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);
    
    if (clearAfter > 0) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
}
