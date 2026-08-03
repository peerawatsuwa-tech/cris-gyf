import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { loadProfile, signIn } from "@/services/authService";
import { setAuthPersistence, supabase } from "@/services/supabase";
import type { UserProfile } from "@/types/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  profile: UserProfile | null;
  login: (
    username: string,
    password: string,
    remember: boolean,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function applySession(nextSession: Session | null) {
      if (!active) return;
      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const nextProfile = await loadProfile(nextSession.user.id);
        if (active) setProfile(nextProfile);
      } catch {
        if (active) {
          setProfile(null);
          setTimeout(() => void supabase.auth.signOut(), 0);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setTimeout(() => void applySession(nextSession), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session && profile),
      loading,
      profile,
      async login(username, password, remember) {
        setLoading(true);
        setAuthPersistence(remember);

        try {
          const { user, session: nextSession } = await signIn(username, password);
          const nextProfile = await loadProfile(user.id);
          setSession(nextSession);
          setProfile(nextProfile);
          return { ok: true };
        } catch (error) {
          setProfile(null);
          await supabase.auth.signOut();
          return {
            ok: false,
            error: error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ",
          };
        } finally {
          setLoading(false);
        }
      },
      async logout() {
        setLoading(true);
        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
        setLoading(false);
      },
    }),
    [loading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
