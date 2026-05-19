
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
  LogOut,
  Zap,
  MousePointer2,
  ShieldCheck,
  ChevronDown,
  Send,
  User as UserIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PromptForm } from './PromptForm';
import { PromptCard } from './PromptCard';
import { InviteView } from './InviteView';
import { AuthView } from './AuthView';
import { KeyGeneratorView } from './KeyGeneratorView';
import { LoadingView } from './LoadingView';
import { BrandLogo } from './BrandLogo';
import { usePromptsStore } from '@/hooks/use-prompts-store';
import { useInvite } from '@/hooks/use-invite-store';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

export function PromptMuseApp() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
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
    logout: logoutInvite
  } = useInvite();

  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<'landing' | 'auth' | 'invite' | 'studio' | 'generator' | 'loading'>('landing');
  const { toast } = useToast();

  // Derived state for favorites
  const favorites = prompts.filter(p => p.isFavorite);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle protected view transitions
  useEffect(() => {
    if (view === 'studio' || view === 'generator' || view === 'invite') {
      if (!user && !userLoading) {
        setView('auth');
      } else if (user && !isAuthorized && view !== 'invite') {
        setView('invite');
      }
    }
  }, [user, userLoading, isAuthorized, view]);

  const startLoading = (targetView: 'studio' | 'generator' | 'invite') => {
    setView('loading');
    setTimeout(() => {
      setView(targetView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const openStudioTrigger = () => {
    if (!user) {
      setView('auth');
    } else if (!isAuthorized) {
      setView('invite');
    } else {
      startLoading('studio');
    }
  };

  const closeStudio = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      logoutInvite();
      setView('landing');
      toast({ title: "Session Ended", description: "You have been securely logged out." });
    }
  };

  const handleAuthSuccess = () => {
    if (isAuthorized) {
      startLoading('studio');
    } else {
      setView('invite');
    }
  };

  const handleInviteSuccess = (code: string) => {
    const success = validateCode(code);
    if (success) {
      startLoading('studio');
      return true;
    }
    return false;
  };

  if (view === 'loading' || userLoading) {
    return <LoadingView />;
  }

  if (view === 'auth') {
    return <AuthView onBack={() => setView('landing')} onSuccess={handleAuthSuccess} />;
  }

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
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none">PromptMuse Studio</span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Registry Alpha v2.5</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setView('generator')}
                  className="rounded-full gap-2 border-white/10 bg-white/5 hover:bg-white/10 font-bold"
                  size="sm"
                >
                  <Key className="h-4 w-4 text-primary" /> Key Vault
                </Button>

                <div className="w-[1px] h-6 bg-white/10 mx-2" />

                <div className="flex items-center gap-3 mr-2">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[10px] font-black uppercase text-white/80">{user?.displayName || 'Creator'}</span>
                    <span className="text-[8px] font-medium text-white/40">{user?.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full gap-2 text-white/40 hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
                <PromptForm 
                  onGenerated={(entry) => addPrompt(entry)} 
                />
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
                  <EmptyState icon={<History className="h-16 w-16" />} title="No Favorites" desc="Star your best prompts for quick access." />
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
      {/* Dynamic Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled ? "bg-background/80 backdrop-blur-2xl py-4 border-b border-white/5" : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={closeStudio}>
            <BrandLogo className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-xl font-black tracking-tighter">PROMPTMUSE</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              <button className="hover:text-primary transition-colors">Features</button>
              <button className="hover:text-primary transition-colors">Neural Hub</button>
              <button className="hover:text-primary transition-colors">Archive</button>
            </div>
            
            <a 
              href="https://t.me/ALVITEACH" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" /> Invite Code
            </a>

            {user ? (
              <div className="flex items-center gap-4">
                <Button onClick={openStudioTrigger} className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-black h-11 text-xs shadow-2xl transition-all">
                  Studio
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="rounded-full h-11 w-11 p-0 text-white/40 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setView('auth')} className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-black h-11 text-xs shadow-2xl transition-all active:scale-95">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center overflow-hidden">
        {/* Immersive Video Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-background">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            poster="https://picsum.photos/seed/promptmuse-hero/1200/800"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-30 brightness-[0.4]"
          >
            <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-5xl animate-reveal">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl">
            <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">v2.5 Neural Synthesis Engine Now Live</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-12 drop-shadow-2xl">
            Precision <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-pulse bg-clip-text text-transparent italic">Engineering.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed mb-16 backdrop-blur-sm bg-black/5 rounded-3xl p-8 border border-white/5">
            The professional standard for high-fidelity creative synthesis. PromptMuse empowers creators with scientific accuracy for image and video generation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" onClick={openStudioTrigger} className="h-16 px-12 text-lg font-black rounded-2xl gap-3 bg-primary text-white hover:bg-primary/90 shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all hover:scale-105 active:scale-95">
              Launch Studio <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="ghost" onClick={() => setView('auth')} className="h-16 px-10 text-lg font-black rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all">
              {user ? 'My Profile' : 'Get Started'}
            </Button>
          </div>
          
          <div className="mt-20 animate-bounce opacity-20">
            <ChevronDown className="h-6 w-6 mx-auto" />
          </div>
        </div>
      </section>

      {/* Feature Grid: Neural Capabilities */}
      <section className="py-40 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-32 space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Neural Core</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic">Engineered for Excellence.</h3>
          <p className="text-white/30 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Our synthesis engine is built on advanced linguistic analysis and deep understanding of generative model parameters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Cpu className="h-7 w-7" />} 
            title="Artifact Synthesis" 
            desc="Construct complex creative payloads with multi-layered parameter controls." 
          />
          <FeatureCard 
            icon={<Layers className="h-7 w-7" />} 
            title="Atmosphere Mapping" 
            desc="Scientific mapping of mood and lighting for perfect visual resonance." 
          />
          <FeatureCard 
            icon={<Stars className="h-7 w-7" />} 
            title="Influence Registry" 
            desc="Integrate specific artistic references with weighted influence accuracy." 
          />
        </div>
      </section>

      {/* Visual Showcase: The Studio Experience */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto studio-console p-10 md:p-24 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
          
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Workflow Optimization</span>
                <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">The Creator's <br />Vault.</h3>
              </div>
              <p className="text-white/40 text-xl font-light leading-relaxed">
                PromptMuse provides a centralized workspace for your creative engineering. Save, iterate, and star your most effective synthesis results for rapid deployment.
              </p>
              <div className="flex flex-col gap-6">
                <CheckItem text="Persistent history across sessions" />
                <CheckItem text="Advanced filtering and star system" />
                <CheckItem text="Instant clipboard synchronization" />
                <CheckItem text="Medium-specific parameter injection" />
              </div>
              <Button onClick={openStudioTrigger} className="h-14 px-10 rounded-xl bg-white text-black font-black text-sm gap-3 group">
                Enter The Vault <MousePointer2 className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-background border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="mx-auto text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Studio Console v2.5</div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-32 w-full bg-white/[0.03] rounded-2xl border border-white/5" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 w-full bg-white/5 rounded-xl" />
                    <div className="h-10 w-full bg-white/5 rounded-xl" />
                  </div>
                  <div className="h-14 w-full bg-primary/20 rounded-xl border border-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Gateway: Final CTA */}
      <section className="py-60 px-8 text-center relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-primary/10 text-primary mb-4 animate-pulse">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic">Protocol Initialized.</h2>
          <p className="text-white/30 text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Ready to synthesize your vision? Enter the PromptMuse Studio and unlock the future of creative engineering.
          </p>
          <div className="pt-10">
            <Button onClick={openStudioTrigger} className="h-20 px-16 text-2xl font-black rounded-2xl bg-white text-black hover:bg-white/90 shadow-[0_0_80px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95">
              Launch Master Studio
            </Button>
          </div>
          <p className="text-[10px] text-white/10 font-bold uppercase tracking-[0.5em] mt-12">
            Invite-only Neural Access Protocol Active
          </p>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="py-24 border-t border-white/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-4">
              <BrandLogo className="w-10 h-10" glow={false} />
              <span className="text-2xl font-black tracking-tighter">PROMPTMUSE</span>
            </div>
            <p className="text-white/20 text-xs font-medium uppercase tracking-[0.4em] max-w-xs text-center md:text-left leading-relaxed">
              Leading the revolution in precision creative synthesis for the AI era.
            </p>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/10">made by ALVISONGS</p>
          </div>

          <div className="flex items-center gap-12">
            <FooterCol title="Studio" items={["Launch", "Archive", "Key Vault"]} />
            <FooterCol title="Protocol" items={["Security", "Privacy", "API"]} />
            <FooterCol title="Social" items={["Twitter", "Discord", "Registry"]} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO &bull; BUILT BY CREATORS
          </p>
          <div className="flex items-center gap-8 text-[10px] text-white/10 font-bold uppercase tracking-[0.3em]">
            <span>Neural V2.5.0</span>
            <span>Registry active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight italic">{title}</h3>
      <p className="text-white/40 leading-relaxed text-base font-light">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-150 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{text}</span>
    </div>
  );
}

function FooterCol({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{title}</h4>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <button key={item} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors text-left">
            {item}
          </button>
        ))}
      </div>
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
