import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ServiceRecord, DeviceType, WorkStatus, UsedProduct, Product, Warranty } from '../types';
import { EditIcon, DeleteIcon, PrintIcon, XMarkIcon, PlusCircleIcon } from './Icons';
import PrintReceipt from './PrintReceipt';

const EditRecordModal: React.FC<{
    record: ServiceRecord;
    onClose: () => void;
    onSave: (id: string, data: Partial<ServiceRecord>) => void;
}> = ({ record, onClose, onSave }) => {
    const [formData, setFormData] = useState(record);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = name === 'estimatedLaborCost';
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(record.id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"> <XMarkIcon /> </button>
                <h2 className="text-2xl font-bold mb-4 text-white">تعديل بيانات السجل: {record.id}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">اسم العميل</label>
                            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-300 mb-1">الهاتف</label>
                            <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">نوع الجهاز</label>
                            <select name="deviceType" value={formData.deviceType} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                {Object.values(DeviceType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-slate-300 mb-1">موديل الجهاز</label>
                            <input type="text" name="deviceModel" value={formData.deviceModel} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">وصف العطل</label>
                            <textarea name="faultDescription" value={formData.faultDescription} onChange={handleChange} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">حالة الإصلاح</label>
                            <select name="workStatus" value={formData.workStatus} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                {Object.values(WorkStatus).filter(s => s !== WorkStatus.REPAIRED_AND_DELIVERED).map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">تكلفة العمل المبدئية</label>
                            <input type="number" name="estimatedLaborCost" value={formData.estimatedLaborCost} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3"/>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 ml-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">حفظ التغييرات</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InvoiceModal: React.FC<{
    record: ServiceRecord;
    onClose: () => void;
    onSave: (id: string, data: Partial<ServiceRecord>) => Promise<ServiceRecord>;
    onPrintRequest: (record: ServiceRecord) => void;
    allRecords: ServiceRecord[];
    allProducts: Product[];
    allWarranties: Warranty[];
}> = ({ record, onClose, onSave, onPrintRequest, allRecords, allProducts, allWarranties }) => {
    
    const [formData, setFormData] = useState({
        finalLaborCost: record.finalLaborCost ?? record.estimatedLaborCost,
        usedProducts: record.usedProducts || [],
        finalTotalCost: record.finalTotalCost || 0,
        warranty: record.warranty || undefined,
    });
    const [productToAdd, setProductToAdd] = useState('');
    const [customerHistory, setCustomerHistory] = useState<ServiceRecord[]>([]);

    useEffect(() => {
        // Calculate total cost
        const productsCost = formData.usedProducts.reduce((acc, p) => acc + (p.salePrice * p.quantity), 0);
        const finalTotal = (formData.finalLaborCost || 0) + productsCost;
        setFormData(prev => ({ ...prev, finalTotalCost: finalTotal }));
    }, [formData.finalLaborCost, formData.usedProducts]);

    useEffect(() => {
        // Find customer history
        const history = allRecords.filter(r => r.id !== record.id && (r.contactId === record.contactId));
        setCustomerHistory(history);
    }, [allRecords, record]);

    const handleAddProduct = () => {
        const product = allProducts.find(p => p.id === productToAdd);
        if (!product || formData.usedProducts.some(p => p.productId === product.id)) return;

        const newUsedProduct: UsedProduct = {
            productId: product.id,
            name: product.name,
            type: product.type,
            quantity: 1,
            hasWarranty: product.hasWarranty,
            costPrice: product.costPrice,
            salePrice: product.salePrice,
        };
        setFormData(prev => ({ ...prev, usedProducts: [...prev.usedProducts, newUsedProduct] }));
        setProductToAdd('');
    };
    
    const handleProductQtyChange = (productId: string, newQty: number) => {
        if (newQty < 1) return;
        setFormData(prev => ({
            ...prev,
            usedProducts: prev.usedProducts.map(p => p.productId === productId ? { ...p, quantity: newQty } : p)
        }));
    };
    
    const handleRemoveProduct = (productId: string) => {
        setFormData(prev => ({ ...prev, usedProducts: prev.usedProducts.filter(p => p.productId !== productId) }));
    };

    const handleWarrantyChange = (warrantyId: string) => {
        if (warrantyId === '') {
            setFormData(prev => ({ ...prev, warranty: undefined }));
        } else {
            const selectedWarranty = allWarranties.find(w => w.id === warrantyId);
            setFormData(prev => ({ ...prev, warranty: selectedWarranty }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave: Partial<ServiceRecord> = { 
            ...formData,
            workStatus: WorkStatus.REPAIRED_AND_DELIVERED,
            finalInvoiceNumber: record.finalInvoiceNumber || `INV-${record.id.split('-').slice(1).join('-')}`
        };
        const updatedRecord = await onSave(record.id, dataToSave);
        if (updatedRecord) {
            onPrintRequest(updatedRecord);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 overflow-y-auto p-4">
            <div className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-4xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"> <XMarkIcon /> </button>
                <h2 className="text-2xl font-bold mb-4 text-white">إنشاء / تعديل الفاتورة النهائية للسجل: {record.id}</h2>
                
                <div className="flex flex-col lg:flex-row gap-6 max-h-[85vh]">
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow lg:w-2/3">
                        {/* Products Section */}
                        <div className="p-3 border border-slate-700 rounded-lg">
                           <h3 className="text-lg font-semibold text-indigo-400 mb-3">المنتجات والخدمات</h3>
                           <div className="flex gap-2 mb-3">
                                <select value={productToAdd} onChange={e => setProductToAdd(e.target.value)} className="flex-grow bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                    <option value="">-- اختر منتج أو خدمة --</option>
                                    {allProducts
                                        .filter(p => p.type === 'Service' || p.stock > 0)
                                        .map(p => <option key={p.id} value={p.id}>{p.name} {p.type==='Product' ? `(المخزون: ${p.stock})` : '(خدمة)'}</option>)}
                                </select>
                                <button type="button" onClick={handleAddProduct} className="px-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"><PlusCircleIcon /></button>
                           </div>
                           <div className="space-y-2">
                                {formData.usedProducts.map(p => (
                                    <div key={p.productId} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                                        <div>
                                          <p className="text-white">{p.name} <span className="text-xs text-slate-400">{p.type === 'Service' ? '(خدمة)' : ''}</span></p>
                                          <p className="text-xs text-slate-400">سعر البيع: {p.salePrice.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={p.quantity} onChange={e => handleProductQtyChange(p.productId, parseInt(e.target.value))} className="w-16 bg-slate-700 text-center rounded py-1 px-2"/>
                                            <button type="button" onClick={() => handleRemoveProduct(p.productId)} className="text-red-400 hover:text-red-300"><XMarkIcon /></button>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </div>

                        {/* Warranty Section */}
                        <div className="p-3 border border-slate-700 rounded-lg">
                           <h3 className="text-lg font-semibold text-indigo-400 mb-3">الضمان</h3>
                           <select value={formData.warranty?.id || ''} onChange={e => handleWarrantyChange(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3">
                                <option value="">-- بدون ضمان --</option>
                                {allWarranties
                                    .filter(w => w.isActive)
                                    .map(w => <option key={w.id} value={w.id}>{w.name} ({w.durationMonths} أشهر)</option>)}
                           </select>
                           {formData.warranty && <p className="text-xs text-slate-400 mt-2">{formData.warranty.description}</p>}
                        </div>

                        {/* Costing */}
                        <div className="p-3 border border-slate-700 rounded-lg">
                            <h3 className="text-lg font-semibold text-indigo-400 mb-3">التكلفة النهائية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-2 rounded-md">
                                    <label className="block text-sm font-bold text-green-400 mb-1">تكلفة العمل النهائية</label>
                                    <input type="number" name="finalLaborCost" value={formData.finalLaborCost} onChange={e => setFormData(p => ({...p, finalLaborCost: parseFloat(e.target.value) || 0}))} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3"/>
                                </div>
                                 <div className="bg-slate-900/50 p-2 rounded-md flex flex-col justify-center">
                                    <label className="block text-sm font-bold text-green-400 mb-1">إجمالي الفاتورة النهائية</label>
                                    <p className="text-xl font-bold text-white">
                                        {(formData.finalTotalCost || 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 ml-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700">إلغاء</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">حفظ وطباعة الفاتورة</button>
                        </div>
                    </form>
                    
                    {/* Customer History */}
                    <div className="flex-shrink-0 lg:w-1/3 bg-slate-900/50 p-4 rounded-lg border border-slate-700 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-amber-400 mb-3">سجل العميل</h3>
                        {customerHistory.length > 0 ? (
                            <ul className="space-y-3">
                                {customerHistory.map(h => (
                                    <li key={h.id} className="p-2 bg-slate-800/70 rounded">
                                        <p className="font-semibold text-cyan-400">{h.id} <span className="text-xs text-slate-300">({new Date(h.dateTime).toLocaleDateString('ar-EG')})</span></p>
                                        <p className="text-sm text-slate-300">{h.deviceType} - {h.deviceModel}</p>
                                        <p className="text-sm text-slate-400">الحالة: {h.workStatus}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-400">لا يوجد سجلات سابقة لهذا العميل.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ViewRecords: React.FC = () => {
    const { records, products, warranties, loading, updateRecord, deleteRecord } = useData();
    const { user, isAdmin, isEmployee } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [deviceTypeFilter, setDeviceTypeFilter] = useState('All');
    const [workStatusFilter, setWorkStatusFilter] = useState('All');

    const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
    const [invoicingRecord, setInvoicingRecord] = useState<ServiceRecord | null>(null);
    const [printingRecord, setPrintingRecord] = useState<ServiceRecord | null>(null);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const productMatch = record.usedProducts.some(p => {
                const productInfo = products.find(prod => prod.id === p.productId);
                return productInfo && (
                    productInfo.name.toLowerCase().includes(lowerSearchTerm) ||
                    productInfo.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
                )
            });

            const matchesSearchTerm = (
                record.contactName.toLowerCase().includes(lowerSearchTerm) ||
                record.id.toLowerCase().includes(lowerSearchTerm) ||
                record.contactPhone.includes(searchTerm) ||
                record.deviceModel.toLowerCase().includes(lowerSearchTerm) ||
                record.serialNumber.toLowerCase().includes(lowerSearchTerm) ||
                productMatch
            );
            const matchesDeviceType = deviceTypeFilter === 'All' || record.deviceType === deviceTypeFilter;
            const matchesWorkStatus = workStatusFilter === 'All' || record.workStatus === workStatusFilter;
            
            return matchesSearchTerm && matchesDeviceType && matchesWorkStatus;
        });
    }, [records, products, searchTerm, deviceTypeFilter, workStatusFilter]);
    
    const handleSave = async (id: string, data: Partial<ServiceRecord>) => {
        return await updateRecord(id, data);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(`هل أنت متأكد من حذف السجل ${id}؟ سيتم إرجاع أي قطع غيار مستخدمة إلى المخزون.`)) {
            await deleteRecord(id);
        }
    };
    
    const downloadCSV = (data: ServiceRecord[]) => {
        const headers = ["معرف المهمة", "رقم الفاتورة", "التاريخ/الوقت", "الموظف", "اسم العميل", "الهاتف", "وصف العطل", "تكلفة العمل المبدئية", "تكلفة العمل النهائية", "إجمالي الفاتورة", "نوع الجهاز", "موديل الجهاز", "الرقم التسلسلي", "حالة الجهاز", "حالة الإصلاح", "المنتجات المستخدمة", "الضمان"];
        const rows = data.map(r => [
            r.id,
            r.finalInvoiceNumber || '',
            new Date(r.dateTime).toLocaleString('ar-EG'),
            r.employee,
            `"${r.contactName.replace(/"/g, '""')}"`,
            r.contactPhone,
            `"${r.faultDescription.replace(/"/g, '""')}"`,
            r.estimatedLaborCost,
            r.finalLaborCost || '',
            r.finalTotalCost || '',
            r.deviceType,
            `"${r.deviceModel.replace(/"/g, '""')}"`,
            r.serialNumber,
            `"${r.deviceStatus.replace(/"/g, '""')}"`,
            r.workStatus,
            `"${(r.usedProducts || []).map(p => `${p.name} (x${p.quantity})`).join('; ')}"`,
            `"${r.warranty ? r.warranty.name : 'لا يوجد'}"`
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(',') + "\n" + rows.join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `records_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div>جاري تحميل السجلات...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-white">جميع سجلات الخدمة</h1>
             <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-slate-800/50 rounded-lg">
                <input
                    type="text"
                    placeholder="بحث بالعميل، المعرف، الموديل، التاج..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                 <select value={deviceTypeFilter} onChange={e => setDeviceTypeFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="All">كل أنواع الأجهزة</option>
                    {Object.values(DeviceType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={workStatusFilter} onChange={e => setWorkStatusFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="All">كل الحالات</option>
                    {Object.values(WorkStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                 <button onClick={() => downloadCSV(filteredRecords)} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                    تصدير إلى CSV
                </button>
            </div>
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">المعرف</th>
                                <th className="p-4 font-semibold">العميل/الجهاز</th>
                                <th className="p-4 font-semibold">الحالة</th>
                                <th className="p-4 font-semibold">التكلفة</th>
                                <th className="p-4 font-semibold">الفاتورة</th>
                                <th className="p-4 font-semibold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredRecords.map(record => (
                                <tr key={record.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <p className="font-mono text-cyan-400">{record.id}</p>
                                        <p className="text-xs text-slate-400">{new Date(record.dateTime).toLocaleDateString('ar-EG')}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-white">{record.contactName}</p>
                                        <p className="text-sm text-slate-300">{record.deviceType} - {record.deviceModel}</p>
                                    </td>
                                     <td className="p-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-200">{record.workStatus}</span></td>
                                    <td className="p-4 text-left font-semibold">
                                        <div className={record.finalTotalCost ? 'text-green-400' : 'text-yellow-400'}>
                                          {(record.finalTotalCost ?? record.estimatedLaborCost).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                                        </div>
                                        <div className="text-xs text-slate-400">{record.finalTotalCost ? 'الإجمالي النهائي' : 'تقدير مبدئي'}</div>
                                    </td>
                                    <td className="p-4">
                                        {record.finalInvoiceNumber ? (
                                            <button onClick={() => setInvoicingRecord(record)} className="font-mono text-indigo-400 hover:text-indigo-300">
                                                {record.finalInvoiceNumber}
                                            </button>
                                        ) : (
                                            isEmployee && <button onClick={() => setInvoicingRecord(record)} className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700">
                                                إنشاء فاتورة
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => setPrintingRecord(record)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="طباعة"><PrintIcon /></button>
                                            {(isAdmin || (isEmployee && user?.username === record.employee)) && (
                                                <button onClick={() => setEditingRecord(record)} className="p-2 text-slate-400 hover:text-yellow-400 transition-colors" title="تعديل البيانات الأساسية"><EditIcon /></button>
                                            )}
                                            {isAdmin && (
                                                <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="حذف السجل"><DeleteIcon /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingRecord && (
                <EditRecordModal 
                    record={editingRecord}
                    onClose={() => setEditingRecord(null)}
                    onSave={handleSave}
                />
            )}

            {invoicingRecord && (
                 <InvoiceModal
                    record={invoicingRecord}
                    onClose={() => setInvoicingRecord(null)}
                    onSave={handleSave}
                    onPrintRequest={(recordToPrint) => setPrintingRecord(recordToPrint)}
                    allRecords={records}
                    allProducts={products}
                    allWarranties={warranties}
                />
            )}
            
            {printingRecord && (
                <PrintReceipt record={printingRecord} onDone={() => setPrintingRecord(null)} />
            )}
        </div>
    );
};

export default ViewRecords;
