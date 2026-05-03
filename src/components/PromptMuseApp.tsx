
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  History, 
  Heart, 
  Trash2, 
  ArrowRight, 
  Wand2, 
  CircleDot, 
  Stars,
  Cpu,
  Layers,
  Box,
  Key,
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PromptForm } from './PromptForm';
import { PromptCard } from './PromptCard';
import { InviteView } from './InviteView';
import { KeyGeneratorView } from './KeyGeneratorView';
import { BrandLogo } from './BrandLogo';
import { usePromptsStore } from '@/hooks/use-prompts-store';
import { useInvite } from '@/hooks/use-invite-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function PromptMuseApp() {
  const { 
    prompts, 
    addPrompt, 
    updatePrompt, 
    toggleFavorite, 
    deletePrompt, 
    clearAllPrompts
  } = usePromptsStore();

  const {
    isAuthorized,
    validateCode,
    logout
  } = useInvite();

  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<'landing' | 'invite' | 'studio' | 'generator'>('landing');
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if ((view === 'studio' || view === 'generator') && !isAuthorized) {
      setView('landing');
    }
  }, [isAuthorized, view]);

  const openStudioTrigger = () => {
    if (isAuthorized) {
      setView('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('invite');
    }
  };

  const closeStudio = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setView('landing');
    toast({ title: "Logged Out", description: "Your neural session has ended." });
  };

  const handleInviteSuccess = (code: string) => {
    const success = validateCode(code);
    if (success) {
      setView('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const favorites = prompts.filter(p => p.isFavorite);

  if (view === 'invite') {
    return <InviteView onBack={() => setView('landing')} onSuccess={handleInviteSuccess} />;
  }

  if (view === 'generator') {
    return <KeyGeneratorView onBack={() => setView('studio')} onGoHome={closeStudio} />;
  }

  if (view === 'studio') {
    return (
      <div className="min-h-screen bg-background selection:bg-primary/30 font-body animate-reveal">
        <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl py-4 border-b border-white/5 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={closeStudio}>
              <BrandLogo className="w-10 h-10" glow={false} />
              <span className="text-xl font-black tracking-tight">PromptMuse Studio</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setView('generator')}
                className="rounded-full gap-2 border-white/10 bg-white/5 hover:bg-white/10 font-bold"
              >
                <Key className="h-4 w-4 text-primary" /> Generate Key
              </Button>

              <div className="w-[1px] h-6 bg-white/10" />

              <Button variant="ghost" onClick={handleLogout} className="rounded-full gap-2 text-white/40 hover:text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-8 py-20 space-y-32">
          <section className="studio-console p-10 md:p-16 relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <CircleDot className="h-48 w-48 text-primary" />
            </div>
            <div className="relative z-10">
              <header className="mb-12">
                <div className="flex items-center gap-2 mb-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                  <Wand2 className="h-4 w-4" /> Neural Engine Active
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Forge Masterpiece.</h2>
                <p className="text-white/40 text-lg font-light">Synthesize high-fidelity prompts for any creative vision.</p>
              </header>
              <div className="max-w-4xl">
                <PromptForm onGenerated={(entry) => addPrompt(entry)} />
              </div>
            </div>
          </section>

          <section className="space-y-16 pb-20">
            <Tabs defaultValue="history" className="w-full">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                    <History className="h-8 w-8 text-accent" /> The Vault
                  </h2>
                  <p className="text-white/40 text-lg font-light">Your archive of refined creative engineering.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                  <TabsList className="bg-transparent h-10 gap-1">
                    <TabsTrigger value="history" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all text-xs">
                      Archive
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="rounded-xl px-6 data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">
                      Starred
                    </TabsTrigger>
                  </TabsList>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-destructive rounded-xl" onClick={clearAllPrompts}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="history" className="grid gap-8 animate-reveal">
                {prompts.length > 0 ? (
                  prompts.map((p) => (
                    <PromptCard key={p.id} prompt={p} onUpdate={updatePrompt} onToggleFavorite={toggleFavorite} onDelete={deletePrompt} />
                  ))
                ) : (
                  <EmptyState icon={<History className="h-16 w-16" />} title="Vault Empty" desc="Synthesize your first prompt to see it here." />
                )}
              </TabsContent>

              <TabsContent value="favorites" className="grid gap-8 animate-reveal">
                {favorites.length > 0 ? (
                  favorites.map((p) => (
                    <PromptCard key={p.id} prompt={p} onUpdate={updatePrompt} onToggleFavorite={toggleFavorite} onDelete={deletePrompt} />
                  ))
                ) : (
                  <EmptyState icon={<Heart className="h-16 w-16" />} title="No Favorites" desc="Star your best prompts for quick access." />
                )}
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 font-body">
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled ? "bg-background/60 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group">
            <BrandLogo className="w-12 h-12 group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-2xl font-black tracking-tight">PromptMuse</span>
          </div>

          <div className="hidden md:flex items-center gap-12 text-sm font-bold uppercase tracking-widest">
            <button className="text-white/40 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>Features</button>
            <Button onClick={openStudioTrigger} className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-black h-12 shadow-2xl">
              Studio
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 max-w-4xl animate-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Stars className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Next-Gen Prompt Engineering</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-12">
            The Art Of <br />
            <span className="text-primary italic">Precision.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed mb-16">
            Unlock the true potential of AI models with structured, high-fidelity prompts designed for professional creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" onClick={openStudioTrigger} className="h-16 px-12 text-xl font-black rounded-3xl gap-3 bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105">
              Launch Studio <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-40 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          <FeatureCard 
            icon={<Cpu className="h-8 w-8" />} 
            title="Neural Synthesis" 
            desc="Advanced algorithms tailored for the latest Gemini and Midjourney models." 
          />
          <FeatureCard 
            icon={<Layers className="h-8 w-8" />} 
            title="Precision Control" 
            desc="Fine-tune medium, style, mood, and aspect ratio with scientific accuracy." 
          />
          <FeatureCard 
            icon={<Box className="h-8 w-8" />} 
            title="Artifact Vault" 
            desc="Securely archive and iterate on your best creative engineering results." 
          />
        </div>
      </section>

      <section className="py-40 px-8">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-20 text-center border border-primary/10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">Ready to Begin?</h2>
          <p className="text-white/40 text-xl font-light mb-12 max-w-xl mx-auto">
            Join thousands of visual engineers crafting the future of digital art.
          </p>
          <Button onClick={openStudioTrigger} className="h-16 px-12 text-xl font-black rounded-3xl bg-white text-black hover:bg-white/90">
            Open The Studio
          </Button>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO &bull; BUILT FOR CREATORS
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-white/40 leading-relaxed text-lg font-light">{desc}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
      <div className="mb-8 opacity-10 flex justify-center">{icon}</div>
      <h3 className="text-xl font-black mb-2 tracking-tight">{title}</h3>
      <p className="text-white/30 font-light">{desc}</p>
    </div>
  );
}
