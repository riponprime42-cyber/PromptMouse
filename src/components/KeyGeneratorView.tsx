
"use client";

import React, { useState } from 'react';
import { Key, ArrowLeft, Loader2, Plus, Copy, Check, ShieldCheck, Stars, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInvite } from '@/hooks/use-invite-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface KeyGeneratorViewProps {
  onBack: () => void;
  onGoHome: () => void;
}

export function KeyGeneratorView({ onBack, onGoHome }: KeyGeneratorViewProps) {
  const { generateNewCode, logout } = useInvite();
  const { toast } = useToast();
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setCopied(false);
    
    // Aesthetic delay for neural synthesis feel
    setTimeout(() => {
      const code = generateNewCode();
      setGeneratedKey(code);
      setIsLoading(false);
      toast({
        title: "Key Generated",
        description: "A new neural access key has been registered.",
      });
    }, 800);
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Neural Key Copied" });
    }
  };

  const handleCopyAndGoHome = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast({ title: "Key Copied & Logged Out", description: "Test your key on the landing page." });
      logout();
      onGoHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden animate-reveal">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="rounded-full gap-2 text-white/40 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Studio
        </Button>
        <Button 
          variant="ghost" 
          onClick={onGoHome} 
          className="rounded-full gap-2 text-white/40 hover:text-white"
        >
          <Home className="h-4 w-4" /> Go Home
        </Button>
      </div>

      <div className="w-full max-w-2xl space-y-12 relative z-10">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 text-primary mb-2 shadow-2xl">
            <Key className="h-10 w-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Key Vault.</h1>
          <p className="text-white/40 text-lg font-light uppercase tracking-[0.4em]">
            Authorize new peers into the Neural Network
          </p>
        </header>

        <Card className="studio-console p-1 border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.1)]">
          <CardContent className="p-12 md:p-16 space-y-12">
            {!generatedKey ? (
              <div className="text-center space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">
                    Generating a key registers a new unique entry in the global neural signature database.
                  </p>
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading}
                  className="w-full h-20 rounded-3xl bg-primary hover:bg-primary/90 font-black text-xl gap-4 shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <>Generate Neural Key <Plus className="h-6 w-6" /></>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-12 animate-reveal">
                <div className="space-y-4 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Key Initialized</span>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-center">
                      <span className="text-5xl md:text-7xl font-black tracking-[0.25em] text-white">
                        {generatedKey}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={handleCopy}
                      className={cn(
                        "h-16 rounded-2xl font-black text-lg gap-3 transition-all",
                        copied ? "bg-accent hover:bg-accent/90" : "bg-white text-black hover:bg-white/90"
                      )}
                    >
                      {copied ? <><Check className="h-6 w-6" /> Key Copied</> : <><Copy className="h-6 w-6" /> Copy Key</>}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="h-16 rounded-2xl border-white/10 hover:bg-white/5 font-bold text-lg text-white"
                    >
                      Generate Another
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleCopyAndGoHome}
                    className="h-16 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 font-black text-lg gap-3 text-white/80"
                  >
                    <LogOut className="h-6 w-6" /> Copy & Go Home to Test
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                  <Stars className="h-3 w-3" /> Encrypted Protocol Active
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center">
          <p className="text-[10px] text-white/10 uppercase tracking-[0.5em] leading-relaxed">
            Neural security active &bull; All generations logged to the registry
          </p>
        </footer>
      </div>
    </div>
  );
}
