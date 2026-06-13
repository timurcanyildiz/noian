/**
 * ============================================================================
 *  KİMLİK DOĞRULAMA (AUTH) — DEMO / BACKEND'E HAZIR
 * ============================================================================
 *  ⚠️ SAHİBİNE NOT:
 *  Bu, GERÇEK bir kimlik doğrulama DEĞİLDİR. Kayıt/giriş bilgileri yalnızca
 *  tarayıcıda (localStorage) tutulur; şifreler güvenli şekilde saklanmaz.
 *  Bu sayede siteyi baştan sona test edebilirsiniz.
 *
 *  GERÇEK GİRİŞ İÇİN (Lovable'da önerilen): Supabase Auth bağlayın.
 *  Aşağıdaki fonksiyonların içini Supabase çağrılarıyla değiştirin:
 *    - supabase.auth.signUp(...)
 *    - supabase.auth.signInWithPassword(...)
 *    - supabase.auth.signOut()
 *    - supabase.auth.resetPasswordForEmail(...)
 *  Arayüz kodunu değiştirmenize gerek kalmaz.
 * ============================================================================
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/data/types";

const STORAGE_USER = "noian_auth_user";
const STORAGE_ACCOUNTS = "noian_demo_accounts"; // demo "veritabanı"

interface DemoAccount extends User {
  password: string; // ⚠️ yalnızca demo amaçlı; gerçekte ASLA böyle saklanmaz
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (
    email: string,
  ) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readAccounts(): DemoAccount[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS) ?? "[]");
  } catch {
    return [];
  }
}

function writeAccounts(accounts: DemoAccount[]) {
  localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* yoksay */
    }
  }, []);

  const persistSession = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_USER);
  }, []);

  const register: AuthContextValue["register"] = useCallback(
    async ({ fullName, email, password, phone }) => {
      const accounts = readAccounts();
      if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "Bu e-posta ile zaten bir hesap var." };
      }
      const account: DemoAccount = {
        id: `u-${Date.now()}`,
        fullName,
        email,
        phone,
        password,
        createdAt: new Date().toISOString(),
      };
      writeAccounts([...accounts, account]);
      const { password: _pw, ...publicUser } = account;
      void _pw;
      persistSession(publicUser);
      return { ok: true };
    },
    [persistSession],
  );

  const login: AuthContextValue["login"] = useCallback(
    async (email, password) => {
      const accounts = readAccounts();
      const found = accounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase(),
      );
      if (!found || found.password !== password) {
        return { ok: false, error: "E-posta veya şifre hatalı." };
      }
      const { password: _pw, ...publicUser } = found;
      void _pw;
      persistSession(publicUser);
      return { ok: true };
    },
    [persistSession],
  );

  const logout = useCallback(() => persistSession(null), [persistSession]);

  const requestPasswordReset: AuthContextValue["requestPasswordReset"] =
    useCallback(async (email) => {
      const accounts = readAccounts();
      const exists = accounts.some(
        (a) => a.email.toLowerCase() === email.toLowerCase(),
      );
      // Güvenlik için gerçek sistemlerde "hesap var mı" bilgisi sızdırılmaz.
      // Demo'da her durumda başarı mesajı döneriz.
      void exists;
      return { ok: true };
    }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      requestPasswordReset,
    }),
    [user, register, login, logout, requestPasswordReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  return ctx;
}
