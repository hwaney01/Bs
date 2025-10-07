import { PurchaseRecord } from '../types';
import { PURCHASES_KEY } from './mockDb';

const getPurchasesFromStorage = (): PurchaseRecord[] => {
  const purchasesJson = localStorage.getItem(PURCHASES_KEY);
  return purchasesJson ? JSON.parse(purchasesJson) : [];
};

const savePurchasesToStorage = (purchases: PurchaseRecord[]) => {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
};

export const getPurchases = async (): Promise<PurchaseRecord[]> => {
  return getPurchasesFromStorage();
};

export const addPurchase = async (newPurchaseData: Omit<PurchaseRecord, 'id' | 'totalCost'>): Promise<PurchaseRecord> => {
  const purchases = getPurchasesFromStorage();
  const newPurchase: PurchaseRecord = { 
    ...newPurchaseData, 
    id: `pur-${Date.now()}`,
    totalCost: newPurchaseData.quantity * newPurchaseData.purchasePrice,
  };
  purchases.push(newPurchase);
  savePurchasesToStorage(purchases);
  return newPurchase;
};
