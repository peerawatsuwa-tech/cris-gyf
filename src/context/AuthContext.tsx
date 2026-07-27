import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const AUTH_STORAGE_KEY = "cris-v027-authenticated";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (username: string, password: string, remember: boolean) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      sessionStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
      localStorage.getItem(AUTH_STORAGE_KEY) === "true",
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login(username, password, remember) {
        const accepted = username.trim().length > 0 && password.length > 0;
        if (!accepted) return false;

        const storage = remember ? localStorage : sessionStorage;
        const otherStorage = remember ? sessionStorage : localStorage;
        storage.setItem(AUTH_STORAGE_KEY, "true");
        otherStorage.removeItem(AUTH_STORAGE_KEY);
        setIsAuthenticated(true);
        return true;
      },
      logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
