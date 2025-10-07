import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { EditIcon, DeleteIcon, PlusCircleIcon, XMarkIcon } from './Icons';

const ProductFormModal: React.FC<{ product?: Product, onClose: () => void, onSave: (data: Partial<Product>) => void }> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        type: product?.type || 'Product',
        costPrice: product?.costPrice || 0,
        salePrice: product?.salePrice || 0,
        stock: product?.stock || 0,
        hasWarranty: product?.hasWarranty || false,
        tags: product?.tags?.join(', ') || '',
    });
    
    const isService = formData.type === 'Service';

    useEffect(() => {
        if (isService) {
            setFormData(prev => ({ ...prev, stock: 9999 }));
        }
    }, [isService]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({...prev, hasWarranty: (e.target as HTMLInputElement).checked }));
        } else {
            const isNumeric = ['costPrice', 'salePrice', 'stock'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        };
        onSave(finalData as Partial<Product>);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <XMarkIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">{product ? 'تعديل منتج/خدمة' : 'إضافة منتج/خدمة جديدة'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">الاسم</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">النوع</label>
                            <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                <option value="Product">منتج (له مخزون)</option>
                                <option value="Service">خدمة (بدون مخزون)</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-slate-300 mb-1">المخزون</label>
                            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required disabled={isService} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 disabled:bg-slate-700"/>
                        </div>
                       <div>
                            <label htmlFor="costPrice" className="block text-sm font-medium text-slate-300 mb-1">سعر التكلفة</label>
                            <input type="number" id="costPrice" name="costPrice" value={formData.costPrice} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div>
                            <label htmlFor="salePrice" className="block text-sm font-medium text-slate-300 mb-1">سعر البيع</label>
                            <input type="number" id="salePrice" name="salePrice" value={formData.salePrice} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1">علامات البحث (مفصولة بفاصلة)</label>
                            <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="مثال: شاشة, عرض, مونيتور" className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                    </div>
                    <div className="flex items-center pt-2">
                        <input type="checkbox" id="hasWarranty" name="hasWarranty" checked={formData.hasWarranty} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                        <label htmlFor="hasWarranty" className="mr-2 block text-sm text-slate-300">يشمل ضمان</label>
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

const ProductManagement: React.FC = () => {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const handleOpenModal = (product?: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(false);
    };

    const handleSaveProduct = async (data: Partial<Product>) => {
        if (editingProduct) {
            await updateProduct(editingProduct.id, data);
        } else {
            await addProduct(data as Omit<Product, 'id'>);
        }
    };
    
    const handleDeleteProduct = async (id: string, name: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف: ${name}؟`)) {
            await deleteProduct(id);
        }
    };

    if (loading) return <div>جاري تحميل المنتجات...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">إدارة المنتجات والخدمات</h1>
              <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                <PlusCircleIcon /> إضافة جديد
              </button>
            </div>
             <div className="mb-6">
                <input
                    type="text"
                    placeholder="بحث باسم المنتج أو الخدمة..."
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
                                <th className="p-4 font-semibold">النوع</th>
                                <th className="p-4 font-semibold">سعر التكلفة</th>
                                <th className="p-4 font-semibold">سعر البيع</th>
                                <th className="p-4 font-semibold">المخزون</th>
                                <th className="p-4 font-semibold">ضمان</th>
                                <th className="p-4 font-semibold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className={`hover:bg-slate-700/30 ${product.type === 'Product' && product.stock < 5 ? 'bg-yellow-900/30' : ''}`}>
                                    <td className="p-4 font-medium text-white">{product.name}</td>
                                    <td className="p-4 text-slate-300">{product.type === 'Product' ? 'منتج' : 'خدمة'}</td>
                                    <td className="p-4 text-slate-300">{product.costPrice.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                                    <td className="p-4 text-green-400 font-semibold">{product.salePrice.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                                    <td className={`p-4 font-bold ${product.type === 'Product' && product.stock < 5 ? 'text-red-500' : 'text-white'}`}>
                                        {product.type === 'Product' ? product.stock : 'N/A'}
                                    </td>
                                    <td className="p-4 text-slate-300">{product.hasWarranty ? 'نعم' : 'لا'}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-yellow-400" title="تعديل"><EditIcon /></button>
                                            <button onClick={() => handleDeleteProduct(product.id, product.name)} className="p-2 text-slate-400 hover:text-red-400" title="حذف"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <ProductFormModal 
                    product={editingProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
};

export default ProductManagement;
