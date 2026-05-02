
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
  ArrowLeft, 
  Stars, 
  LogOut,
  User,
  LogIn
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PromptForm } from './PromptForm';
import { PromptCard } from './PromptCard';
import { usePromptsStore } from '@/hooks/use-prompts-store';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { AuthView } from './AuthView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PromptMuseApp() {
  const { user } = useUser();
  const auth = useAuth();
  const { 
    prompts, 
    addPrompt, 
    updatePrompt, 
    toggleFavorite, 
    deletePrompt, 
    clearAllPrompts,
    isLoaded 
  } = usePromptsStore();

  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<'landing' | 'studio' | 'auth'>('landing');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openStudio = () => {
    if (!user) {
      setView('auth');
    } else {
      setView('studio');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeStudio = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    setView('landing');
  };

  const favorites = prompts.filter(p => p.isFavorite);

  if (view === 'auth') {
    return <AuthView onBack={() => setView('landing')} onSuccess={() => setView('studio')} />;
  }

  if (view === 'studio' && user) {
    return (
      <div className="min-h-screen bg-background selection:bg-primary/30 font-body animate-reveal">
        {/* Studio Navbar */}
        <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl py-4 border-b border-white/5 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={closeStudio}>
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">PromptMuse Studio</span>
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border-white/10" align="end">
                  <DropdownMenuItem className="focus:bg-primary/10 gap-2 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" onClick={closeStudio} className="rounded-full gap-2 text-white/60 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Exit Studio
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-8 py-20 space-y-32">
          {/* Studio Workspace */}
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

          {/* Vault */}
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
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 font-body">
      {/* Landing Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled ? "bg-background/60 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-11 h-11 bg-primary flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:rotate-12 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">PromptMuse</span>
          </div>

          <div className="hidden md:flex items-center gap-12 text-sm font-bold uppercase tracking-widest">
            <button className="text-white/40 hover:text-white transition-colors">Features</button>
            <button className="text-white/40 hover:text-white transition-colors">Showcase</button>
            {user ? (
               <Button onClick={openStudio} className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-black h-12 shadow-2xl">
                Studio
               </Button>
            ) : (
              <Button onClick={() => setView('auth')} className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-black h-12 shadow-2xl gap-2">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
            <Button size="lg" onClick={openStudio} className="h-16 px-12 text-xl font-black rounded-3xl gap-3 bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105">
              Launch Studio <ArrowRight className="h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold rounded-3xl border-white/10 hover:bg-white/5">
              View Showcase
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-40 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          {[
            { icon: <Cpu className="h-full w-full" />, title: "Neural Synthesis", desc: "Advanced algorithms tailored for the latest Gemini and Midjourney models." },
            { icon: <Layers className="h-full w-full" />, title: "Precision Control", desc: "Fine-tune medium, style, mood, and aspect ratio with scientific accuracy." },
            { icon: <Box className="h-full w-full" />, title: "Artifact Vault", desc: "Securely archive and iterate on your best creative engineering results." }
          ].map((feature, i) => (
            <div key={i} className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform p-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed text-lg font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-8">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-20 text-center border border-primary/10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">Ready to Begin?</h2>
          <p className="text-white/40 text-xl font-light mb-12 max-w-xl mx-auto">
            Join thousands of visual engineers crafting the future of digital art.
          </p>
          <Button onClick={openStudio} className="h-16 px-12 text-xl font-black rounded-3xl bg-white text-black hover:bg-white/90">
            Open The Studio
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO &bull; BUILT FOR CREATORS
        </p>
      </footer>
      <Toaster />
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

function Cpu(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )
}

function Layers(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91a1 1 0 0 0 0-1.83Z" />
      <path d="m2.6 12.08 8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91" />
      <path d="m2.6 17.08 8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91" />
    </svg>
  )
}

function Box(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
