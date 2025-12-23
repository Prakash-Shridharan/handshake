import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'agent' | 'contractor';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
}

interface AuthContextType {
  user: MockUser | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const mockUsers: Record<UserRole, MockUser> = {
  agent: {
    id: 'agent-001',
    name: 'Sarah Mitchell',
    email: 'sarah@premierproperties.com',
    role: 'agent',
    companyName: 'Premier Properties',
  },
  contractor: {
    id: 'contractor-001',
    name: 'Mike Rodriguez',
    email: 'mike@quickfixpro.com',
    role: 'contractor',
    companyName: 'QuickFix Pro Services',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = useCallback((role: UserRole) => {
    setUser(mockUsers[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
