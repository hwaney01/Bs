
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { ServiceRecord } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className={`bg-slate-800 p-6 rounded-lg shadow-lg border-l-4 ${color}`}>
    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { records, loading } = useData();

  const stats = useMemo(() => {
    if (loading || !records) return { today: 0, week: 0, totalCost: 0, byEmployee: [] };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay())).setHours(0, 0, 0, 0);

    const todayRecords = records.filter(r => new Date(r.dateTime).getTime() >= todayStart);
    const weekRecords = records.filter(r => new Date(r.dateTime).getTime() >= weekStart);
    const totalCost = records.reduce((acc, r) => acc + r.estimatedCost, 0);

    const byEmployee = records.reduce((acc, record) => {
      const existing = acc.find(item => item.name === record.employee);
      if (existing) {
        existing.records += 1;
      } else {
        acc.push({ name: record.employee, records: 1 });
      }
      return acc;
    }, [] as { name: string; records: number }[]);

    return {
      today: todayRecords.length,
      week: weekRecords.length,
      totalCost: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      byEmployee,
    };
  }, [records, loading]);

  const recentActivity = useMemo(() => {
    return records.slice(0, 5);
  }, [records]);

  if (loading) return <div>Loading...</div>;
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Records Today" value={stats.today} color="border-cyan-500" />
        <StatCard title="Records This Week" value={stats.week} color="border-purple-500" />
        <StatCard title="Total Estimated Cost" value={stats.totalCost} color="border-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Records by Employee</h2>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byEmployee} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="records" name="Records Handled" fill="#8884d8">
                {stats.byEmployee.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <ul className="space-y-4">
            {recentActivity.map((record: ServiceRecord) => (
              <li key={record.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-md">
                <div>
                  <p className="font-semibold text-white">{record.customerName} - <span className="text-slate-300">{record.id}</span></p>
                  <p className="text-sm text-slate-400">{record.faultDescription.substring(0, 40)}...</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-green-400">${record.estimatedCost.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{new Date(record.dateTime).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
