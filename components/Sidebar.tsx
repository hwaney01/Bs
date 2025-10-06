
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
// FIX: Import NavItem from App.tsx and remove the local definition.
import { View, NavItem } from '../App';
import { LogoutIcon } from './Icons';

interface SidebarProps {
  navItems: NavItem[];
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  
  const userHasAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  };
  
  return (
    <aside className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col justify-between p-4">
      <div>
        <div className="p-4 mb-6">
          <h1 className="text-2xl font-bold text-white text-center">Service Desk</h1>
        </div>
        <nav>
          <ul>
            {navItems.filter(userHasAccess).map((item) => (
              <li key={item.name} className="mb-2">
                <button
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 ${currentView === item.view ? 'bg-indigo-600 text-white' : ''}`}
                >
                  <span className="mr-4">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-700 pt-4">
         <div className="text-center mb-4">
            <p className="text-sm font-semibold text-white">{user?.username}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center p-3 rounded-lg transition-colors text-slate-300 hover:bg-red-500/80 hover:text-white"
        >
          <span className="mr-4"><LogoutIcon /></span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
