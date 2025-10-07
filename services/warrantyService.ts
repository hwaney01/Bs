import { Warranty } from '../types';
import { WARRANTIES_KEY } from './mockDb';

const getWarrantiesFromStorage = (): Warranty[] => {
  const warrantiesJson = localStorage.getItem(WARRANTIES_KEY);
  return warrantiesJson ? JSON.parse(warrantiesJson) : [];
};

const saveWarrantiesToStorage = (warranties: Warranty[]) => {
  localStorage.setItem(WARRANTIES_KEY, JSON.stringify(warranties));
};

export const getWarranties = async (): Promise<Warranty[]> => {
  return getWarrantiesFromStorage();
};

export const addWarranty = async (newWarrantyData: Omit<Warranty, 'id'>): Promise<Warranty> => {
  const warranties = getWarrantiesFromStorage();
  if (warranties.some(w => w.name.toLowerCase() === newWarrantyData.name.toLowerCase())) {
    throw new Error('ضمان بنفس الاسم موجود بالفعل.');
  }
  const newWarranty: Warranty = { ...newWarrantyData, id: `w${Date.now()}` };
  warranties.push(newWarranty);
  saveWarrantiesToStorage(warranties);
  return newWarranty;
};

export const updateWarranty = async (id: string, updatedData: Partial<Warranty>): Promise<Warranty> => {
  const warranties = getWarrantiesFromStorage();
  const warrantyIndex = warranties.findIndex(w => w.id === id);
  if (warrantyIndex === -1) throw new Error('الضمان غير موجود');
  
  warranties[warrantyIndex] = { ...warranties[warrantyIndex], ...updatedData };
  saveWarrantiesToStorage(warranties);
  return warranties[warrantyIndex];
};

export const deleteWarranty = async (id: string): Promise<void> => {
  let warranties = getWarrantiesFromStorage();
  warranties = warranties.filter(w => w.id !== id);
  saveWarrantiesToStorage(warranties);
};