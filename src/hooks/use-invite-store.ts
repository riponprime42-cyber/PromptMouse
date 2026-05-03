
"use client";

import { useState, useEffect } from 'react';

const CODES_STORAGE_KEY = 'promptmuse_valid_codes';
const SESSION_STORAGE_KEY = 'promptmuse_is_authorized';

export function useInviteStore() {
  const [validCodes, setValidCodes] = useState<string[]>(['MUSE-2025']); // Default master code
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCodes = localStorage.getItem(CODES_STORAGE_KEY);
    const sessionAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedCodes) {
      setValidCodes(JSON.parse(savedCodes));
    }
    if (sessionAuth === 'true') {
      setIsAuthorized(true);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(validCodes));
    }
  }, [validCodes, isLoaded]);

  const validateCode = (code: string) => {
    if (validCodes.includes(code.toUpperCase())) {
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

  return {
    isAuthorized,
    validateCode,
    generateNewCode,
    logout,
    isLoaded
  };
}
