import { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy guest user object
const guestUser: User = {
  id: "guest",
  email: "guest@example.com",
  name: "Guest"
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Guest mode: always authenticated with dummy user
  const login = async (email: string, password: string) => {
    // No-op: do nothing
  };

  const register = async (email: string, password: string, name: string) => {
    // No-op: do nothing
  };

  const logout = () => {
    // No-op: do nothing
  };

  return (
    <AuthContext.Provider
      value={{
        user: guestUser,
        token: null,
        login,
        register,
        logout,
        isAuthenticated: true,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}