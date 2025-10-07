import React, { useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { WorkStatus, ContactType } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className={`bg-slate-800 p-6 rounded-lg shadow-lg border-r-4 ${color}`}>
    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1 text-right">{value}</p>
  </div>
);

const Reports: React.FC = () => {
    const { records, products, purchases, loading } = useData();
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });

    const timeFilteredData = useMemo(() => {
        if (loading) return { filteredRecords: [], filteredPurchases: [] };
        const startDate = new Date(dateRange.start).getTime();
        const endDate = new Date(dateRange.end).setHours(23, 59, 59, 999);
        
        const filteredRecords = records.filter(r => {
            const recordDate = new Date(r.dateTime).getTime();
            return recordDate >= startDate && recordDate <= endDate;
        });

        const filteredPurchases = purchases.filter(p => {
            const purchaseDate = new Date(p.date).getTime();
            return purchaseDate >= startDate && purchaseDate <= endDate;
        });

        return { filteredRecords, filteredPurchases };
    }, [records, purchases, dateRange, loading]);

    const stats = useMemo(() => {
        const { filteredRecords, filteredPurchases } = timeFilteredData;
        if (loading || !filteredRecords || !products || !filteredPurchases) return { totalSales: 0, totalPurchases: 0, grossProfit: 0, completedJobs: 0, salesOverTime: [], profitByProduct: [], salesByContact: [], purchasesBySupplier: [] };

        const completedRecords = filteredRecords.filter(r => r.workStatus === WorkStatus.REPAIRED_AND_DELIVERED);
        
        const totalSales = completedRecords.reduce((acc, r) => acc + (r.finalTotalCost || 0), 0);
        const totalPurchases = filteredPurchases.reduce((acc, p) => acc + p.totalCost, 0);
        
        const totalCOGS = completedRecords.reduce((acc, r) => {
            const costOfProducts = r.usedProducts.reduce((prodAcc, p) => prodAcc + (p.costPrice * p.quantity), 0);
            return acc + costOfProducts;
        }, 0);
        
        const grossProfit = totalSales - totalCOGS;

        // Group sales and purchases by day for a combined chart
        const timeMap = new Map<string, { sales: number, purchases: number }>();
        completedRecords.forEach(r => {
            const day = new Date(r.dateTime).toLocaleDateString('ar-EG');
            const current = timeMap.get(day) || { sales: 0, purchases: 0 };
            current.sales += (r.finalTotalCost || 0);
            timeMap.set(day, current);
        });
        filteredPurchases.forEach(p => {
            const day = new Date(p.date).toLocaleDateString('ar-EG');
            const current = timeMap.get(day) || { sales: 0, purchases: 0 };
            current.purchases += p.totalCost;
            timeMap.set(day, current);
        });
        const salesOverTime = Array.from(timeMap.entries()).map(([name, data]) => ({ name, ...data }));


        // Calculate profit by product
        const productProfitMap = new Map<string, { profit: number, count: number }>();
        completedRecords.forEach(r => {
            r.usedProducts.forEach(p => {
                const profit = (p.salePrice - p.costPrice) * p.quantity;
                const existing = productProfitMap.get(p.name) || { profit: 0, count: 0 };
                productProfitMap.set(p.name, { profit: existing.profit + profit, count: existing.count + p.quantity });
            });
        });
        const profitByProduct = Array.from(productProfitMap.entries()).map(([name, data]) => ({ name, ...data })).sort((a,b) => b.profit - a.profit);
        
        // Calculate sales by contact
        const contactSalesMap = new Map<string, number>();
        completedRecords.forEach(r => {
            const currentSales = contactSalesMap.get(r.contactName) || 0;
            contactSalesMap.set(r.contactName, currentSales + (r.finalTotalCost || 0));
        });
        const salesByContact = Array.from(contactSalesMap.entries())
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales);
            
        // Aggregate purchases by supplier
        const supplierPurchaseMap = new Map<string, number>();
        filteredPurchases.forEach(p => {
            const current = supplierPurchaseMap.get(p.supplierName) || 0;
            supplierPurchaseMap.set(p.supplierName, current + p.totalCost);
        });
        const purchasesBySupplier = Array.from(supplierPurchaseMap.entries())
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total);


        return {
            totalSales: totalSales.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
            totalPurchases: totalPurchases.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
            grossProfit: grossProfit.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
            completedJobs: completedRecords.length,
            salesOverTime,
            profitByProduct,
            salesByContact,
            purchasesBySupplier,
        };
    }, [timeFilteredData, products, loading]);

    if (loading) return <div>جاري تحميل التقارير...</div>;

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-white">التقارير المالية وتحليل الأداء</h1>
            
            <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-slate-800/50 rounded-lg">
                <label htmlFor="start-date" className="text-slate-300">من:</label>
                <input
                    type="date"
                    id="start-date"
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-slate-800 border border-slate-700 rounded-md py-2 px-4"
                />
                <label htmlFor="end-date" className="text-slate-300">إلى:</label>
                 <input
                    type="date"
                    id="end-date"
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-slate-800 border border-slate-700 rounded-md py-2 px-4"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="إجمالي المبيعات" value={stats.totalSales} color="border-green-500" />
                <StatCard title="إجمالي المشتريات" value={stats.totalPurchases} color="border-yellow-500" />
                <StatCard title="إجمالي الربح" value={stats.grossProfit} color="border-cyan-500" />
                <StatCard title="إجمالي المهام المكتملة" value={stats.completedJobs} color="border-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">المبيعات والمشتريات خلال الفترة</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.salesOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                            <Legend />
                            <Bar dataKey="sales" name="المبيعات" fill="#82ca9d" />
                            <Bar dataKey="purchases" name="المشتريات" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">الربح حسب المنتج (الأعلى ربحاً)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.profitByProduct.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" width={100} reversed={true} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                            <Legend />
                            <Bar dataKey="profit" name="الربح" fill="#8884d8">
                                {stats.profitByProduct.slice(0,5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">المبيعات حسب العميل (الأعلى شراءً)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.salesByContact.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" width={100} reversed={true} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                            <Legend />
                            <Bar dataKey="sales" name="المبيعات" fill="#82ca9d">
                                {stats.salesByContact.slice(0,5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">المشتريات حسب المورد</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.purchasesBySupplier.slice(0, 10)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                            <Legend />
                            <Bar dataKey="total" name="إجمالي المشتريات" fill="#ffc658">
                                {stats.purchasesBySupplier.slice(0, 10).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
