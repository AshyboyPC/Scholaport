import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import { getCurrentProfile, type StudentProfile } from "@/lib/scholaport-api";
import { clearStoredSupabaseSession, isSupabaseConfigured, supabase } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;
  configured: boolean;
  refreshProfile: () => Promise<StudentProfile | null>;
  retryAuth: () => void;
  returnToSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_REQUEST_TIMEOUT_MS = 15_000;

function withAuthTimeout<T>(request: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("The secure account service took too long to respond."));
    }, AUTH_REQUEST_TIMEOUT_MS);

    void request.then(resolve, reject).finally(() => window.clearTimeout(timeout));
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const profileRef = useRef<StudentProfile | null>(null);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return null;
    const current = await withAuthTimeout(getCurrentProfile());
    setProfile(current);
    return current;
  }, []);

  const retryAuth = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryCount((count) => count + 1);
  }, []);

  const returnToSignIn = useCallback(async () => {
    // Supabase signOut still makes a network request before deleting local storage.
    // Clear only this project's stored session so recovery also works while offline.
    clearStoredSupabaseSession();
    setSession(null);
    setProfile(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;

    let active = true;
    const initialize = async () => {
      try {
        const { data, error: sessionError } = await withAuthTimeout(client.auth.getSession());
        if (sessionError) throw sessionError;
        if (!active) return;
        setSession(data.session);
        if (data.session) setProfile(await getCurrentProfile());
      } catch (cause) {
        if (active)
          setError(cause instanceof Error ? cause.message : "Unable to initialize authentication.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void initialize();

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError(null);
      if (!nextSession) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      // If we already have the profile for this user, do not show a disruptive 
      // loading screen (e.g., when the token refreshes or the tab regains focus).
      if (profileRef.current?.user_id === nextSession.user.id) {
        return;
      }

      setLoading(true);
      window.setTimeout(() => {
        void refreshProfile()
          .catch((cause) =>
            setError(cause instanceof Error ? cause.message : "Unable to load profile."),
          )
          .finally(() => setLoading(false));
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshProfile, retryCount]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      error,
      configured: isSupabaseConfigured,
      refreshProfile,
      retryAuth,
      returnToSignIn,
      signOut,
    }),
    [session, profile, loading, error, refreshProfile, retryAuth, returnToSignIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider.");
  return value;
}

/**
 * Development-only provider for the standalone visual QA entry. It never
 * participates in the production route tree and it does not change Supabase
 * authentication or stored sessions.
 */
export function VisualQaAuthProvider({
  children,
  profile,
  user,
}: {
  children: React.ReactNode;
  profile: StudentProfile;
  user: User;
}) {
  if (!import.meta.env.DEV) return null;
  const session = {
    access_token: "visual-qa-only",
    refresh_token: "visual-qa-only",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user,
  } satisfies Session;
  const value: AuthContextValue = {
    session,
    user,
    profile,
    loading: false,
    error: null,
    configured: true,
    refreshProfile: async () => profile,
    retryAuth: () => undefined,
    returnToSignIn: async () => undefined,
    signOut: async () => undefined,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
