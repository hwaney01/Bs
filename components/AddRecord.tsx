
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ServiceRecord } from '../types';

interface AddRecordProps {
  onRecordAdded: () => void;
}

const AddRecord: React.FC<AddRecordProps> = ({ onRecordAdded }) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [faultDescription, setFaultDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRecord } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !faultDescription || !estimatedCost) {
      setError('جميع الحقول مطلوبة.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const newRecordData: Omit<ServiceRecord, 'id' | 'dateTime' | 'employee'> = {
        customerName,
        phone,
        faultDescription,
        estimatedCost: parseFloat(estimatedCost),
      };
      await addRecord(newRecordData);
      
      // Reset form
      setCustomerName('');
      setPhone('');
      setFaultDescription('');
      setEstimatedCost('');
      
      onRecordAdded(); // Navigate to view records page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إضافة السجل.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">إضافة سجل خدمة جديد</h1>
      <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-slate-300 mb-2">اسم العميل</label>
              <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">رقم الهاتف</label>
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label htmlFor="faultDescription" className="block text-sm font-medium text-slate-300 mb-2">وصف العطل المبدئي</label>
            <textarea id="faultDescription" rows={4} value={faultDescription} onChange={e => setFaultDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label htmlFor="estimatedCost" className="block text-sm font-medium text-slate-300 mb-2">التكلفة التقديرية المبدئية ($)</label>
            <input type="number" id="estimatedCost" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-slate-500 transition-colors">
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ السجل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecord;
