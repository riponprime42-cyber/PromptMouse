
"use client";

import { useState, useEffect } from 'react';
import { PromptEntry } from '@/lib/types';

const STORAGE_KEY = 'promptmuse_prompts';

export function usePromptsStore() {
  const [prompts, setPrompts] = useState<PromptEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPrompts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved prompts");
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }
  }, [prompts, isLoaded]);

  const addPrompt = (entry: PromptEntry) => {
    setPrompts(prev => [entry, ...prev]);
  };

  const updatePrompt = (id: string, text: string) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, text } : p));
  };

  const toggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const clearAllPrompts = () => {
    if (window.confirm("Are you sure you want to clear all your history? This cannot be undone.")) {
      setPrompts([]);
    }
  };

  return {
    prompts,
    addPrompt,
    updatePrompt,
    toggleFavorite,
    deletePrompt,
    clearAllPrompts,
    isLoaded,
  };
}
