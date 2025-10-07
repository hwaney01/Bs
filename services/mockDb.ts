import { Role, User, ServiceRecord, DeviceType, WorkStatus, Product, Warranty, Contact, ContactType, PurchaseRecord } from '../types';

export const USERS_KEY = 'service_desk_users';
export const RECORDS_KEY = 'service_desk_records';
export const PRODUCTS_KEY = 'service_desk_products';
export const WARRANTIES_KEY = 'service_desk_warranties';
export const CONTACTS_KEY = 'service_desk_contacts';
export const PURCHASES_KEY = 'service_desk_purchases';


const initialUsers: User[] = [
  { id: 'u1', username: 'admin', phone: '0501112222', password: 'password', role: Role.ADMIN },
  { id: 'u2', username: 'employee1', phone: '0503334444', password: 'password', role: Role.EMPLOYEE },
  { id: 'u3', username: 'viewer', phone: '0505556666', password: 'password', role: Role.VIEWER },
];

const initialProducts: Product[] = [
    { id: 'p1', name: 'SSD 512GB', type: 'Product', hasWarranty: true, costPrice: 800, salePrice: 1200, stock: 15, tags: ['ssd', 'hard drive', 'storage', '512'] },
    { id: 'p2', name: 'RAM 8GB DDR4', type: 'Product', hasWarranty: true, costPrice: 600, salePrice: 950, stock: 25, tags: ['memory', 'ram', 'ddr4'] },
    { id: 'p3', name: 'شاشة لابتوب 15.6 بوصة', type: 'Product', hasWarranty: false, costPrice: 1200, salePrice: 1800, stock: 8, tags: ['screen', 'display', 'monitor', 'شاشه'] },
    { id: 'p4', name: 'بطارية Dell', type: 'Product', hasWarranty: true, costPrice: 700, salePrice: 1100, stock: 4, tags: ['battery', 'dell'] },
    { id: 'p5', name: 'تنظيف وإزالة الفيروسات', type: 'Service', hasWarranty: false, costPrice: 0, salePrice: 150, stock: 9999, tags: ['software', 'virus', 'cleanup', 'سوفتوير'] },
];

const initialWarranties: Warranty[] = [
    { id: 'w1', name: 'ضمان 3 شهور', description: 'ضمان على القطع المستبدلة ضد عيوب الصناعة. لا يشمل سوء الاستخدام أو الكسر.', durationMonths: 3, isActive: true },
    { id: 'w2', name: 'ضمان 6 شهور', description: 'ضمان شامل على الإصلاح والقطع المستبدلة.', durationMonths: 6, isActive: true },
    { id: 'w3', name: 'ضمان سنة', description: 'ضمان ممتد لمدة عام كامل على الأعطال المتكررة.', durationMonths: 12, isActive: false },
    { id: 'w4', name: 'ضمان سوفت وير', description: 'ضمان لمدة شهر على خدمات السوفت وير.', durationMonths: 1, isActive: true },
];

const initialContacts: Contact[] = [
    { id: 'c1', name: 'أحمد علي', phone: '0555-1234', address: '123 شارع الملك فهد، الرياض', type: ContactType.CUSTOMER, notes: 'عميل دائم، يفضل التعامل السريع.' },
    { id: 'c2', name: 'فاطمة محمد', phone: '0555-5678', address: '456 شارع العليا، الرياض', type: ContactType.CUSTOMER, notes: '' },
    { id: 'c3', name: 'خالد محمود', phone: '0555-8765', address: '789 شارع التحلية، جدة', type: ContactType.CUSTOMER, notes: '' },
    { id: 'c4', name: 'شركة أجزاء الحاسب', phone: '011-465-8888', address: 'سوق الكمبيوتر، العليا', type: ContactType.SUPPLIER, notes: 'مورد رئيسي لقطع الغيار.' },
    { id: 'c5', name: 'متجر الإلكترونيات الحديثة', phone: '012-654-3210', address: 'شارع فلسطين، جدة', type: ContactType.BOTH, notes: 'مورد لبعض الاكسسوارات وعميل لإصلاحات أجهزتهم.' },
];

const initialRecords: ServiceRecord[] = [
  { 
    id: 'JOB-2024-0001',
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    employee: 'employee1', 
    contactId: 'c1',
    contactName: 'أحمد علي',
    contactPhone: '0555-1234',
    faultDescription: 'شاشة مكسورة وتحتاج لزيادة الرامات', 
    rating: 5,
    estimatedLaborCost: 250,
    deviceType: DeviceType.LAPTOP,
    deviceModel: 'HP Pavilion',
    serialNumber: 'SN123456789',
    deviceStatus: 'خدوش على الإطار الخارجي.',
    workStatus: WorkStatus.REPAIRED_AND_DELIVERED,
    usedProducts: [
        // [FIX] Object literal may only specify known properties, and 'tags' does not exist in type 'UsedProduct'.
        { productId: 'p3', name: 'شاشة لابتوب 15.6 بوصة', type: 'Product', quantity: 1, hasWarranty: false, costPrice: 1200, salePrice: 1800 },
        // [FIX] Object literal may only specify known properties, and 'tags' does not exist in type 'UsedProduct'.
        { productId: 'p2', name: 'RAM 8GB DDR4', type: 'Product', quantity: 1, hasWarranty: true, costPrice: 600, salePrice: 950 },
    ],
    finalLaborCost: 300,
    finalTotalCost: 3050, // 300 (labor) + 1800 (screen) + 950 (ram)
    finalInvoiceNumber: 'INV-2024-0001',
    warranty: { id: 'w1', name: 'ضمان 3 شهور', description: 'ضمان على القطع المستبدلة ضد عيوب الصناعة. لا يشمل سوء الاستخدام أو الكسر.', durationMonths: 3, isActive: true },
  },
  { 
    id: 'JOB-2024-0002', 
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employee: 'admin', 
    contactId: 'c2',
    contactName: 'فاطمة محمد',
    contactPhone: '0555-5678',
    faultDescription: 'اللابتوب لا يعمل. يشتبه في عطل باللوحة الأم.', 
    rating: 4,
    estimatedLaborCost: 500,
    deviceType: DeviceType.LAPTOP,
    deviceModel: 'Dell XPS 15',
    serialNumber: 'SN987654321',
    deviceStatus: 'الجهاز نظيف بشكل عام.',
    workStatus: WorkStatus.BEING_REPAIRED,
    usedProducts: [],
  },
  { 
    id: 'JOB-2024-0003', 
    dateTime: new Date().toISOString(),
    employee: 'employee1', 
    contactId: 'c3',
    contactName: 'خالد محمود',
    contactPhone: '0555-8765',
    faultDescription: 'بطئ شديد ويحتاج لتركيب SSD', 
    rating: 3,
    estimatedLaborCost: 150,
    deviceType: DeviceType.PC,
    deviceModel: 'Custom Build',
    serialNumber: 'SN555555555',
    deviceStatus: 'الجهاز يعمل.',
    workStatus: WorkStatus.IN_QUEUE,
    usedProducts: [],
  },
];

const initialPurchases: PurchaseRecord[] = [
    { id: 'pur-1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), supplierId: 'c4', supplierName: 'شركة أجزاء الحاسب', productId: 'p1', productName: 'SSD 512GB', quantity: 10, purchasePrice: 750, totalCost: 7500, notes: 'شحنة شهرية' },
    { id: 'pur-2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), supplierId: 'c4', supplierName: 'شركة أجزاء الحاسب', productId: 'p2', productName: 'RAM 8GB DDR4', quantity: 20, purchasePrice: 550, totalCost: 11000, notes: '' },
    { id: 'pur-3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), supplierId: 'c5', supplierName: 'متجر الإلكترونيات الحديثة', productId: 'p3', productName: 'شاشة لابتوب 15.6 بوصة', quantity: 5, purchasePrice: 1100, totalCost: 5500, notes: 'شاشات من نوع IPS' },
];

export const initializeDb = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(RECORDS_KEY)) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(initialRecords));
  }
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(WARRANTIES_KEY)) {
    localStorage.setItem(WARRANTIES_KEY, JSON.stringify(initialWarranties));
  }
  if (!localStorage.getItem(CONTACTS_KEY)) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(initialContacts));
  }
   if (!localStorage.getItem(PURCHASES_KEY)) {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(initialPurchases));
  }
};