"use client";

import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  History, 
  Heart, 
  PlusCircle, 
  Trash2, 
  ArrowRight, 
  Wand2, 
  Zap, 
  Compass, 
  Cpu, 
  Layers,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Box,
  CircleDot
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PromptForm } from './PromptForm';
import { PromptCard } from './PromptCard';
import { usePromptsStore } from '@/hooks/use-prompts-store';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export function PromptMuseApp() {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const favorites = prompts.filter(p => p.isFavorite);

  return (
    <div className="min-h-screen selection:bg-primary/30 font-body">
      {/* Premium Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled ? "bg-background/60 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 bg-primary flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">PromptMuse</span>
          </div>

          <div className="hidden md:flex items-center gap-12 text-sm font-semibold tracking-wide">
            <button onClick={() => scrollTo(workspaceRef)} className="text-white/60 hover:text-white transition-colors uppercase">Studio</button>
            <button onClick={() => scrollTo(galleryRef)} className="text-white/60 hover:text-white transition-colors uppercase">Vault</button>
            <Button 
              onClick={() => scrollTo(workspaceRef)}
              className="rounded-full px-10 bg-primary text-white hover:bg-primary/90 font-bold h-12 shadow-lg shadow-primary/20"
            >
              Start Generating
            </Button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[700px] bg-primary/5 blur-[180px] rounded-full floating" />
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-5xl animate-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Intelligence for Creators</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10">
            Design The <br />
            <span className="text-primary text-glow italic">Invisible.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto font-light leading-relaxed mb-16">
            PromptMuse turns your abstract thoughts into structured visual blueprints. Professional AI engineering for the next generation of imagery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              onClick={() => scrollTo(workspaceRef)} 
              className="h-16 px-12 text-lg font-black rounded-3xl gap-3 bg-white text-black hover:bg-white/90 shadow-2xl transition-all hover:scale-105"
            >
              Enter The Studio <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-12 text-lg font-bold rounded-3xl gap-3 border-white/10 hover:bg-white/5 transition-all"
            >
              View Gallery <Compass className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 cursor-pointer transition-opacity hover:opacity-100" onClick={() => scrollTo(workspaceRef)}>
          <span className="text-[10px] uppercase tracking-[0.5em] font-black">Scroll to Begin</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Feature Narrative */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-24">
          {[
            { 
              icon: <Box className="h-7 w-7" />, 
              title: "Volume Controls", 
              desc: "Fine-tune every aspect of your vision, from cinematic lighting to camera lenses." 
            },
            { 
              icon: <Cpu className="h-7 w-7" />, 
              title: "Model Optimized", 
              desc: "Synthesized specifically for Gemini 2.0, Midjourney v6.1, and Runway Gen-3 Alpha." 
            },
            { 
              icon: <Layers className="h-7 w-7" />, 
              title: "Artifact Preservation", 
              desc: "Every generated prompt is stored in your private vault for future iterations." 
            }
          ].map((feature, i) => (
            <div key={i} className="group relative">
              <div className="mb-8 w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-primary border border-white/10 transition-colors group-hover:bg-primary group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Studio: Refined as a separate "Space" */}
      <section ref={workspaceRef} className="scroll-mt-24 py-40 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto px-8">
          <div className="studio-console p-10 md:p-20 relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <CircleDot className="h-64 w-64 text-primary" />
            </div>
            
            <div className="relative z-10">
              <header className="mb-16">
                <div className="flex items-center gap-3 mb-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                  <Wand2 className="h-4 w-4" /> Studio Console v2.0
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Forge Your Prompt.</h2>
                <p className="text-white/40 text-xl font-light">Enter your core concept and watch the Muse expand it into a masterpiece.</p>
              </header>
              
              <div className="max-w-4xl">
                <PromptForm onGenerated={(entry) => {
                  addPrompt(entry);
                  setTimeout(() => scrollTo(galleryRef), 500);
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vault / Gallery */}
      <section ref={galleryRef} className="scroll-mt-24 py-40 px-8 max-w-6xl mx-auto space-y-24">
        <Tabs defaultValue="history" className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <History className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter">The Vault</h2>
              </div>
              <p className="text-white/50 text-xl font-light max-w-xl">
                Your archive of refined creative engineering. Ready for deployment.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/5 self-start lg:self-auto">
              <TabsList className="bg-transparent h-12 gap-2">
                <TabsTrigger value="history" className="rounded-2xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
                  Archive
                </TabsTrigger>
                <TabsTrigger value="favorites" className="rounded-2xl px-8 data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all">
                  Starred
                </TabsTrigger>
              </TabsList>
              
              <div className="w-[1px] h-8 bg-white/10" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-2xl"
                onClick={clearAllPrompts}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <TabsContent value="history" className="grid gap-10 animate-reveal">
            {isLoaded && prompts.length > 0 ? (
              prompts.map((p) => (
                <PromptCard 
                  key={p.id} 
                  prompt={p} 
                  onUpdate={updatePrompt}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deletePrompt}
                />
              ))
            ) : (
              <EmptyState icon={<History className="h-20 w-20" />} title="Archive Empty" desc="Initiate generation in the studio to begin your collection." />
            )}
          </TabsContent>

          <TabsContent value="favorites" className="grid gap-10 animate-reveal">
            {isLoaded && favorites.length > 0 ? (
              favorites.map((p) => (
                <PromptCard 
                  key={p.id} 
                  prompt={p} 
                  onUpdate={updatePrompt}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deletePrompt}
                />
              ))
            ) : (
              <EmptyState icon={<Heart className="h-20 w-20" />} title="No Starred Prompts" desc="Star your best creations to keep them accessible here." />
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-32 px-8 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-2xl font-black tracking-tight">PromptMuse</span>
            </div>
            <p className="text-white/40 max-w-xs font-light text-lg">
              Empowering the next generation of visual engineers with precise prompt synthesis.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-20 text-sm font-bold uppercase tracking-widest text-white/60">
            <div className="flex flex-col gap-6">
              <span className="text-white/20">Studio</span>
              <span className="hover:text-white cursor-pointer transition-colors">Generator</span>
              <span className="hover:text-white cursor-pointer transition-colors">Archive</span>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-white/20">Legal</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-white/20">Connect</span>
              <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
              <span className="hover:text-white cursor-pointer transition-colors">X</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
          <span>&copy; {new Date().getFullYear()} PROMPTMUSE STUDIO</span>
          <span>Built for Creators</span>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="text-center py-40 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
      <div className="mb-10 opacity-10 flex justify-center">{icon}</div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-white/40 text-lg font-light">{desc}</p>
    </div>
  );
}