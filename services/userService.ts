
import { User, Role } from '../types';
import { USERS_KEY } from './mockDb';

const getUsersFromStorage = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const login = async (username: string, password: string): Promise<User | null> => {
  const users = getUsersFromStorage();
  const user = users.find(u => u.username === username && u.password === password);
  return user ? { id: user.id, username: user.username, role: user.role } : null;
};

export const getUsers = async (): Promise<User[]> => {
  const users = getUsersFromStorage();
  // Don't expose passwords to the frontend
  return users.map(({ password, ...user }) => user);
};

export const addUser = async (newUser: Omit<User, 'id'>): Promise<User> => {
  const users = getUsersFromStorage();
  if (users.some(u => u.username === newUser.username)) {
    throw new Error('Username already exists');
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
  if (userIndex === -1) throw new Error('User not found');
  
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
