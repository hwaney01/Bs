
import { Role, User, ServiceRecord } from '../types';

export const USERS_KEY = 'service_desk_users';
export const RECORDS_KEY = 'service_desk_records';

const initialUsers: User[] = [
  { id: 'u1', username: 'admin', password: 'password', role: Role.ADMIN },
  { id: 'u2', username: 'employee1', password: 'password', role: Role.EMPLOYEE },
  { id: 'u3', username: 'viewer', password: 'password', role: Role.VIEWER },
];

const initialRecords: ServiceRecord[] = [
  { 
    id: 'JOB-2024-0001',
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    employee: 'employee1', 
    customerName: 'أحمد علي', 
    phone: '555-1234', 
    faultDescription: 'شاشة مكسورة لجهاز آيفون 13', 
    estimatedCost: 150 
  },
  { 
    id: 'JOB-2024-0002', 
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employee: 'admin', 
    customerName: 'فاطمة محمد', 
    phone: '555-5678', 
    faultDescription: 'اللابتوب لا يعمل. يشتبه في عطل باللوحة الأم.', 
    estimatedCost: 400 
  },
  { 
    id: 'JOB-2024-0003', 
    dateTime: new Date().toISOString(),
    employee: 'employee1', 
    customerName: 'خالد محمود', 
    phone: '555-8765', 
    faultDescription: 'تلف بسبب الماء في جهاز سامسونج S22', 
    estimatedCost: 250 
  },
];

export const initializeDb = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(RECORDS_KEY)) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(initialRecords));
  }
};
