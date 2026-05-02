
"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Loader2, 
  Sparkles,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthView({ onBack, onSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const auth = useAuth();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back", description: "Authentication successful." });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        toast({ title: "Account created", description: "Welcome to PromptMuse Studio." });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Auth Error",
        description: error.message || "Failed to authenticate.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Authentication successful", description: "Logged in with Google." });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Auth Error",
        description: error.message || "Google authentication failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Aesthetic Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none z-0" />

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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">
              {isLogin ? "Welcome Back." : "Create Identity."}
            </h1>
            <p className="text-white/40 text-sm font-light uppercase tracking-widest">
              {isLogin ? "Neural Credentials Required" : "Register Your Neural Signature"}
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl bg-white/[0.03] border-white/5 hover:bg-white/5 font-bold gap-3"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-white/20">
                <span className="bg-background px-2">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Full Name</Label>
                  <Input 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl px-6"
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    type="email" 
                    placeholder="name@neural.net" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl pl-14 pr-6"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 ml-4">Access Protocol</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl pl-14 pr-6"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-2xl shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  isLogin ? "Access Studio" : "Initialize Identity"
                )}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <button 
              className="text-sm font-light text-white/40 hover:text-white transition-colors underline underline-offset-4"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need a neural identity? Sign Up" : "Already have an identity? Log In"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
