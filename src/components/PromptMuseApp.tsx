"use client";

import React, { useRef } from 'react';
import { Sparkles, History, Heart, PlusCircle, Trash2, ArrowDownCircle, Wand2, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PromptForm } from './PromptForm';
import { PromptCard } from './PromptCard';
import { usePromptsStore } from '@/hooks/use-prompts-store';
import { Toaster } from '@/components/ui/toaster';

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

  const workspaceRef = useRef<HTMLDivElement>(null);
  const favorites = prompts.filter(p => p.isFavorite);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 blur-[150px] rounded-full animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-foreground/80 text-sm font-medium backdrop-blur-sm">
            <Zap className="h-4 w-4 text-accent" /> Powered by Gemini AI
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-tight">
            Design Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">Masterpiece.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            PromptMuse turns your rough ideas into cinematic, high-fidelity prompts for professional image and video AI generation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={scrollToWorkspace} className="h-14 px-8 text-lg font-bold rounded-2xl gap-2 shadow-[0_0_30px_rgba(140,71,209,0.4)] hover:scale-105 transition-all">
              <Wand2 className="h-5 w-5" /> Start Creating
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-8 text-lg font-medium rounded-2xl gap-2 hover:bg-white/5">
              Explore Gallery <ArrowDownCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ArrowDownCircle className="h-8 w-8" />
        </div>
      </section>

      {/* Main Workspace */}
      <div ref={workspaceRef} className="max-w-5xl mx-auto px-4 py-24 space-y-24">
        <section className="relative">
          <div className="absolute -top-24 left-0 text-[10rem] font-black text-white/[0.02] select-none pointer-events-none uppercase">
            Create
          </div>
          <div className="glass-panel p-8 md:p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <PlusCircle className="h-48 w-48" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Prompt Studio</h2>
            </div>
            <PromptForm onGenerated={(entry) => {
              addPrompt(entry);
              // Small delay to ensure the DOM is ready if we want to scroll to it
            }} />
          </div>
        </section>

        <section className="space-y-8 relative">
          <div className="absolute -top-24 right-0 text-[10rem] font-black text-white/[0.02] select-none pointer-events-none uppercase text-right">
            Vault
          </div>
          
          <Tabs defaultValue="history" className="w-full">
            <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight">Your Gallery</h2>
                <p className="text-muted-foreground">Manage and revisit your AI inspirations.</p>
              </div>
              
              <div className="flex items-center gap-3 p-1.5 bg-card/40 border border-white/5 rounded-2xl backdrop-blur-sm">
                <TabsList className="bg-transparent border-0 h-10">
                  <TabsTrigger value="history" className="gap-2 rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:shadow-lg">
                    <History className="h-4 w-4" /> History
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2 rounded-xl px-6 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg">
                    <Heart className="h-4 w-4" /> Favorites
                  </TabsTrigger>
                </TabsList>
                
                <div className="w-[1px] h-6 bg-white/10 mx-1" />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={clearAllPrompts}
                  title="Clear All History"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <TabsContent value="history" className="space-y-6 outline-none">
              {isLoaded && prompts.length > 0 ? (
                <div className="grid gap-6">
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
                <div className="text-center py-32 glass-panel rounded-[2rem] opacity-40 border-dashed border-2 border-white/5">
                  <History className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
                  <h3 className="text-xl font-medium mb-2">History is Empty</h3>
                  <p>Your creative sparks will appear here once you generate them.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6 outline-none">
              {isLoaded && favorites.length > 0 ? (
                <div className="grid gap-6">
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
                <div className="text-center py-32 glass-panel rounded-[2rem] opacity-40 border-dashed border-2 border-white/5">
                  <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
                  <h3 className="text-xl font-medium mb-2">No Favorites Yet</h3>
                  <p>Tap the heart icon on any prompt to save it here for quick access.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-16 text-center border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold tracking-tighter">PromptMuse</span>
          </div>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Empowering the next generation of digital artists with precision AI prompts.
            Crafted for visionaries who refuse to settle for ordinary.
          </p>
          <div className="pt-8 text-xs text-muted-foreground/60 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO &bull; ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}
