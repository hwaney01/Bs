import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { ServiceRecord, WorkStatus } from '../types';

const Sales: React.FC = () => {
    const { records, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    
    const salesRecords = useMemo(() => {
        if (!records) return [];
        return records.filter(r => r.workStatus === WorkStatus.REPAIRED_AND_DELIVERED && r.finalInvoiceNumber)
                      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }, [records]);

    const filteredSales = useMemo(() => {
        return salesRecords.filter(sale => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            return (
                sale.contactName.toLowerCase().includes(lowerSearchTerm) ||
                sale.finalInvoiceNumber?.toLowerCase().includes(lowerSearchTerm) ||
                sale.usedProducts.some(p => p.name.toLowerCase().includes(lowerSearchTerm))
            );
        });
    }, [salesRecords, searchTerm]);

    if (loading) return <div>جاري تحميل المبيعات...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-white">سجل المبيعات</h1>
             <div className="mb-6">
                <input
                    type="text"
                    placeholder="بحث باسم العميل، رقم الفاتورة، أو اسم المنتج..."
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
                                <th className="p-4 font-semibold">رقم الفاتورة</th>
                                <th className="p-4 font-semibold">التاريخ</th>
                                <th className="p-4 font-semibold">العميل</th>
                                <th className="p-4 font-semibold">المنتجات/الخدمات المباعة</th>
                                <th className="p-4 font-semibold">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredSales.map(sale => (
                                <tr key={sale.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-mono text-indigo-400">{sale.finalInvoiceNumber}</td>
                                    <td className="p-4 text-slate-300">{new Date(sale.dateTime).toLocaleDateString('ar-EG')}</td>
                                    <td className="p-4 font-medium text-white">{sale.contactName}</td>
                                    <td className="p-4 text-sm text-slate-300">
                                        <ul className="list-disc pr-4">
                                            {sale.usedProducts.map(p => (
                                                <li key={p.productId}>{p.name} (x{p.quantity})</li>
                                            ))}
                                             <li>{`أجرة عمل (${sale.finalLaborCost?.toLocaleString('ar-EG')} ج.م)`}</li>
                                        </ul>
                                    </td>
                                    <td className="p-4 font-semibold text-green-400">
                                        {sale.finalTotalCost?.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                                    </td>
                                </tr>
                            ))}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-400">لا توجد مبيعات تطابق بحثك.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Sales;
