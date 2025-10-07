import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useData } from '../context/DataContext';
import { ServiceRecord, WorkStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className={`bg-slate-800 p-6 rounded-lg shadow-lg border-r-4 ${color}`}>
    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1 text-right">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { records, products, contacts, loading } = useData();

  const stats = useMemo(() => {
    if (loading || !records || !products || !contacts) return { totalRevenue: 0, grossProfit: 0, inProgress: 0, byWorkStatus: [], revenueOverTime: [], lowStockProducts: [], totalCustomers: 0, averageRating: 0 };

    const completedRecords = records.filter(r => r.workStatus === WorkStatus.REPAIRED_AND_DELIVERED);
    
    const totalRevenue = completedRecords.reduce((acc, r) => acc + (r.finalTotalCost || 0), 0);
    
    const totalCostOfGoods = completedRecords.reduce((acc, r) => {
        const costOfProducts = r.usedProducts.reduce((prodAcc, p) => prodAcc + (p.costPrice * p.quantity), 0);
        return acc + costOfProducts;
    }, 0);
    
    const grossProfit = totalRevenue - totalCostOfGoods;

    const byWorkStatus = Object.values(records.reduce((acc, record) => {
        const status = record.workStatus;
        if (!acc[status]) {
            acc[status] = { name: status, value: 0 };
        }
        acc[status].value++;
        return acc;
    }, {} as Record<string, {name: string, value: number}>));

    // Revenue over last 7 days
    const revenueOverTime: { name: string, revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('ar-EG', { weekday: 'short' });
        const dayStart = new Date(d.setHours(0, 0, 0, 0)).toISOString().split('T')[0];

        const dayRevenue = completedRecords
            .filter(r => r.dateTime.startsWith(dayStart))
            .reduce((acc, r) => acc + (r.finalTotalCost || 0), 0);
        
        revenueOverTime.push({ name: dayStr, revenue: dayRevenue });
    }
    
    const lowStockProducts = products.filter(p => p.type === 'Product' && p.stock < 5);
    
    const totalCustomers = contacts.filter(c => c.type === 'عميل' || c.type === 'عميل ومورد').length;
    
    const ratedRecords = records.filter(r => r.rating && r.rating > 0);
    const averageRating = ratedRecords.length > 0
        ? (ratedRecords.reduce((acc, r) => acc + r.rating!, 0) / ratedRecords.length)
        : 0;

    return {
      totalRevenue: totalRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
      grossProfit: grossProfit.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }),
      inProgress: records.filter(r => r.workStatus === WorkStatus.BEING_REPAIRED || r.workStatus === WorkStatus.IN_QUEUE).length,
      totalCustomers,
      averageRating: averageRating.toFixed(1) + ' / 5',
      byWorkStatus,
      revenueOverTime,
      lowStockProducts,
    };
  }, [records, products, contacts, loading]);


  if (loading) return <div>جاري التحميل...</div>;
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">لوحة التحكم</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="إجمالي الإيرادات (للسجلات المكتملة)" value={stats.totalRevenue} color="border-green-500" />
        <StatCard title="إجمالي الربح (الإيرادات - تكلفة القطع)" value={stats.grossProfit} color="border-cyan-500" />
        <StatCard title="سجلات قيد التنفيذ" value={stats.inProgress} color="border-yellow-500" />
        <StatCard title="إجمالي العملاء" value={stats.totalCustomers} color="border-purple-500" />
        <StatCard title="متوسط تقييم الخدمات" value={stats.averageRating} color="border-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">الإيرادات خلال آخر 7 أيام</h2>
           <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="الإيرادات" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">توزيع حالات الطلبات</h2>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={stats.byWorkStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {stats.byWorkStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>


        <div className="lg:col-span-5 bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white text-yellow-400">تنبيهات انخفاض المخزون (أقل من 5 قطع)</h2>
          {stats.lowStockProducts.length > 0 ? (
            <ul className="space-y-2">
                {stats.lowStockProducts.map(product => (
                <li key={product.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-md">
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="font-bold text-red-500">المتبقي: {product.stock}</p>
                </li>
                ))}
            </ul>
          ) : (
            <p className="text-slate-400">لا توجد منتجات منخفضة المخزون حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
