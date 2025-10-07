import React, { useState } from 'react';
import { usePermissions } from '../context/PermissionContext';
import { Role } from '../types';
import { View } from '../App';

const viewTranslations: Record<View, string> = {
    DASHBOARD: 'لوحة التحكم',
    REPORTS: 'التقارير',
    ADD_RECORD: 'إضافة سجل خدمة',
    VIEW_RECORDS: 'عرض سجلات الخدمة',
    CONTACTS: 'جهات الاتصال',
    SALES: 'المبيعات',
    PURCHASES: 'المشتريات',
    PRODUCTS: 'إدارة المنتجات',
    USERS: 'المستخدمون',
    WARRANTY: 'إدارة الضمان',
    PERMISSIONS: 'إدارة الصلاحيات',
};

const roleTranslations: Record<Role, string> = {
    [Role.ADMIN]: 'مدير',
    [Role.EMPLOYEE]: 'موظف',
    [Role.VIEWER]: 'مشاهد',
}

const PermissionsManagement: React.FC = () => {
    const { permissions, updatePermissions } = usePermissions();
    const [localPermissions, setLocalPermissions] = useState(permissions);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // Exclude PERMISSIONS from being assignable
    const allViews: View[] = ['DASHBOARD', 'REPORTS', 'ADD_RECORD', 'VIEW_RECORDS', 'SALES', 'PURCHASES', 'CONTACTS', 'PRODUCTS', 'USERS', 'WARRANTY']; 
    const editableRoles: Role[] = [Role.EMPLOYEE, Role.VIEWER];
    
    const handlePermissionChange = (role: Role, view: View, checked: boolean) => {
        setLocalPermissions(prev => {
            const currentViews = prev[role] || [];
            const newViews = checked 
                ? [...currentViews, view]
                : currentViews.filter(v => v !== view);
            return { ...prev, [role]: [...new Set(newViews)] };
        });
    };

    const handleSave = () => {
        setIsSaving(true);
        setSaved(false);
        updatePermissions(localPermissions);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 500);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">إدارة الصلاحيات</h1>
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">الصلاحية / الدور</th>
                                {Object.values(Role).map(role => (
                                    <th key={role} className="p-4 font-semibold text-center">{roleTranslations[role]}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {allViews.map(view => (
                                <tr key={view} className="hover:bg-slate-700/30">
                                    <td className="p-4 font-medium text-white">{viewTranslations[view]}</td>
                                    {/* Admin Column */}
                                    <td className="p-4 text-center">
                                        <input type="checkbox" checked readOnly disabled className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50" />
                                    </td>
                                    {/* Editable Roles Columns */}
                                    {editableRoles.map(role => (
                                        <td key={`${role}-${view}`} className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={localPermissions[role]?.includes(view) || false}
                                                onChange={(e) => handlePermissionChange(role, view, e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 bg-slate-800 flex justify-end items-center gap-4">
                    {saved && <p className="text-green-400">تم حفظ التغييرات بنجاح!</p>}
                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-slate-500">
                       {isSaving ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
                    </button>
                </div>
            </div>
             <div className="mt-4 p-4 bg-slate-900/50 rounded-lg text-sm text-slate-400">
                <p><strong>ملاحظات:</strong></p>
                <ul className="list-disc pr-5">
                    <li>دور <strong>المدير</strong> لديه دائمًا وصول كامل لجميع الصفحات ولا يمكن تعديله.</li>
                    <li>دور <strong>الموظف</strong> مخصص لإدخال البيانات والتعديلات الأساسية.</li>
                    <li>دور <strong>المشاهد</strong> مخصص لعرض البيانات والتقارير فقط.</li>
                    <li>سيتم تطبيق التغييرات على الفور للمستخدمين عند تسجيل الدخول التالي أو تحديث الصفحة.</li>
                </ul>
            </div>
        </div>
    );
};

export default PermissionsManagement;
