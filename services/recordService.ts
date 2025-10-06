
import { ServiceRecord } from '../types';
import { RECORDS_KEY } from './mockDb';
import { useAuth } from '../context/AuthContext';

const getRecordsFromStorage = (): ServiceRecord[] => {
  const recordsJson = localStorage.getItem(RECORDS_KEY);
  return recordsJson ? JSON.parse(recordsJson) : [];
};

const saveRecordsToStorage = (records: ServiceRecord[]) => {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

const generateUniqueCode = (records: ServiceRecord[]): string => {
  const currentYear = new Date().getFullYear();
  const yearRecords = records.filter(r => r.id.startsWith(`JOB-${currentYear}`));
  const lastNumber = yearRecords.length > 0
    ? Math.max(...yearRecords.map(r => parseInt(r.id.split('-')[2], 10)))
    : 0;
  return `JOB-${currentYear}-${(lastNumber + 1).toString().padStart(4, '0')}`;
};

export const getRecords = async (): Promise<ServiceRecord[]> => {
  return getRecordsFromStorage();
};

export const addRecord = async (newRecordData: Omit<ServiceRecord, 'id' | 'dateTime' | 'employee'>): Promise<ServiceRecord> => {
  // This hook can only be called in a component, so we will get the user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  if (!currentUser.username) {
      throw new Error("No authenticated user found to create a record.");
  }

  const records = getRecordsFromStorage();
  const newRecord: ServiceRecord = {
    ...newRecordData,
    id: generateUniqueCode(records),
    dateTime: new Date().toISOString(),
    employee: currentUser.username,
  };
  records.push(newRecord);
  saveRecordsToStorage(records);
  return newRecord;
};

export const updateRecord = async (id: string, updatedData: Partial<ServiceRecord>): Promise<ServiceRecord> => {
  const records = getRecordsFromStorage();
  const recordIndex = records.findIndex(r => r.id === id);
  if (recordIndex === -1) throw new Error('Record not found');
  
  records[recordIndex] = { ...records[recordIndex], ...updatedData };
  saveRecordsToStorage(records);
  return records[recordIndex];
};

export const deleteRecord = async (id: string): Promise<void> => {
  let records = getRecordsFromStorage();
  records = records.filter(r => r.id !== id);
  saveRecordsToStorage(records);
};
