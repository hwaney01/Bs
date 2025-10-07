import React from 'react';

const iconProps = {
  className: "w-6 h-6",
};

export const HomeIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.75 2.56391C12.35 2.24391 11.65 2.24391 11.25 2.56391L4.25 8.31391C3.9 8.59391 3.84 9.07391 4.12 9.42391C4.4 9.77391 4.88 9.83391 5.23 9.55391L12 3.99391L18.77 9.55391C19.12 9.83391 19.6 9.77391 19.88 9.42391C20.16 9.07391 20.1 8.59391 19.75 8.31391L12.75 2.56391Z" fill="#3B82F6"/>
    <path d="M18 10.9939H16V19.9939C16 20.5439 15.55 20.9939 15 20.9939H9C8.45 20.9939 8 20.5439 8 19.9939V10.9939H6C5.45 10.9939 5 10.5439 5 9.99391V8.99391C5 8.44391 5.45 7.99391 6 7.99391H18C18.55 7.99391 19 8.44391 19 8.99391V9.99391C19 10.5439 18.55 10.9939 18 10.9939Z" fill="#60A5FA"/>
  </svg>
);

export const PlusCircleIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#22C55E"/>
    <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TableCellsIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5.5C3 4.11929 4.11929 3 5.5 3H18.5C19.8807 3 21 4.11929 21 5.5V18.5C21 19.8807 19.8807 21 18.5 21H5.5C4.11929 21 3 19.8807 3 18.5V5.5Z" fill="#3B82F6"/>
        <path d="M3 9H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 15H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 3V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const UsersIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493m-4.59 2.516a6.375 6.375 0 0111.964-4.684v-.005" fill="#A78BFA"/>
        <path d="M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.684v.005zM4.502 15a5.998 5.998 0 0010.996 0M4.502 15v-.003c0-1.113.285-2.16.786-3.07M4.502 15v.106A12.318 12.318 0 008.624 21" fill="#C4B5FD"/>
    </svg>
);

export const LogoutIcon = () => (
    <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.75 12l-3-3m0 3l3-3m0 0l3 3m-3-3H9" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const EditIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.024 4.50098L4.50002 13.025C4.08602 13.439 3.86902 13.987 3.89602 14.545L4.09602 18.045C4.13602 18.784 4.71602 19.364 5.45502 19.404L8.95502 19.604C9.51302 19.631 10.061 19.414 10.475 19L18.999 10.476C20.999 8.47602 20.999 5.31402 18.999 3.31402C16.999 1.31402 13.837 1.31402 11.837 3.31402L11.129 4.02198" stroke="#FBBF24" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.91406 5.20117L18.2981 13.5852" stroke="#FDE08A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DeleteIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.12 2.75 15.28 3.67L15.5 4.97" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.33 16.5H13.66" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 12.5H14.5" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PrintIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.25 7H16.75V5C16.75 3.9 15.85 3 14.75 3H9.25C8.15 3 7.25 3.9 7.25 5V7Z" fill="#93C5FD"/>
    <path d="M16.75 7H7.25C6.01 7 5 8.01 5 9.25V14.75C5 15.99 6.01 17 7.25 17H8V19.5C8 20.33 8.67 21 9.5 21H14.5C15.33 21 16 20.33 16 19.5V17H16.75C17.99 17 19 15.99 19 14.75V9.25C19 8.01 17.99 7 16.75 7Z" fill="#3B82F6"/>
    <path d="M16 19.5H8V15C8 14.45 8.45 14 9 14H15C15.55 14 16 14.45 16 15V19.5Z" fill="#BFDBFE"/>
  </svg>
);

export const XMarkIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#F87171"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ChartBarIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="13" width="4" height="6" rx="1" fill="#34D399"/>
        <rect x="10" y="8" width="4" height="11" rx="1" fill="#60A5FA"/>
        <rect x="16" y="4" width="4" height="15" rx="1" fill="#FBBF24"/>
    </svg>
);

export const CubeIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 7.5L12 2.25L3 7.5V16.5L12 21.75L21 16.5V7.5Z" fill="#F59E0B"/>
        <path d="M12 12.75L21 7.5L12 2.25L3 7.5L12 12.75Z" fill="#FCD34D"/>
        <path d="M12 21.75V12.75L3 7.5V16.5L12 21.75Z" fill="#FDBA74"/>
        <path d="M12 21.75V12.75L21 7.5V16.5L12 21.75Z" fill="#F97316"/>
    </svg>
);

export const ContactsIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" fill="#3B82F6"/>
        <circle cx="9.375" cy="10.3125" r="2.8125" fill="#BFDBFE"/>
        <path d="M15 9h3.75M15 12h3.75M15 15h2.25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5.625 19.5V16.3125C5.625 14.8693 6.7818 13.6875 8.25 13.6875H10.5C11.9682 13.6875 13.125 14.8693 13.125 16.3125V19.5" fill="#60A5FA"/>
    </svg>
);

export const CogIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" fill="#9CA3AF"/>
        <circle cx="12" cy="12" r="3" fill="#E5E7EB"/>
    </svg>
);

export const ShieldCheckIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.25C12 2.25 21 4.5 21 12C21 19.5 12 21.75 12 21.75C12 21.75 3 19.5 3 12C3 4.5 12 2.25 12 2.25Z" fill="#34D399"/>
        <path d="M9 12.75L11.25 15L15 9.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SalesIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.75 6.75h16.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V7.5a.75.75 0 01.75-.75z" fill="#60A5FA"/>
        <path d="M3 8.25h18v3H3v-3z" fill="#3B82F6"/>
        <path d="M9 14.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#BFDBFE"/>
        <path d="M16.5 12.75h-3.75" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export const PurchasesIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.25 9.75h-8.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5zM17.25 13.5h-8.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5z" fill="#FCD34D"/>
        <path d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" fill="#FBBF24"/>
        <path d="M7.5 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#FDE047"/>
    </svg>
);

// Deprecated, use ContactsIcon instead
export const IdentificationIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" fill="#3B82F6"/>
        <circle cx="9.375" cy="10.3125" r="2.8125" fill="#BFDBFE"/>
        <path d="M15 9h3.75M15 12h3.75M15 15h2.25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5.625 19.5V16.3125C5.625 14.8693 6.7818 13.6875 8.25 13.6875H10.5C11.9682 13.6875 13.125 14.8693 13.125 16.3125V19.5" fill="#60A5FA"/>
    </svg>
);
