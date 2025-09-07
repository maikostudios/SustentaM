import React, { createContext, useContext, ReactNode } from 'react';

interface MenuContextType {
  isMenuCollapsed: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
  isMenuCollapsed: boolean;
}

export function MenuProvider({ children, isMenuCollapsed }: MenuProviderProps) {
  return (
    <MenuContext.Provider value={{ isMenuCollapsed }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    // Si no hay contexto, devolver valor por defecto
    return { isMenuCollapsed: false };
  }
  return context;
}
