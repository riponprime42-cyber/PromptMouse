
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  glow?: boolean;
}

export function BrandLogo({ className, glow = true }: BrandLogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {glow && (
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#brand-grad)" 
          strokeWidth="1.5" 
          strokeDasharray="8 4" 
          className="animate-spin" 
          style={{ animationDuration: '15s' }} 
        />
        
        {/* Inner Orbits */}
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          stroke="white" 
          strokeWidth="0.5" 
          strokeOpacity="0.2" 
        />
        
        {/* Central Neural Core */}
        <path
          d="M50 15L56 44L85 50L56 56L50 85L44 56L15 50L44 44L50 15Z"
          fill="url(#brand-grad)"
          filter="url(#glow)"
          className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />
        
        {/* Nucleus */}
        <circle cx="50" cy="50" r="6" fill="white" className="animate-pulse" />
        
        {/* Connection Dots */}
        <circle cx="50" cy="15" r="2" fill="url(#brand-grad)" />
        <circle cx="85" cy="50" r="2" fill="url(#brand-grad)" />
        <circle cx="50" cy="85" r="2" fill="url(#brand-grad)" />
        <circle cx="15" cy="50" r="2" fill="url(#brand-grad)" />
      </svg>
    </div>
  );
}
