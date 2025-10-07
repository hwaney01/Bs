import React, { useState, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PermissionProvider } from './context/PermissionContext';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import ViewRecords from './components/ViewRecords';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';
import WarrantyManagement from './components/WarrantyManagement';
import Reports from './components/Reports';
import ContactsManagement from './components/ContactsManagement';
import Sales from './components/Sales';
import PurchasesManagement from './components/PurchasesManagement';
import PermissionsManagement from './components/PermissionsManagement';
import { HomeIcon, PlusCircleIcon, TableCellsIcon, UsersIcon, CubeIcon, ChartBarIcon, ContactsIcon, CogIcon, ShieldCheckIcon, SalesIcon, PurchasesIcon } from './components/Icons';

export type View = 'DASHBOARD' | 'ADD_RECORD' | 'VIEW_RECORDS' | 'USERS' | 'PRODUCTS' | 'REPORTS' | 'CONTACTS' | 'PERMISSIONS' | 'WARRANTY' | 'SALES' | 'PURCHASES';

export interface NavItem {
  name: string;
  view: View;
  icon: ReactNode;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <PermissionProvider>
          <Main />
        </Permission-Provider>
      </DataProvider>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');

  if (!user) {
    return <LoginForm />;
  }
  
  const navItems: NavItem[] = [
    { name: 'لوحة التحكم', view: 'DASHBOARD', icon: <HomeIcon /> },
    { name: 'التقارير', view: 'REPORTS', icon: <ChartBarIcon /> },
    { name: 'إضافة سجل خدمة', view: 'ADD_RECORD', icon: <PlusCircleIcon /> },
    { name: 'عرض سجلات الخدمة', view: 'VIEW_RECORDS', icon: <TableCellsIcon /> },
    { name: 'المبيعات', view: 'SALES', icon: <SalesIcon /> },
    { name: 'المشتريات', view: 'PURCHASES', icon: <PurchasesIcon /> },
    { name: 'جهات الاتصال', view: 'CONTACTS', icon: <ContactsIcon /> },
    { name: 'إدارة المنتجات', view: 'PRODUCTS', icon: <CubeIcon /> },
    { name: 'المستخدمون', view: 'USERS', icon: <UsersIcon /> },
    { name: 'إدارة الضمان', view: 'WARRANTY', icon: <ShieldCheckIcon /> },
    { name: 'الصلاحيات', view: 'PERMISSIONS', icon: <CogIcon /> },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'REPORTS':
        return <Reports />;
      case 'ADD_RECORD':
        return <AddRecord onRecordAdded={() => setCurrentView('VIEW_RECORDS')} />;
      case 'VIEW_RECORDS':
        return <ViewRecords />;
      case 'SALES':
        return <Sales />;
      case 'PURCHASES':
        return <PurchasesManagement />;
      case 'CONTACTS':
        return <ContactsManagement />;
      case 'PRODUCTS':
        return <ProductManagement />;
      case 'USERS':
        return <UserManagement />;
      case 'WARRANTY':
        return <WarrantyManagement />;
      case 'PERMISSIONS':
        return <PermissionsManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        navItems={navItems}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
