
"use client";

import React, { useState } from 'react';
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BrandLogo } from './BrandLogo';

interface InviteViewProps {
  onBack: () => void;
  onSuccess: (code: string) => boolean;
}

export function InviteView({ onBack, onSuccess }: InviteViewProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulate verification delay
    setTimeout(() => {
      const success = onSuccess(code);
      if (!success) {
        setError(true);
        toast({
          title: "Invalid Protocol",
          description: "This invite code does not exist in our neural registry.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="absolute top-8 left-8 rounded-full gap-2 text-white/40 hover:text-white z-10"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Landing
      </Button>

      <Card className="w-full max-w-md studio-console p-1 relative z-10">
        <CardContent className="p-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden mb-2">
              <BrandLogo className="w-16 h-16" glow={true} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Access Required.</h1>
            <p className="text-white/40 text-sm font-light uppercase tracking-widest">
              Enter your unique neural invite key
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  placeholder="MUSE-XXXXX" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`h-16 bg-white/[0.03] border-white/5 rounded-2xl px-6 text-center text-xl font-bold tracking-[0.2em] transition-all uppercase placeholder:opacity-20 ${error ? 'border-destructive text-destructive' : 'focus:border-primary/50'}`}
                  required
                />
                {error && (
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-destructive flex items-center justify-center gap-1 font-bold uppercase tracking-widest">
                    <AlertCircle className="h-3 w-3" /> Access Key Rejected
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3">Verify Protocol <ShieldCheck className="h-5 w-5" /></span>
                  )}
                </Button>

                <a 
                  href="https://t.me/ALVITEACH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 transition-all"
                >
                  <Send className="h-4 w-4 text-accent" /> I don't have an invite code
                </a>
              </div>
            </div>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium leading-relaxed">
              Neural encryption active &bull; Unauthorized access logged
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
