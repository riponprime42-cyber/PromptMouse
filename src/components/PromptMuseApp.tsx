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
  LayoutDashboard
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
      setScrolled(window.scrollY > 100);
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
    <div className="min-h-screen selection:bg-primary/30">
      {/* Dynamic Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/40 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PromptMuse</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <button onClick={() => scrollTo(workspaceRef)} className="text-muted-foreground hover:text-white transition-colors">Studio</button>
            <button onClick={() => scrollTo(galleryRef)} className="text-muted-foreground hover:text-white transition-colors">Vault</button>
            <Button 
              onClick={() => scrollTo(workspaceRef)}
              className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-bold"
            >
              Get Started
            </Button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero: The Entrance */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary/10 blur-[160px] rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-4xl animate-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Next-Gen Prompt Engineering</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-8">
            Imagine. <br />
            <span className="text-primary text-glow">Engineer.</span> Create.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-12">
            The bridge between a vague thought and a visual masterpiece. PromptMuse refines your concepts into professional AI input.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button 
              size="lg" 
              onClick={() => scrollTo(workspaceRef)} 
              className="h-14 px-10 text-lg font-bold rounded-2xl gap-2 bg-primary hover:bg-primary/90 shadow-2xl transition-transform hover:scale-105"
            >
              Enter Studio <Wand2 className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-medium rounded-2xl gap-2 hover:bg-white/5 transition-all">
              Discover Features <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center gap-2 cursor-pointer" onClick={() => scrollTo(workspaceRef)}>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Scroll to Explore</span>
          <ChevronDown className="h-5 w-5 opacity-30" />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          {[
            { 
              icon: <Compass className="h-6 w-6" />, 
              title: "Conceptual Expansion", 
              desc: "We don't just add words; we build context, atmosphere, and technical specifications." 
            },
            { 
              icon: <Cpu className="h-6 w-6" />, 
              title: "Neural Tuning", 
              desc: "Optimized for the latest models including Gemini 2.0, Midjourney v6, and Runway Gen-3." 
            },
            { 
              icon: <Layers className="h-6 w-6" />, 
              title: "Artistic Context", 
              desc: "Deep knowledge of lighting, camera angles, and historical art styles at your fingertips." 
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-6 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 mx-auto md:mx-0">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Dashboard / Workspace */}
      <main className="max-w-6xl mx-auto px-6 py-32 space-y-40">
        <section ref={workspaceRef} className="scroll-mt-32">
          <div className="glass-panel p-8 md:p-16 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <LayoutDashboard className="h-80 w-80 text-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="space-y-3">
                  <div className="w-12 h-1 bg-primary rounded-full mb-6" />
                  <h2 className="text-5xl font-black tracking-tighter">Studio Console</h2>
                  <p className="text-muted-foreground text-lg">Translate your imagination into structured prompts.</p>
                </div>
              </div>
              
              <PromptForm onGenerated={(entry) => {
                addPrompt(entry);
                scrollTo(galleryRef);
              }} />
            </div>
          </div>
        </section>

        {/* Gallery / Vault */}
        <section ref={galleryRef} className="scroll-mt-32 space-y-16">
          <Tabs defaultValue="history" className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <History className="h-6 w-6 text-primary" />
                  <h2 className="text-4xl font-bold tracking-tight">The Creative Vault</h2>
                </div>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Your curated collection of engineered prompts. Every idea is preserved here.
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5 self-start lg:self-auto">
                <TabsList className="bg-transparent h-11">
                  <TabsTrigger value="history" className="gap-2 rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    History
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2 rounded-xl px-6 data-[state=active]:bg-accent data-[state=active]:text-white transition-all">
                    Favorites
                  </TabsTrigger>
                </TabsList>
                
                <div className="w-[1px] h-6 bg-white/10" />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={clearAllPrompts}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <TabsContent value="history" className="grid gap-8 animate-reveal">
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
                <EmptyState icon={<History className="h-16 w-16" />} title="No History Yet" desc="Generate your first prompt to begin your collection." />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="grid gap-8 animate-reveal">
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
                <EmptyState icon={<Heart className="h-16 w-16" />} title="No Favorites" desc="Star your best prompts to keep them accessible here." />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 flex items-center justify-center rounded-lg">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">PromptMuse</span>
          </div>
          
          <div className="flex gap-12 text-sm text-muted-foreground font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>

          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="text-center py-32 glass-panel rounded-[2rem] border-dashed border-2 border-white/5">
      <div className="mb-6 opacity-10 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}