import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ServiceRecord, DeviceType, WorkStatus, Contact, Role, ContactType } from '../types';

const AddRecord: React.FC<{ onRecordAdded: () => void; }> = ({ onRecordAdded }) => {
  const { user, isAdmin } = useAuth();
  const { addRecord, contacts, users } = useData();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [faultDescription, setFaultDescription] = useState('');
  const [estimatedLaborCost, setEstimatedLaborCost] = useState('');
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.LAPTOP);
  const [deviceModel, setDeviceModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('غير معلوم');
  const [deviceStatus, setDeviceStatus] = useState('');
  const [workStatus, setWorkStatus] = useState<WorkStatus>(WorkStatus.IN_QUEUE);
  const [employee, setEmployee] = useState(user?.username || '');
  
  const [contactSearch, setContactSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const employees = useMemo(() => users.filter(u => u.role === Role.ADMIN || u.role === Role.EMPLOYEE), [users]);
  
  const customerContacts = useMemo(() => 
    contacts.filter(c => c.type === ContactType.CUSTOMER || c.type === ContactType.BOTH), 
  [contacts]);

  const filteredContacts = useMemo(() => 
    customerContacts.filter(c => 
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
      c.phone.includes(contactSearch)
    ),
  [customerContacts, contactSearch]);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setContactSearch(contact.name);
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactSearch(e.target.value);
    setSelectedContact(null);
    setShowDropdown(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !faultDescription || !estimatedLaborCost || !deviceModel || !serialNumber || !deviceStatus || !employee) {
      setError('جميع الحقول مطلوبة، بما في ذلك اختيار جهة اتصال.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const newRecordData = {
        contactId: selectedContact.id,
        contactName: selectedContact.name,
        contactPhone: selectedContact.phone,
        faultDescription,
        estimatedLaborCost: parseFloat(estimatedLaborCost),
        deviceType,
        deviceModel,
        serialNumber,
        deviceStatus,
        workStatus,
        employee,
      };
      await addRecord(newRecordData as Omit<ServiceRecord, 'id'|'dateTime'|'usedProducts'>);
      onRecordAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إضافة السجل.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">إضافة سجل خدمة جديد</h1>
      <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">بيانات العميل والموظف</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="relative">
                <label htmlFor="contactSearch" className="block text-sm font-medium text-slate-300 mb-2">بحث عن عميل (بالاسم أو الهاتف)</label>
                <input 
                  type="text" 
                  id="contactSearch" 
                  value={contactSearch} 
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ابدأ الكتابة للبحث..."
                  autoComplete="off"
                />
                {showDropdown && filteredContacts.length > 0 && (
                  <ul className="absolute z-10 w-full bg-slate-900 border border-slate-700 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {filteredContacts.map(contact => (
                      <li 
                        key={contact.id} 
                        onClick={() => handleContactSelect(contact)}
                        className="px-3 py-2 hover:bg-indigo-600 cursor-pointer"
                      >
                        {contact.name} - {contact.phone}
                      </li>
                    ))}
                  </ul>
                )}
                {selectedContact && <p className="text-xs text-green-400 mt-1">تم اختيار: {selectedContact.name}</p>}
              </div>
              <div>
                <label htmlFor="employee" className="block text-sm font-medium text-slate-300 mb-2">الموظف المسؤول</label>
                <select id="employee" value={employee} onChange={e => setEmployee(e.target.value)} disabled={!isAdmin}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-700">
                    <option value="">-- اختر موظف --</option>
                    {employees.map(emp => <option key={emp.id} value={emp.username}>{emp.username}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">بيانات الجهاز والعطل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div>
                    <label htmlFor="deviceType" className="block text-sm font-medium text-slate-300 mb-2">نوع الجهاز</label>
                    <select id="deviceType" value={deviceType} onChange={e => setDeviceType(e.target.value as DeviceType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {Object.values(DeviceType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="deviceModel" className="block text-sm font-medium text-slate-300 mb-2">الموديل</label>
                    <input type="text" id="deviceModel" value={deviceModel} onChange={e => setDeviceModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label htmlFor="serialNumber" className="block text-sm font-medium text-slate-300 mb-2">الرقم التسلسلي</label>
                    <input type="text" id="serialNumber" value={serialNumber} onChange={e => setSerialNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label htmlFor="faultDescription" className="block text-sm font-medium text-slate-300 mb-2">وصف العطل المبدئي</label>
                    <textarea id="faultDescription" rows={4} value={faultDescription} onChange={e => setFaultDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                 <div>
                    <label htmlFor="deviceStatus" className="block text-sm font-medium text-slate-300 mb-2">حالة الجهاز عند الاستلام</label>
                    <textarea id="deviceStatus" rows={4} value={deviceStatus} onChange={e => setDeviceStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
            </div>
          </div>
          
           <div className="p-4 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">التكلفة والتقييم الداخلي</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="estimatedLaborCost" className="block text-sm font-medium text-slate-300 mb-2">تكلفة العمل المبدئية (ج.م)</label>
                    <input type="number" id="estimatedLaborCost" value={estimatedLaborCost} onChange={e => setEstimatedLaborCost(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
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
