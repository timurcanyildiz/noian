import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, adminToken } from "@/lib/api";

interface AdminContextValue {
  isLoggedIn: boolean;
  login: (password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!adminToken.get());

  const login = useCallback(async (password: string) => {
    const res = await api.adminLogin(password);
    if (res.ok) setIsLoggedIn(true);
    return res;
  }, []);

  const logout = useCallback(() => {
    api.adminLogout();
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, login, logout],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin, AdminProvider içinde kullanılmalıdır.");
  return ctx;
}
