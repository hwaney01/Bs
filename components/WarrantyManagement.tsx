import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Warranty } from '../types';
import { EditIcon, DeleteIcon, PlusCircleIcon, XMarkIcon } from './Icons';

const WarrantyFormModal: React.FC<{ warranty?: Warranty, onClose: () => void, onSave: (data: Partial<Warranty>) => void }> = ({ warranty, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: warranty?.name || '',
        description: warranty?.description || '',
        durationMonths: warranty?.durationMonths || 0,
        isActive: warranty?.isActive ?? true,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({...prev, isActive: (e.target as HTMLInputElement).checked }));
        } else {
            const isNumeric = ['durationMonths'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumeric ? parseInt(value) || 0 : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Warranty);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <XMarkIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">{warranty ? 'تعديل الضمان' : 'إضافة ضمان جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">اسم الضمان (مثال: ضمان 3 شهور)</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">الوصف / الشروط</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"></textarea>
                        </div>
                        <div>
                            <label htmlFor="durationMonths" className="block text-sm font-medium text-slate-300 mb-1">المدة (بالأشهر)</label>
                            <input type="number" id="durationMonths" name="durationMonths" value={formData.durationMonths} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                    </div>
                    <div className="flex items-center pt-2">
                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                        <label htmlFor="isActive" className="mr-2 block text-sm text-slate-300">تفعيل الضمان (سيظهر في الفواتير)</label>
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

const WarrantyManagement: React.FC = () => {
    const { warranties, loading, addWarranty, updateWarranty, deleteWarranty } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarranty, setEditingWarranty] = useState<Warranty | undefined>(undefined);

    const handleOpenModal = (warranty?: Warranty) => {
        setEditingWarranty(warranty);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingWarranty(undefined);
        setIsModalOpen(false);
    };

    const handleSaveWarranty = async (data: Partial<Warranty>) => {
        if (editingWarranty) {
            await updateWarranty(editingWarranty.id, data);
        } else {
            await addWarranty(data as Omit<Warranty, 'id'>);
        }
    };
    
    const handleDeleteWarranty = async (id: string, name: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف: ${name}؟`)) {
            await deleteWarranty(id);
        }
    };

    if (loading) return <div>جاري تحميل بيانات الضمان...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">إدارة الضمان</h1>
              <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                <PlusCircleIcon /> إضافة ضمان جديد
              </button>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">الاسم</th>
                                <th className="p-4 font-semibold">المدة</th>
                                <th className="p-4 font-semibold">الحالة</th>
                                <th className="p-4 font-semibold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {warranties.map(warranty => (
                                <tr key={warranty.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{warranty.name}</p>
                                        <p className="text-xs text-slate-400 max-w-md truncate">{warranty.description}</p>
                                    </td>
                                    <td className="p-4 text-slate-300">{warranty.durationMonths} أشهر</td>
                                    <td className="p-4">
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ warranty.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {warranty.isActive ? 'مفعل' : 'غير مفعل'}
                                      </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(warranty)} className="p-2 text-slate-400 hover:text-yellow-400" title="تعديل"><EditIcon /></button>
                                            <button onClick={() => handleDeleteWarranty(warranty.id, warranty.name)} className="p-2 text-slate-400 hover:text-red-400" title="حذف"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <WarrantyFormModal 
                    warranty={editingWarranty}
                    onClose={handleCloseModal}
                    onSave={handleSaveWarranty}
                />
            )}
        </div>
    );
};

export default WarrantyManagement;