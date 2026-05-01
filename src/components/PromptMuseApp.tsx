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
  Shield, 
  Cpu, 
  Layers,
  ChevronRight,
  Menu,
  X
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const favorites = prompts.filter(p => p.isFavorite);

  return (
    <div className="min-h-screen selection:bg-primary/30 selection:text-white">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-background/80 backdrop-blur-md border-white/5 py-4" : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2 bg-primary rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">PromptMuse</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo(workspaceRef)} className="hover:text-white transition-colors">Studio</button>
            <button onClick={() => scrollTo(galleryRef)} className="hover:text-white transition-colors">Gallery</button>
            <div className="w-[1px] h-4 bg-white/10" />
            <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/10" onClick={() => scrollTo(workspaceRef)}>
              Try Now
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-white/5 p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <button onClick={() => scrollTo(workspaceRef)} className="block w-full text-left py-2 font-medium">Studio</button>
            <button onClick={() => scrollTo(galleryRef)} className="block w-full text-left py-2 font-medium">Gallery</button>
            <Button className="w-full rounded-xl" onClick={() => scrollTo(workspaceRef)}>Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in-up">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase opacity-70">Powered by Gemini Pro Vision</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Elevate Your <br />
            <span className="text-gradient">Generative Vision.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            PromptMuse uses advanced neural reasoning to expand your simplest ideas into professional-grade AI prompts for Midjourney, DALL-E, and Runway.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" onClick={() => scrollTo(workspaceRef)} className="h-14 px-10 text-lg font-bold rounded-full gap-2 shadow-2xl bg-primary hover:bg-primary/90 transition-all hover:scale-105">
              Launch Studio <Wand2 className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-medium rounded-full gap-2 group">
              View Examples <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {[
            { label: 'Prompts Crafted', value: '1.2M+' },
            { label: 'Avg. Accuracy', value: '99.4%' },
            { label: 'Styles Supported', value: '150+' },
            { label: 'Active Muses', value: '45k' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 glass-card rounded-3xl group hover:border-primary/20 transition-all">
              <div className="text-3xl font-black mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Engineered for Perfection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Why prompt engineers choose PromptMuse for their creative pipelines.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Cpu className="h-6 w-6" />, 
                title: "Neural Expansion", 
                desc: "Our engine understands context, lighting, and composition better than generic LLMs." 
              },
              { 
                icon: <Shield className="h-6 w-6" />, 
                title: "Safety First", 
                desc: "Built-in filters ensure your prompts comply with major AI platform guidelines." 
              },
              { 
                icon: <Layers className="h-6 w-6" />, 
                title: "Multi-Model Optimized", 
                desc: "Specific formatting for Stable Diffusion, Midjourney, and DALL-E 3." 
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 glass-card rounded-[2.5rem] space-y-4 hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-32">
        <section ref={workspaceRef} className="scroll-mt-24">
          <div className="glass-card p-8 md:p-16 rounded-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none rotate-12">
              <Wand2 className="h-64 w-64 text-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-primary/10 rounded-3xl">
                  <PlusCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight">Studio</h2>
                  <p className="text-muted-foreground">Describe your vision, we'll do the engineering.</p>
                </div>
              </div>
              
              <PromptForm onGenerated={(entry) => {
                addPrompt(entry);
                scrollTo(galleryRef);
              }} />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section ref={galleryRef} className="scroll-mt-24 space-y-12">
          <Tabs defaultValue="history" className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-accent/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent">Gallery</div>
                <h2 className="text-5xl font-black tracking-tighter">Your Creative Vault</h2>
                <p className="text-muted-foreground max-w-md">Every masterpiece starts as a spark. Revisit, refine, and reuse your best creations.</p>
              </div>
              
              <div className="flex items-center gap-4 p-2 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-sm self-start md:self-auto">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger value="history" className="gap-2 rounded-full px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <History className="h-4 w-4" /> History
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2 rounded-full px-8 h-10 data-[state=active]:bg-accent data-[state=active]:text-white">
                    <Heart className="h-4 w-4" /> Favorites
                  </TabsTrigger>
                </TabsList>
                
                <div className="w-[1px] h-8 bg-white/10 mx-2" />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                  onClick={clearAllPrompts}
                  title="Clear All History"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <TabsContent value="history" className="animate-in fade-in duration-500">
              {isLoaded && prompts.length > 0 ? (
                <div className="grid gap-8">
                  {prompts.map((p) => (
                    <PromptCard 
                      key={p.id} 
                      prompt={p} 
                      onUpdate={updatePrompt}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deletePrompt}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 glass-card rounded-[3rem] border-dashed border-2 border-white/10">
                  <History className="h-20 w-20 mx-auto mb-6 text-muted-foreground/20" />
                  <h3 className="text-2xl font-bold">History is Empty</h3>
                  <p className="text-muted-foreground">The studio is waiting for your first idea.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="animate-in fade-in duration-500">
              {isLoaded && favorites.length > 0 ? (
                <div className="grid gap-8">
                  {favorites.map((p) => (
                    <PromptCard 
                      key={p.id} 
                      prompt={p} 
                      onUpdate={updatePrompt}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deletePrompt}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 glass-card rounded-[3rem] border-dashed border-2 border-white/10">
                  <Heart className="h-20 w-20 mx-auto mb-6 text-muted-foreground/20" />
                  <h3 className="text-2xl font-bold">No Favorites Yet</h3>
                  <p className="text-muted-foreground">Tap the heart on any prompt to save it here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-40 border-t border-white/5 bg-black/40 backdrop-blur-3xl pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-3xl font-black tracking-tighter">PromptMuse</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Leading the revolution in generative engineering. PromptMuse empowers artists and engineers to bridge the gap between imagination and AI.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Studio</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Gallery</li>
              <li className="hover:text-primary cursor-pointer transition-colors">API Docs</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white">Connect</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Discord</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-primary cursor-pointer transition-colors">GitHub</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO &bull; BUILT FOR THE FUTURE
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Legal</span>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}