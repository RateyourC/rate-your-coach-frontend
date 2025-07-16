import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Reviewer {
  name: string;
  email: string;
  role: string;
  verified: boolean;
}

interface AuthContextType {
  reviewer: Reviewer | null;
  login: (r: Reviewer) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [reviewer, setReviewer] = useState<Reviewer | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reviewer");
    if (stored) setReviewer(JSON.parse(stored));
  }, []);

  const login = (r: Reviewer) => {
    localStorage.setItem("reviewer", JSON.stringify(r));
    setReviewer(r);
  };

  const logout = () => {
    localStorage.removeItem("reviewer");
    setReviewer(null);
  };

  return (
    <AuthContext.Provider value={{ reviewer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
