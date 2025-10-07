
import { User, Role } from '../types';
import { USERS_KEY } from './mockDb';

const getUsersFromStorage = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const login = async (phone: string, password: string): Promise<User | null> => {
  const users = getUsersFromStorage();
  const user = users.find(u => u.phone === phone && u.password === password);
  return user ? { id: user.id, username: user.username, role: user.role, phone: user.phone } : null;
};

export const getUsers = async (): Promise<User[]> => {
  const users = getUsersFromStorage();
  // Don't expose passwords to the frontend
  return users.map(({ password, ...user }) => user);
};

export const addUser = async (newUser: Omit<User, 'id'>): Promise<User> => {
  const users = getUsersFromStorage();
  if (users.some(u => u.username === newUser.username)) {
    throw new Error('اسم المستخدم موجود بالفعل');
  }
  if (users.some(u => u.phone === newUser.phone)) {
    throw new Error('رقم الهاتف موجود بالفعل');
  }
  const userWithId: User = { ...newUser, id: `u${Date.now()}` };
  users.push(userWithId);
  saveUsersToStorage(users);
  const { password, ...userToReturn } = userWithId;
  return userToReturn;
};

export const updateUser = async (id: string, updatedUser: Partial<Omit<User, 'id'>>): Promise<User> => {
  let users = getUsersFromStorage();
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) throw new Error('المستخدم غير موجود');
  
  if (updatedUser.username && users.some(u => u.id !== id && u.username === updatedUser.username)) {
    throw new Error('اسم المستخدم موجود بالفعل');
  }
  if (updatedUser.phone && users.some(u => u.id !== id && u.phone === updatedUser.phone)) {
      throw new Error('رقم الهاتف موجود بالفعل');
  }

  users[userIndex] = { ...users[userIndex], ...updatedUser };
  saveUsersToStorage(users);
  const { password, ...userToReturn } = users[userIndex];
  return userToReturn;
};

export const deleteUser = async (id: string): Promise<void> => {
  let users = getUsersFromStorage();
  users = users.filter(u => u.id !== id);
  saveUsersToStorage(users);
};