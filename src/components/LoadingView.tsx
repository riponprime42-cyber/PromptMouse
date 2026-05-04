
"use client";

import React from 'react';
import { BrandLogo } from './BrandLogo';

export function LoadingView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <BrandLogo className="w-24 h-24 animate-spin" style={{ animationDuration: '10s' }} glow={true} />
        </div>
        
        <div className="space-y-4 text-center animate-reveal">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-primary text-glow">
              Initializing Neural Studio
            </h2>
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 animate-pulse">
            made by ALVISONGS
          </p>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
          <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Registry Synchronization Active</span>
        </div>
      </div>
    </div>
  );
}
