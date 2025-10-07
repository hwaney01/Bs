import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Role } from '../types';
import { View } from '../App';

type PermissionsMap = {
  [key in Role]: View[];
};

interface PermissionContextType {
  permissions: PermissionsMap;
  canAccess: (role: Role, view: View) => boolean;
  updatePermissions: (newPermissions: PermissionsMap) => void;
}

const PERMISSIONS_KEY = 'service_desk_permissions';

const allViews: View[] = ['DASHBOARD', 'ADD_RECORD', 'VIEW_RECORDS', 'USERS', 'PRODUCTS', 'REPORTS', 'CONTACTS', 'PERMISSIONS', 'WARRANTY', 'SALES', 'PURCHASES'];

const defaultPermissions: PermissionsMap = {
  [Role.ADMIN]: allViews,
  [Role.EMPLOYEE]: ['DASHBOARD', 'ADD_RECORD', 'VIEW_RECORDS', 'CONTACTS', 'SALES', 'PURCHASES'],
  [Role.VIEWER]: ['DASHBOARD', 'REPORTS', 'VIEW_RECORDS', 'CONTACTS', 'SALES'],
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsMap>(() => {
    try {
      const stored = localStorage.getItem(PERMISSIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure Admin always has all permissions
        parsed[Role.ADMIN] = allViews;
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse permissions from localStorage", error);
    }
    return defaultPermissions;
  });

  const updatePermissions = useCallback((newPermissions: PermissionsMap) => {
    // Ensure Admin permissions are not removed
    const securedPermissions = {
        ...newPermissions,
        [Role.ADMIN]: allViews,
    };
    setPermissions(securedPermissions);
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(securedPermissions));
  }, []);
  
  const canAccess = useCallback((role: Role, view: View): boolean => {
    return permissions[role]?.includes(view) || false;
  }, [permissions]);

  const value = { permissions, canAccess, updatePermissions };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
