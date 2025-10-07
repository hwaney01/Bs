
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { User, Role } from '../types';
import { EditIcon, DeleteIcon, PlusCircleIcon, XMarkIcon } from './Icons';

const translateRole = (role: Role): string => {
    switch (role) {
        case Role.ADMIN: return 'مدير';
        case Role.EMPLOYEE: return 'موظف';
        case Role.VIEWER: return 'مشاهد';
        default: return role;
    }
}

const UserFormModal: React.FC<{ user?: User, onClose: () => void, onSave: (data: Partial<User>) => void }> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        phone: user?.phone || '',
        password: '',
        role: user?.role || Role.EMPLOYEE,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave: Partial<User> = { ...formData };
        if (!user) { // New user
          if (!dataToSave.password) {
            alert('كلمة المرور مطلوبة للمستخدمين الجدد.');
            return;
          }
        } else { // Editing user
          if (!dataToSave.password) {
            delete dataToSave.password;
          }
        }
        onSave(dataToSave);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <XMarkIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">اسم المستخدم</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">رقم الهاتف</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور {user ? '(اتركه فارغاً للإبقاء على كلمة المرور الحالية)' : ''}</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">الدور</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                           {Object.values(Role).map(r => <option key={r} value={r}>{translateRole(r)}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition-colors">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement: React.FC = () => {
    const { users, loading, addUser, updateUser, deleteUser } = useData();
    const { user: currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

    const handleOpenModal = (user?: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(undefined);
        setIsModalOpen(false);
    };

    const handleSaveUser = async (data: Partial<User>) => {
        if (editingUser) {
            await updateUser(editingUser.id, data);
        } else {
            await addUser(data as Omit<User, 'id'>);
        }
    };
    
    const handleDeleteUser = async (id: string, username: string) => {
        if (currentUser?.id === id) {
            alert("لا يمكنك حذف حسابك الخاص.");
            return;
        }
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف المستخدم: ${username}؟`)) {
            await deleteUser(id);
        }
    };

    if (loading) return <div>جاري تحميل المستخدمين...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">إدارة المستخدمين</h1>
              <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
                <PlusCircleIcon /> إضافة مستخدم
              </button>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">اسم المستخدم</th>
                                <th className="p-4 font-semibold">رقم الهاتف</th>
                                <th className="p-4 font-semibold">الدور</th>
                                <th className="p-4 font-semibold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-medium text-white">{user.username}</td>
                                    <td className="p-4 font-mono text-slate-300">{user.phone}</td>
                                    <td className="p-4 text-slate-300">{translateRole(user.role)}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-400 hover:text-yellow-400 transition-colors" title="تعديل المستخدم"><EditIcon /></button>
                                            <button onClick={() => handleDeleteUser(user.id, user.username)} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="حذف المستخدم"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <UserFormModal 
                    user={editingUser}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

export default UserManagement;