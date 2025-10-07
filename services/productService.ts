import { Product } from '../types';
import { PRODUCTS_KEY } from './mockDb';

const getProductsFromStorage = (): Product[] => {
  const productsJson = localStorage.getItem(PRODUCTS_KEY);
  return productsJson ? JSON.parse(productsJson) : [];
};

const saveProductsToStorage = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProducts = async (): Promise<Product[]> => {
  return getProductsFromStorage();
};

export const addProduct = async (newProductData: Omit<Product, 'id'>): Promise<Product> => {
  const products = getProductsFromStorage();
  if (products.some(p => p.name.toLowerCase() === newProductData.name.toLowerCase())) {
    throw new Error('منتج بنفس الاسم موجود بالفعل.');
  }
  const newProduct: Product = { ...newProductData, tags: newProductData.tags || [], id: `p${Date.now()}` };
  products.push(newProduct);
  saveProductsToStorage(products);
  return newProduct;
};

export const updateProduct = async (id: string, updatedData: Partial<Product>): Promise<Product> => {
  const products = getProductsFromStorage();
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) throw new Error('المنتج غير موجود');
  
  products[productIndex] = { ...products[productIndex], ...updatedData };
  saveProductsToStorage(products);
  return products[productIndex];
};

export const deleteProduct = async (id: string): Promise<void> => {
  let products = getProductsFromStorage();
  // TODO: Add check to prevent deleting a product that is used in a service record
  products = products.filter(p => p.id !== id);
  saveProductsToStorage(products);
};

// Function to update stock levels, to be called from recordService or purchase context
export const updateStock = async (productId: string, quantityChange: number): Promise<Product> => {
    const products = getProductsFromStorage();
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) throw new Error(`المنتج بالمعرف ${productId} غير موجود لتحديث المخزون`);
    
    products[productIndex].stock += quantityChange;
    saveProductsToStorage(products);
    return products[productIndex];
}
