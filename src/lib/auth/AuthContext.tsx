import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getJwtExpiryMs } from "./jwtDecode";
import { fetchMe, logoutRequest, refreshSession, type AuthUser } from "./authApi";
import { getAccessToken, setAccessToken } from "./accessToken";

type AuthStatus = "loading" | "anonymous" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  /** Connexion réussie (jeton en mémoire + cookie refresh côté serveur) */
  setSessionFromLogin: (accessToken: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function scheduleRefresh(
  accessToken: string,
  onRefresh: () => Promise<void>,
): ReturnType<typeof setTimeout> | undefined {
  const exp = getJwtExpiryMs(accessToken);
  if (exp == null) return undefined;
  const ms = Math.max(0, exp - Date.now() - 45_000);
  return window.setTimeout(() => {
    void onRefresh();
  }, ms);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current != null) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = undefined;
    }
  }, []);

  const scheduleNext = useCallback(
    (token: string) => {
      clearRefreshTimer();
      refreshTimerRef.current = scheduleRefresh(token, async () => {
        const next = await refreshSession();
        if (next) {
          setUser(next.user);
          scheduleNext(next.accessToken);
        } else {
          setUser(null);
          setStatus("anonymous");
        }
      });
    },
    [clearRefreshTimer],
  );

  const bootstrap = useCallback(async () => {
    const existing = getAccessToken();
    if (existing) {
      const me = await fetchMe();
      if (me) {
        setUser(me);
        setStatus("authenticated");
        scheduleNext(existing);
        return;
      }
      setAccessToken(null);
    }
    const refreshed = await refreshSession();
    if (refreshed) {
      setUser(refreshed.user);
      setStatus("authenticated");
      scheduleNext(refreshed.accessToken);
      return;
    }
    setAccessToken(null);
    setStatus("anonymous");
  }, [scheduleNext]);

  useEffect(() => {
    void bootstrap();
    return () => clearRefreshTimer();
  }, [bootstrap, clearRefreshTimer]);

  const setSessionFromLogin = useCallback(
    (accessToken: string, nextUser: AuthUser) => {
      setAccessToken(accessToken);
      setUser(nextUser);
      setStatus("authenticated");
      scheduleNext(accessToken);
    },
    [scheduleNext],
  );

  const logout = useCallback(async () => {
    clearRefreshTimer();
    await logoutRequest();
    setUser(null);
    setStatus("anonymous");
  }, [clearRefreshTimer]);

  const value = useMemo(
    () => ({
      status,
      user,
      setSessionFromLogin,
      logout,
    }),
    [status, user, setSessionFromLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
