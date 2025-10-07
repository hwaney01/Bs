import { ServiceRecord, UsedProduct } from '../types';
import { RECORDS_KEY } from './mockDb';
import { updateStock } from './productService';

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

export const addRecord = async (newRecordData: Omit<ServiceRecord, 'id' | 'dateTime' | 'usedProducts'>): Promise<ServiceRecord> => {
  const records = getRecordsFromStorage();
  const newRecord: ServiceRecord = {
    ...newRecordData,
    id: generateUniqueCode(records),
    dateTime: new Date().toISOString(),
    usedProducts: [], // Initialize with empty products
  };
  records.push(newRecord);
  saveRecordsToStorage(records);
  return newRecord;
};

export const updateRecord = async (id: string, updatedData: Partial<ServiceRecord>): Promise<ServiceRecord> => {
  const records = getRecordsFromStorage();
  const recordIndex = records.findIndex(r => r.id === id);
  if (recordIndex === -1) throw new Error('السجل غير موجود');

  const originalRecord = records[recordIndex];

  // If usedProducts have changed, update stock
  if (updatedData.usedProducts) {
    const originalProducts = originalRecord.usedProducts || [];
    const updatedProducts = updatedData.usedProducts;

    const stockChanges = new Map<string, number>();

    // Decrease stock for new/increased items of type 'Product'
    updatedProducts.forEach(p => {
        if (p.type === 'Product') {
            const originalQty = originalProducts.find(op => op.productId === p.productId)?.quantity || 0;
            const diff = p.quantity - originalQty;
            if (diff !== 0) {
                stockChanges.set(p.productId, (stockChanges.get(p.productId) || 0) - diff);
            }
        }
    });

    // Increase stock for removed items of type 'Product'
    originalProducts.forEach(op => {
        if (op.type === 'Product' && !updatedProducts.some(p => p.productId === op.productId)) {
            stockChanges.set(op.productId, (stockChanges.get(op.productId) || 0) + op.quantity);
        }
    });

    // Apply stock changes
    for (const [productId, change] of stockChanges.entries()) {
        await updateStock(productId, change);
    }
  }
  
  records[recordIndex] = { ...originalRecord, ...updatedData };
  saveRecordsToStorage(records);
  return records[recordIndex];
};

export const deleteRecord = async (id: string): Promise<void> => {
    let records = getRecordsFromStorage();
    const recordToDelete = records.find(r => r.id === id);

    // If the record being deleted had products, return them to stock
    if (recordToDelete && recordToDelete.usedProducts) {
        for (const product of recordToDelete.usedProducts) {
            // Only return items of type 'Product' to stock
            if (product.type === 'Product') {
                await updateStock(product.productId, product.quantity);
            }
        }
    }

    records = records.filter(r => r.id !== id);
    saveRecordsToStorage(records);
};
