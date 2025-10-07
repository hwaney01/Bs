import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { ServiceRecord, User, Product, Warranty, Contact, PurchaseRecord } from '../types';
import * as recordService from '../services/recordService';
import * as userService from '../services/userService';
import * as productService from '../services/productService';
import * as warrantyService from '../services/warrantyService';
import * as contactService from '../services/contactService';
import * as purchaseService from '../services/purchaseService';

interface DataContextType {
  records: ServiceRecord[];
  users: User[];
  products: Product[];
  warranties: Warranty[];
  contacts: Contact[];
  purchases: PurchaseRecord[];
  loading: boolean;
  addRecord: (record: Omit<ServiceRecord, 'id' | 'dateTime' | 'usedProducts'>) => Promise<ServiceRecord>;
  updateRecord: (id: string, record: Partial<ServiceRecord>) => Promise<ServiceRecord>;
  deleteRecord: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  addWarranty: (warranty: Omit<Warranty, 'id'>) => Promise<Warranty>;
  updateWarranty: (id: string, warranty: Partial<Warranty>) => Promise<Warranty>;
  deleteWarranty: (id: string) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  addPurchase: (purchase: Omit<PurchaseRecord, 'id' | 'totalCost'>) => Promise<PurchaseRecord>;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [
        fetchedRecords, 
        fetchedUsers, 
        fetchedProducts, 
        fetchedWarranties,
        fetchedContacts,
        fetchedPurchases
    ] = await Promise.all([
      recordService.getRecords(),
      userService.getUsers(),
      productService.getProducts(),
      warrantyService.getWarranties(),
      contactService.getContacts(),
      purchaseService.getPurchases(),
    ]);
    setRecords(fetchedRecords.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
    setUsers(fetchedUsers);
    setProducts(fetchedProducts);
    setWarranties(fetchedWarranties);
    setContacts(fetchedContacts);
    setPurchases(fetchedPurchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Record Methods ---
  const addRecord = async (record: Omit<ServiceRecord, 'id' | 'dateTime' | 'usedProducts'>) => {
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
  
  // --- User Methods ---
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
  
  // --- Product Methods ---
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = await productService.addProduct(product);
    await fetchData();
    return newProduct;
  }
  const updateProduct = async (id: string, product: Partial<Product>) => {
    const updatedProduct = await productService.updateProduct(id, product);
    await fetchData();
    return updatedProduct;
  }
  const deleteProduct = async (id: string) => {
    await productService.deleteProduct(id);
    await fetchData();
  }

  // --- Warranty Methods ---
  const addWarranty = async (warranty: Omit<Warranty, 'id'>) => {
    const newWarranty = await warrantyService.addWarranty(warranty);
    await fetchData();
    return newWarranty;
  }
  const updateWarranty = async (id: string, warranty: Partial<Warranty>) => {
    const updatedWarranty = await warrantyService.updateWarranty(id, warranty);
    await fetchData();
    return updatedWarranty;
  }
  const deleteWarranty = async (id: string) => {
    await warrantyService.deleteWarranty(id);
    await fetchData();
  }

  // --- Contact Methods ---
  const addContact = async (contact: Omit<Contact, 'id'>) => {
      const newContact = await contactService.addContact(contact);
      await fetchData();
      return newContact;
  }
  const updateContact = async (id: string, contact: Partial<Contact>) => {
      const updatedContact = await contactService.updateContact(id, contact);
      await fetchData();
      return updatedContact;
  }
  const deleteContact = async (id: string) => {
      await contactService.deleteContact(id);
      await fetchData();
  }

  // --- Purchase Methods ---
  const addPurchase = async (purchase: Omit<PurchaseRecord, 'id' | 'totalCost'>) => {
    // Orchestration: Add purchase record, then update product stock
    const newPurchase = await purchaseService.addPurchase(purchase);
    await productService.updateStock(purchase.productId, purchase.quantity);
    await fetchData();
    return newPurchase;
  }

  const value = {
    records,
    users,
    products,
    warranties,
    contacts,
    purchases,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    addUser,
    updateUser,
    deleteUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addWarranty,
    updateWarranty,
    deleteWarranty,
    addContact,
    updateContact,
    deleteContact,
    addPurchase,
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
