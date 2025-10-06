
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ServiceRecord } from '../types';
import { EditIcon, DeleteIcon, PrintIcon, XMarkIcon } from './Icons';
import PrintReceipt from './PrintReceipt';

const RecordFormModal: React.FC<{ record: ServiceRecord, onClose: () => void, onSave: (id: string, data: Partial<ServiceRecord>) => void }> = ({ record, onClose, onSave }) => {
    const [formData, setFormData] = useState(record);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'estimatedCost' ? parseFloat(value) || 0 : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(record.id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <XMarkIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">Edit Record: {record.id}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-slate-300 mb-1">Customer Name</label>
                        <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                     <div>
                        <label htmlFor="faultDescription" className="block text-sm font-medium text-slate-300 mb-1">Fault Description</label>
                        <textarea id="faultDescription" name="faultDescription" value={formData.faultDescription} onChange={handleChange} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                     <div>
                        <label htmlFor="estimatedCost" className="block text-sm font-medium text-slate-300 mb-1">Estimated Cost</label>
                        <input type="number" id="estimatedCost" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ViewRecords: React.FC = () => {
    const { records, loading, updateRecord, deleteRecord } = useData();
    const { user, isAdmin, isEmployee } = useAuth();
    const [filter, setFilter] = useState('');
    const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
    const [printingRecord, setPrintingRecord] = useState<ServiceRecord | null>(null);

    const filteredRecords = useMemo(() => {
        return records.filter(record =>
            record.customerName.toLowerCase().includes(filter.toLowerCase()) ||
            record.id.toLowerCase().includes(filter.toLowerCase()) ||
            record.phone.includes(filter)
        );
    }, [records, filter]);
    
    const handleSave = async (id: string, data: Partial<ServiceRecord>) => {
        await updateRecord(id, data);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete record ${id}?`)) {
            await deleteRecord(id);
        }
    };
    
    const handlePrint = (record: ServiceRecord) => {
        setPrintingRecord(record);
    };

    if (loading) return <div>Loading records...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">All Service Records</h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Filter by Customer, Job ID, or Phone..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">Job ID</th>
                                <th className="p-4 font-semibold">Date/Time</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Employee</th>
                                <th className="p-4 font-semibold text-right">Cost</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredRecords.map(record => (
                                <tr key={record.id} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-mono text-cyan-400">{record.id}</td>
                                    <td className="p-4 text-slate-300">{new Date(record.dateTime).toLocaleString()}</td>
                                    <td className="p-4 font-medium text-white">{record.customerName}</td>
                                    <td className="p-4 text-slate-300">{record.phone}</td>
                                    <td className="p-4 text-slate-300">{record.employee}</td>
                                    <td className="p-4 text-right font-semibold text-green-400">${record.estimatedCost.toFixed(2)}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handlePrint(record)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Print Receipt"><PrintIcon /></button>
                                            {(isAdmin || (isEmployee && user?.username === record.employee)) && (
                                                <button onClick={() => setEditingRecord(record)} className="p-2 text-slate-400 hover:text-yellow-400 transition-colors" title="Edit Record"><EditIcon /></button>
                                            )}
                                            {isAdmin && (
                                                <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Delete Record"><DeleteIcon /></button>
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
                <RecordFormModal 
                    record={editingRecord}
                    onClose={() => setEditingRecord(null)}
                    onSave={handleSave}
                />
            )}
            
            {printingRecord && (
                <PrintReceipt record={printingRecord} onDone={() => setPrintingRecord(null)} />
            )}
        </div>
    );
};

export default ViewRecords;
