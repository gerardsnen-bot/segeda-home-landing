import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;
  const fullName = user.user_metadata?.full_name;
  return {
    id: user.id,
    email: user.email ?? "",
    name: typeof fullName === "string" && fullName.trim() ? fullName : user.email ?? "Administración",
  };
}

/** Sesión administrativa gestionada únicamente por Supabase Auth. */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError(new Error("Supabase no está configurado."));
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      setUser(mapUser(data.session?.user ?? null));
      setError(sessionError ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(mapUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return;
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) throw logoutError;
    setUser(null);
  }, []);

  return useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    refresh: async () => {
      if (!supabase) return;
      const { data, error: sessionError } = await supabase.auth.getSession();
      setUser(mapUser(data.session?.user ?? null));
      setError(sessionError ?? null);
    },
    logout,
  }), [error, loading, logout, user]);
}
