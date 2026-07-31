import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    company: string;
    country: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "vars.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            // Restore saved user metadata from localStorage or fallback to server user
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw && isMounted) {
              setUser(JSON.parse(raw));
            } else if (isMounted && data.user) {
              setUser(data.user);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
              } catch {
                /* noop */
              }
            }
          } else {
            if (isMounted) setUser(null);
          }
        }
      } catch {
        // Fallback to local storage state if offline
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw && isMounted) setUser(JSON.parse(raw));
        } catch {
          /* noop */
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      try {
        if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        const errMsg = data.message || "Invalid credentials. Please try again.";
        setError(errMsg);
        setIsLoading(false);
        return { success: false, error: errMsg };
      }

      const authenticatedUser: User = data.user || {
        id: `u_${Date.now()}`,
        name: email.split("@")[0],
        email,
        company: "VARS Partner",
      };

      persistUser(authenticatedUser);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Network error. Failed to connect to server.";
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const register = async (data: {
    name: string;
    company: string;
    country: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok || resData.error) {
        const errMsg = resData.message || "Registration failed. Please check form inputs.";
        setError(errMsg);
        setIsLoading(false);
        return { success: false, error: errMsg };
      }

      const authenticatedUser: User = resData.user || {
        id: `u_${Date.now()}`,
        name: data.name,
        company: data.company,
        country: data.country,
        email: data.email,
        phone: data.phone,
      };

      persistUser(authenticatedUser);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Network error. Failed to complete registration.";
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    } finally {
      persistUser(null);
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persistUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
