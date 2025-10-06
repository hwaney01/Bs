
export enum Role {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  VIEWER = 'Viewer',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Should be hashed in a real app
  role: Role;
}

export interface ServiceRecord {
  id: string; // Unique Code e.g. JOB-2024-0001
  dateTime: string;
  employee: string; // username of the employee
  customerName: string;
  phone: string;
  faultDescription: string;
  estimatedCost: number;
}
