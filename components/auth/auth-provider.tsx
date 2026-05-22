"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthSession,
  DUMMY_EMAIL,
  readAuthSession,
  validateCredentials,
  writeAuthSession,
  type AuthUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginAsDemo: () => { ok: boolean };
  logout: () => void;
  refreshSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(() => {
    const session = readAuthSession();
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    refreshSession();
    setIsLoading(false);
  }, [refreshSession]);

  const persistUser = useCallback((authUser: AuthUser) => {
    writeAuthSession({ user: authUser, loggedInAt: Date.now() });
    setUser(authUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!validateCredentials(email, password)) {
      return {
        ok: false,
        error: "Use any email (with @) and password with 3+ characters. Demo: demo@dsu.com / demo",
      };
    }

    persistUser({ email: email.trim().toLowerCase() });
    return { ok: true };
  }, [persistUser]);

  const loginAsDemo = useCallback(() => {
    persistUser({ email: DUMMY_EMAIL });
    return { ok: true };
  }, [persistUser]);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      loginAsDemo,
      logout,
      refreshSession,
    }),
    [user, isLoading, login, loginAsDemo, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
