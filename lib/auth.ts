export const AUTH_STORAGE_KEY = "daps-auth-session";

/** Demo credentials shown on login screen */
export const DUMMY_EMAIL = "demo@dsu.com";
export const DUMMY_PASSWORD = "demo";

export type AuthUser = {
  email: string;
};

export type AuthSession = {
  user: AuthUser;
  loggedInAt: number;
};

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.user?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/** Dummy login: any email with @ and password at least 3 characters */
export function validateCredentials(email: string, password: string): boolean {
  const e = email.trim();
  const p = password.trim();
  if (!e.includes("@") || p.length < 3) return false;
  return true;
}

export const PROTECTED_PATHS = ["/home/explore"] as const;

export function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}
