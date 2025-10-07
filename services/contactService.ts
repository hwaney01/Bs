import { Contact } from '../types';
import { CONTACTS_KEY } from './mockDb';

const getContactsFromStorage = (): Contact[] => {
  const contactsJson = localStorage.getItem(CONTACTS_KEY);
  return contactsJson ? JSON.parse(contactsJson) : [];
};

const saveContactsToStorage = (contacts: Contact[]) => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const getContacts = async (): Promise<Contact[]> => {
  return getContactsFromStorage();
};

export const addContact = async (newContactData: Omit<Contact, 'id'>): Promise<Contact> => {
  const contacts = getContactsFromStorage();
  if (contacts.some(c => c.phone === newContactData.phone)) {
    throw new Error('جهة اتصال بنفس رقم الهاتف موجودة بالفعل.');
  }
  const newContact: Contact = { ...newContactData, id: `c${Date.now()}` };
  contacts.push(newContact);
  saveContactsToStorage(contacts);
  return newContact;
};

export const updateContact = async (id: string, updatedData: Partial<Contact>): Promise<Contact> => {
  const contacts = getContactsFromStorage();
  const contactIndex = contacts.findIndex(c => c.id === id);
  if (contactIndex === -1) throw new Error('جهة الاتصال غير موجودة');
  
  contacts[contactIndex] = { ...contacts[contactIndex], ...updatedData };
  saveContactsToStorage(contacts);
  return contacts[contactIndex];
};

export const deleteContact = async (id: string): Promise<void> => {
  let contacts = getContactsFromStorage();
  // TODO: Add check to prevent deleting a contact linked to a service record or purchase
  contacts = contacts.filter(c => c.id !== id);
  saveContactsToStorage(contacts);
};
