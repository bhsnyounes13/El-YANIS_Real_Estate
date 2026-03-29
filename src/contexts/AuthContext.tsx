import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      if (session.expiresAt > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_session');
      }
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !admin) {
        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      const passwordMatch = password === admin.password_hash;

      if (!passwordMatch) {
        return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
      }

      await supabase
        .from('admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      const session = {
        adminId: admin.id,
        username: admin.username,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };

      localStorage.setItem('admin_session', JSON.stringify(session));
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
