import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

type UserRole = "student" | "landlord";

interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string; // STUDENT or LANDLORD
  name: string;
}

interface AuthContextValue {
  token: string | null;
  userId: string | null;
  email: string | null;
  name: string | null;
  role: UserRole;
  initialized: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "aeu:currentUser";

const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

const mapRoleToUserRole = (role: string): UserRole => {
  return role === "LANDLORD" ? "landlord" : "student";
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("student");
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    console.log("[AuthContext] Loading session from localStorage...");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    console.log("[AuthContext] Saved data:", saved ? "Found" : "Not found");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { token: string };
      const decoded = decodeToken(parsed.token);
      console.log("[AuthContext] Decoded saved token:", decoded);
      if (decoded) {
        setToken(parsed.token);
        setUserId(decoded.sub);
        setEmail(decoded.email);
        setName(decoded.name);
        setRole(mapRoleToUserRole(decoded.role));
        console.log("[AuthContext] Session restored:", {
          userId: decoded.sub,
          role: mapRoleToUserRole(decoded.role),
        });
      }
    } catch (err) {
      console.error("[AuthContext] Error parsing saved session:", err);
    } finally {
      setInitialized(true);
    }
  }, []);

  const login = (newToken: string) => {
    console.log(
      "[AuthContext] login() called with token:",
      newToken.substring(0, 20) + "...",
    );
    const decoded = decodeToken(newToken);
    console.log("[AuthContext] Decoded token:", decoded);
    if (!decoded) {
      console.error("[AuthContext] Invalid token - cannot decode");
      return;
    }

    setToken(newToken);
    setUserId(decoded.sub);
    setEmail(decoded.email);
    setName(decoded.name);
    setRole(mapRoleToUserRole(decoded.role));
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: newToken }),
    );
    console.log("[AuthContext] Token saved to localStorage:", STORAGE_KEY);
    console.log("[AuthContext] User logged in:", {
      userId: decoded.sub,
      role: mapRoleToUserRole(decoded.role),
    });
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setEmail(null);
    setName(null);
    setRole("student");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ token, userId, email, name, role, initialized, login, logout }),
    [token, userId, email, name, role, initialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
