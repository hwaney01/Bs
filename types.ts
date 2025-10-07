export enum Role {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  VIEWER = 'Viewer',
}

export interface User {
  id: string;
  username: string;
  phone: string;
  password?: string; // Should be hashed in a real app
  role: Role;
}

export enum DeviceType {
  LAPTOP = 'لابتوب',
  PC = 'كمبيوتر شخصي',
  CHARGER = 'شاحن',
  MONITOR = 'شاشة',
}

export enum WorkStatus {
  IN_QUEUE = 'في قائمة الانتظار',
  BEING_REPAIRED = 'قيد الإصلاح',
  REPAIRED = 'تم الإصلاح',
  CANNOT_BE_REPAIRED = 'لا يمكن إصلاحه',
  CUSTOMER_REFUSED = 'العميل رفض الإصلاح',
  REPAIRED_AND_DELIVERED = 'تم الإصلاح والتسليم',
}

export interface Product {
  id: string;
  name: string;
  type: 'Product' | 'Service';
  hasWarranty: boolean;
  costPrice: number;
  salePrice: number;
  stock: number;
  tags: string[];
}

// A snapshot of the product details at the time it was used in a service
export interface UsedProduct {
  productId: string;
  name: string;
  type: 'Product' | 'Service';
  quantity: number;
  hasWarranty: boolean;
  costPrice: number; // Price at the time of use
  salePrice: number; // Price at the time of use
}

export interface Warranty {
  id: string;
  name: string;
  description: string;
  durationMonths: number;
  isActive: boolean;
}

export interface ServiceRecord {
  id: string; // Unique Code e.g. JOB-2024-0001
  dateTime: string;
  employee: string; // username of the employee
  
  contactId: string; // Link to the contact
  contactName: string; // Snapshot of the contact name
  contactPhone: string; // Snapshot of the contact phone

  faultDescription: string;
  rating?: number; // 1-5 stars, internal rating
  
  // Device Fields
  deviceType: DeviceType;
  deviceModel: string;
  serialNumber: string;
  deviceStatus: string; // Condition of the device on receipt

  // Status & Products
  workStatus: WorkStatus;
  usedProducts: UsedProduct[];
  finalInvoiceNumber?: string;
  warranty?: Warranty;

  // Costing
  estimatedLaborCost: number;
  finalLaborCost?: number;
  finalTotalCost?: number; // Calculated: finalLaborCost + sum of usedProducts salePrice
}

export enum ContactType {
    CUSTOMER = 'عميل',
    SUPPLIER = 'مورد',
    BOTH = 'عميل ومورد'
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: ContactType;
  notes: string;
}

export interface PurchaseRecord {
    id: string;
    date: string;
    supplierId: string;
    supplierName: string; // Snapshot
    productId: string;
    productName: string; // Snapshot
    quantity: number;
    purchasePrice: number; // Price per unit
    totalCost: number; // Calculated: quantity * purchasePrice
    notes: string;
}
