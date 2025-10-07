import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { PurchaseRecord, Contact, ContactType, Product } from '../types';
import { PlusCircleIcon, XMarkIcon } from './Icons';

const PurchaseFormModal: React.FC<{ onClose: () => void, onSave: (data: Omit<PurchaseRecord, 'id' | 'totalCost'>) => void, contacts: Contact[], products: Product[] }> = ({ onClose, onSave, contacts, products }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        supplierId: '',
        productId: '',
        quantity: 1,
        purchasePrice: 0,
        notes: '',
    });
    
    const suppliers = useMemo(() => contacts.filter(c => c.type === ContactType.SUPPLIER || c.type === ContactType.BOTH), [contacts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['quantity', 'purchasePrice'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const supplier = suppliers.find(s => s.id === formData.supplierId);
        const product = products.find(p => p.id === formData.productId);

        if (!supplier || !product) {
            alert('يجب اختيار مورد ومنتج صحيح.');
            return;
        }

        const dataToSave = {
            ...formData,
            supplierName: supplier.name,
            productName: product.name,
        };
        onSave(dataToSave);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <XMarkIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">إضافة عملية شراء جديدة</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">تاريخ الشراء</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div>
                            <label htmlFor="supplierId" className="block text-sm font-medium text-slate-300 mb-1">المورد</label>
                            <select id="supplierId" name="supplierId" value={formData.supplierId} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                <option value="">-- اختر مورد --</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="productId" className="block text-sm font-medium text-slate-300 mb-1">المنتج</label>
                            <select id="productId" name="productId" value={formData.productId} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                <option value="">-- اختر منتج --</option>
                                {products.filter(p => p.type === 'Product').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1">الكمية</label>
                            <input type="number" min="1" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-300 mb-1">سعر الشراء (للوحدة)</label>
                            <input type="number" min="0" step="0.01" id="purchasePrice" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">ملاحظات</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"></textarea>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">حفظ الشراء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PurchasesManagement: React.FC = () => {
    const { purchases, contacts, products, loading, addPurchase } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPurchases = useMemo(() => {
        return purchases.filter(p => 
            p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [purchases, searchTerm]);

    const handleSavePurchase = async (data: Omit<PurchaseRecord, 'id' | 'totalCost'>) => {
        await addPurchase(data);
    };

    if (loading) return <div>جاري تحميل المشتريات...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">إدارة المشتريات</h1>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                <PlusCircleIcon /> إضافة شراء جديد
              </button>
            </div>
             <div className="mb-6">
                <input
                    type="text"
                    placeholder="بحث باسم المنتج أو المورد..."
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
                                <th className="p-4 font-semibold">التاريخ</th>
                                <th className="p-4 font-semibold">المنتج</th>
                                <th className="p-4 font-semibold">المورد</th>
                                <th className="p-4 font-semibold">الكمية</th>
                                <th className="p-4 font-semibold">سعر الوحدة</th>
                                <th className="p-4 font-semibold">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredPurchases.map(purchase => (
                                <tr key={purchase.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 text-slate-300">{new Date(purchase.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="p-4 font-medium text-white">{purchase.productName}</td>
                                    <td className="p-4 text-slate-300">{purchase.supplierName}</td>
                                    <td className="p-4 text-center font-bold text-white">{purchase.quantity}</td>
                                    <td className="p-4 text-slate-300">{purchase.purchasePrice.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                                    <td className="p-4 font-semibold text-yellow-400">{purchase.totalCost.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <PurchaseFormModal 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSavePurchase}
                    contacts={contacts}
                    products={products}
                />
            )}
        </div>
    );
};

export default PurchasesManagement;
