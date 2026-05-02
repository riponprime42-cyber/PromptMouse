
"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { PromptEntry } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function usePromptsStore() {
  const { user } = useUser();
  const db = useFirestore();

  const promptsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'prompts'),
      orderBy('timestamp', 'desc')
    );
  }, [db, user]);

  const { data: prompts = [], loading: isLoaded } = useCollection<PromptEntry>(promptsQuery);

  const addPrompt = (entry: PromptEntry) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'prompts', entry.id);
    setDoc(docRef, entry).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: entry
      }));
    });
  };

  const updatePrompt = (id: string, text: string) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'prompts', id);
    updateDoc(docRef, { text }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { text }
      }));
    });
  };

  const toggleFavorite = (id: string) => {
    if (!db || !user) return;
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;
    const docRef = doc(db, 'users', user.uid, 'prompts', id);
    updateDoc(docRef, { isFavorite: !prompt.isFavorite }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { isFavorite: !prompt.isFavorite }
      }));
    });
  };

  const deletePrompt = (id: string) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'prompts', id);
    deleteDoc(docRef).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    });
  };

  const clearAllPrompts = async () => {
    if (!db || !user) return;
    if (window.confirm("Are you sure you want to clear all your history? This cannot be undone.")) {
      const batch = writeBatch(db);
      prompts.forEach((p) => {
        const docRef = doc(db, 'users', user.uid, 'prompts', p.id);
        batch.delete(docRef);
      });
      batch.commit().catch(async (e) => {
         // Batch errors are handled generically
      });
    }
  };

  return {
    prompts,
    addPrompt,
    updatePrompt,
    toggleFavorite,
    deletePrompt,
    clearAllPrompts,
    isLoaded: !isLoaded, // Hook returns 'loading', we want 'isLoaded'
  };
}
