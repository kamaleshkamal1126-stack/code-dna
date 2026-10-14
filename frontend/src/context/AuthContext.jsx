import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('codedna_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const data = await api.auth.me();
        setUser(data.user);
        setIsGuest(data.is_guest);
      } catch (err) {
        // Fallback guest session
        setUser({ id: 1, username: 'guest_coder', email: 'guest@codedna.local' });
        setIsGuest(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadCurrentUser();
  }, [token]);

  const login = async (identifier, password) => {
    const data = await api.auth.login(identifier, password);
    localStorage.setItem('codedna_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
    setIsAuthModalOpen(false);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await api.auth.register(username, email, password);
    localStorage.setItem('codedna_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
    setIsAuthModalOpen(false);
    return data;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('codedna_token');
    setToken(null);
    setUser({ id: 1, username: 'guest_coder', email: 'guest@codedna.local' });
    setIsGuest(true);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        token,
        isLoading,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
