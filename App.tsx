
import React, { useState, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import ViewRecords from './components/ViewRecords';
import UserManagement from './components/UserManagement';
import { HomeIcon, PlusCircleIcon, TableCellsIcon, UsersIcon } from './components/Icons';

export type View = 'DASHBOARD' | 'ADD_RECORD' | 'VIEW_RECORDS' | 'USERS';

export interface NavItem {
  name: string;
  view: View;
  icon: ReactNode;
  roles?: string[];
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Main />
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
  
  // FIX: Explicitly type navItems to prevent TypeScript from inferring 'view' as a generic string instead of the 'View' type.
  const navItems: NavItem[] = [
    { name: 'Dashboard', view: 'DASHBOARD', icon: <HomeIcon /> },
    { name: 'Add Record', view: 'ADD_RECORD', icon: <PlusCircleIcon />, roles: ['Admin', 'Employee'] },
    { name: 'View All Records', view: 'VIEW_RECORDS', icon: <TableCellsIcon /> },
    { name: 'Users', view: 'USERS', icon: <UsersIcon />, roles: ['Admin'] },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'ADD_RECORD':
        return <AddRecord onRecordAdded={() => setCurrentView('VIEW_RECORDS')} />;
      case 'VIEW_RECORDS':
        return <ViewRecords />;
      case 'USERS':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans">
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
