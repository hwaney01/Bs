
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { ServiceRecord, User } from '../types';
import * as recordService from '../services/recordService';
import * as userService from '../services/userService';

interface DataContextType {
  records: ServiceRecord[];
  users: User[];
  loading: boolean;
  addRecord: (record: Omit<ServiceRecord, 'id' | 'dateTime' | 'employee'>) => Promise<ServiceRecord>;
  updateRecord: (id: string, record: Partial<ServiceRecord>) => Promise<ServiceRecord>;
  deleteRecord: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [fetchedRecords, fetchedUsers] = await Promise.all([
      recordService.getRecords(),
      userService.getUsers(),
    ]);
    setRecords(fetchedRecords.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
    setUsers(fetchedUsers);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRecord = async (record: Omit<ServiceRecord, 'id' | 'dateTime' | 'employee'>) => {
    const newRecord = await recordService.addRecord(record);
    await fetchData();
    return newRecord;
  };

  const updateRecord = async (id: string, record: Partial<ServiceRecord>) => {
    const updated = await recordService.updateRecord(id, record);
    await fetchData();
    return updated;
  };

  const deleteRecord = async (id: string) => {
    await recordService.deleteRecord(id);
    await fetchData();
  };
  
  const addUser = async (user: Omit<User, 'id'>) => {
    const newUser = await userService.addUser(user);
    await fetchData();
    return newUser;
  }

  const updateUser = async (id: string, user: Partial<User>) => {
    const updatedUser = await userService.updateUser(id, user);
    await fetchData();
    return updatedUser;
  }

  const deleteUser = async (id: string) => {
    await userService.deleteUser(id);
    await fetchData();
  }

  const value = {
    records,
    users,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    addUser,
    updateUser,
    deleteUser,
    refreshData: fetchData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
