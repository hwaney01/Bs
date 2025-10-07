import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Contact, ContactType } from '../types';
import { EditIcon, DeleteIcon, PlusCircleIcon, XMarkIcon } from './Icons';

const ContactFormModal: React.FC<{ contact?: Contact, onClose: () => void, onSave: (data: Partial<Contact>) => void }> = ({ contact, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: contact?.name || '',
        phone: contact?.phone || '',
        address: contact?.address || '',
        type: contact?.type || ContactType.CUSTOMER,
        notes: contact?.notes || '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Contact);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <XMarkIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">{contact ? 'تعديل جهة اتصال' : 'إضافة جهة اتصال جديدة'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">الاسم</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">رقم الهاتف</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-1">العنوان</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">النوع</label>
                            <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                {Object.values(ContactType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">ملاحظات</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"></textarea>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContactsManagement: React.FC = () => {
    const { contacts, loading, addContact, updateContact, deleteContact } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = useMemo(() => {
        return contacts.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        );
    }, [contacts, searchTerm]);

    const handleOpenModal = (contact?: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingContact(undefined);
        setIsModalOpen(false);
    };

    const handleSaveContact = async (data: Partial<Contact>) => {
        try {
            if (editingContact) {
                await updateContact(editingContact.id, data);
            } else {
                await addContact(data as Omit<Contact, 'id'>);
            }
        } catch (error) {
            alert(error.message);
        }
    };
    
    const handleDeleteContact = async (id: string, name: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف: ${name}؟`)) {
            await deleteContact(id);
        }
    };

    if (loading) return <div>جاري تحميل جهات الاتصال...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">إدارة جهات الاتصال</h1>
              <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                <PlusCircleIcon /> إضافة جهة اتصال
              </button>
            </div>
             <div className="mb-6">
                <input
                    type="text"
                    placeholder="بحث بالاسم أو رقم الهاتف..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">الاسم</th>
                                <th className="p-4 font-semibold">الهاتف</th>
                                <th className="p-4 font-semibold">النوع</th>
                                <th className="p-4 font-semibold">العنوان</th>
                                <th className="p-4 font-semibold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredContacts.map(contact => (
                                <tr key={contact.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-medium text-white">{contact.name}</td>
                                    <td className="p-4 text-slate-300 font-mono">{contact.phone}</td>
                                    <td className="p-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-200">{contact.type}</span></td>
                                    <td className="p-4 text-slate-400">{contact.address}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(contact)} className="p-2 text-slate-400 hover:text-yellow-400" title="تعديل"><EditIcon /></button>
                                            <button onClick={() => handleDeleteContact(contact.id, contact.name)} className="p-2 text-slate-400 hover:text-red-400" title="حذف"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <ContactFormModal 
                    contact={editingContact}
                    onClose={handleCloseModal}
                    onSave={handleSaveContact}
                />
            )}
        </div>
    );
};

export default ContactsManagement;
