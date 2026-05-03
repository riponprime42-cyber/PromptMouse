
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CODES_STORAGE_KEY = 'promptmuse_valid_codes';
const SESSION_STORAGE_KEY = 'promptmuse_is_authorized';

interface InviteContextType {
  isAuthorized: boolean;
  validCodes: string[];
  validateCode: (code: string) => boolean;
  generateNewCode: () => string;
  logout: () => void;
  isLoaded: boolean;
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export function InviteProvider({ children }: { children: React.ReactNode }) {
  const [validCodes, setValidCodes] = useState<string[]>(['MUSE-2025']);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load
  useEffect(() => {
    const savedCodes = localStorage.getItem(CODES_STORAGE_KEY);
    const sessionAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedCodes) {
      try {
        const parsed = JSON.parse(savedCodes);
        if (Array.isArray(parsed)) {
          // Merge with default code if not present
          const merged = Array.from(new Set(['MUSE-2025', ...parsed]));
          setValidCodes(merged);
        }
      } catch (e) {
        console.error("Failed to load codes from storage");
      }
    }
    
    if (sessionAuth === 'true') {
      setIsAuthorized(true);
    }
    setIsLoaded(true);
  }, []);

  // Sync state to local storage whenever validCodes changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(validCodes));
    }
  }, [validCodes, isLoaded]);

  // Listen for storage changes from other tabs/instances
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CODES_STORAGE_KEY && e.newValue) {
        setValidCodes(JSON.parse(e.newValue));
      }
      if (e.key === SESSION_STORAGE_KEY) {
        setIsAuthorized(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const validateCode = (code: string) => {
    if (code.toUpperCase() === 'MUSE-2025' || validCodes.includes(code.toUpperCase())) {
      setIsAuthorized(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const generateNewCode = () => {
    const newCode = `MUSE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setValidCodes(prev => [...prev, newCode]);
    return newCode;
  };

  const logout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <InviteContext.Provider value={{
      isAuthorized,
      validCodes,
      validateCode,
      generateNewCode,
      logout,
      isLoaded
    }}>
      {children}
    </InviteContext.Provider>
  );
}

export function useInvite() {
  const context = useContext(InviteContext);
  if (context === undefined) {
    throw new Error('useInvite must be used within an InviteProvider');
  }
  return context;
}
