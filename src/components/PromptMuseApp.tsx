
"use client";

import React from 'react';
import { Sparkles, History, Heart, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    isLoaded 
  } = usePromptsStore();

  const favorites = prompts.filter(p => p.isFavorite);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 space-y-12">
      {/* Header */}
      <header className="text-center space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-2xl mb-2 border border-primary/20">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
          PromptMuse
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">
          Forge breathtaking prompts for your next AI masterpiece. 
          Where human imagination meets machine intelligence.
        </p>
      </header>

      {/* Main Content */}
      <div className="grid gap-12">
        <section className="glass-panel p-6 md:p-8 rounded-[2rem] relative overflow-hidden animate-fade-in-up [animation-delay:200ms]">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <PlusCircle className="h-32 w-32" />
          </div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <PlusCircle className="h-6 w-6 text-primary" /> Create New
          </h2>
          <PromptForm onGenerated={addPrompt} />
        </section>

        <section className="space-y-6 animate-fade-in-up [animation-delay:400ms]">
          <Tabs defaultValue="history" className="w-full">
            <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-4">
              <h2 className="text-2xl font-bold">Your Gallery</h2>
              <TabsList className="bg-card/50 border border-white/5 p-1">
                <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary">
                  <History className="h-4 w-4" /> History
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Heart className="h-4 w-4" /> Favorites
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="history" className="space-y-6 mt-0">
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
                <div className="text-center py-20 glass-panel rounded-3xl opacity-50 border-dashed border-2 border-white/5">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Your creative history is waiting to be written.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6 mt-0">
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
                <div className="text-center py-20 glass-panel rounded-3xl opacity-50 border-dashed border-2 border-white/5">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Save your favorite prompts for instant access later.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Footer */}
      <footer className="pt-20 pb-10 text-center text-sm text-muted-foreground border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} PromptMuse Studio. Designed for visionaries.</p>
      </footer>
      
      <Toaster />
    </div>
  );
}
