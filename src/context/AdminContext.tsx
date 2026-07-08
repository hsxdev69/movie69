import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminContextType {
  adminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminOpen, setAdminOpen] = useState(false);
  return (
    <AdminContext.Provider
      value={{
        adminOpen,
        openAdmin: () => setAdminOpen(true),
        closeAdmin: () => setAdminOpen(false),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
