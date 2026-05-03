
"use client";

import React, { useState } from 'react';
import { Check, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscriptionStore, PLAN_LIMITS, PlanType } from '@/hooks/use-subscription-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SubscriptionViewProps {
  onBack: () => void;
}

// Access the public key from environment variables for security.
// Secret keys should NEVER be included in client-side code.
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export function SubscriptionView({ onBack }: SubscriptionViewProps) {
  const { plan, upgradePlan } = useSubscriptionStore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<PlanType | null>(null);

  const handlePayment = (targetPlan: PlanType, amount: number) => {
    if (targetPlan === 'free') {
      upgradePlan('free');
      toast({ title: "Plan Switched", description: "You are now on the Free tier." });
      return;
    }

    if (plan === targetPlan) {
      toast({ title: "Already Active", description: `You are already on the ${PLAN_LIMITS[targetPlan].label} plan.` });
      return;
    }

    setProcessingId(targetPlan);

    // If no API key is present, we provide a mock payment flow for the prototype development
    if (!RAZORPAY_KEY_ID) {
      console.log("No Razorpay Key ID found. Initiating mock payment flow.");
      setTimeout(() => {
        setProcessingId(null);
        upgradePlan(targetPlan);
        toast({
          title: "Protocol Expanded",
          description: `Welcome to the ${PLAN_LIMITS[targetPlan].label} tier! (Demo Mode Activated)`,
        });
        onBack();
      }, 1500);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency: "USD",
      name: "PromptMuse Studio",
      description: `Upgrade to ${PLAN_LIMITS[targetPlan].label} Plan`,
      image: "https://picsum.photos/seed/muse-icon/200/200",
      handler: function (response: any) {
        setProcessingId(null);
        upgradePlan(targetPlan);
        toast({
          title: "Payment Successful",
          description: `Welcome to the ${PLAN_LIMITS[targetPlan].label} tier! Your neural limits have been expanded.`,
        });
        onBack();
      },
      prefill: {
        name: "Creator",
        email: "creator@promptmuse.studio",
        contact: "9999999999"
      },
      theme: {
        color: "#3b82f6"
      },
      modal: {
        ondismiss: function() {
          setProcessingId(null);
        }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      setProcessingId(null);
      toast({
        title: "Service Unavailable",
        description: "Could not initialize the payment gateway. Please check your network.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 pt-32 relative overflow-hidden animate-reveal">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="absolute top-8 left-8 rounded-full gap-2 text-white/40 hover:text-white z-10"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Studio
      </Button>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <header className="text-center space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Membership Protocol</h2>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Neural Plans.</h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Expand your synthesis bandwidth and unlock professional-grade creative engineering.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <PricingCard 
            title="Free"
            price="0"
            description="Entry-level neural access"
            features={[
              "2 Image Prompts",
              "2 Video Prompts",
              "Local Vault History",
              "Basic Support"
            ]}
            isActive={plan === 'free'}
            onSelect={() => handlePayment('free', 0)}
            isLoading={processingId === 'free'}
          />

          {/* Pro Plan */}
          <PricingCard 
            title="Pro"
            price="25"
            description="Professional creative output"
            features={[
              "100 Image Prompts",
              "100 Video Prompts",
              "Priority Neural Processing",
              "Global Export Tools",
              "Community Hub Access"
            ]}
            highlight
            isActive={plan === 'pro'}
            onSelect={() => handlePayment('pro', 25)}
            isLoading={processingId === 'pro'}
          />

          {/* Max Plan */}
          <PricingCard 
            title="Max"
            price="1000"
            description="Unlimited visual synthesis"
            features={[
              "Unlimited Image Prompts",
              "Unlimited Video Prompts",
              "Early Access to v3.0 Engine",
              "Direct Developer Access",
              "Private Registry Vault"
            ]}
            isActive={plan === 'max'}
            onSelect={() => handlePayment('max', 1000)}
            isLoading={processingId === 'max'}
          />
        </div>

        <footer className="text-center pt-20">
          <div className="flex items-center justify-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            <ShieldCheck className="h-3 w-3" /> Secure Checkout &bull; SSL Encrypted &bull; PCI Compliant
          </div>
        </footer>
      </div>
    </div>
  );
}

function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  highlight = false, 
  isActive = false, 
  onSelect,
  isLoading = false
}: { 
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  isActive?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}) {
  return (
    <Card className={cn(
      "studio-console p-1 border-white/5 transition-all duration-500 hover:border-primary/40",
      highlight && "border-primary/20 bg-primary/5 scale-105 shadow-[0_0_50px_rgba(59,130,246,0.1)]",
      isActive && "border-primary"
    )}>
      <CardContent className="p-10 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em]",
              highlight ? "text-primary" : "text-white/30"
            )}>
              {title} tier
            </span>
            {isActive && <div className="px-3 py-1 bg-primary/20 text-primary text-[8px] font-black uppercase rounded-full">Current</div>}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black italic">${price}</span>
            <span className="text-white/20 text-sm font-light">/month</span>
          </div>
          <p className="text-white/40 text-sm">{description}</p>
        </div>

        <div className="space-y-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-light text-white/70">{f}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={onSelect}
          disabled={isActive || isLoading}
          className={cn(
            "w-full h-16 rounded-2xl font-black text-base transition-all",
            highlight ? "bg-primary hover:bg-primary/90" : "bg-white/5 hover:bg-white/10 border border-white/10",
            isActive && "opacity-50 cursor-default bg-primary/10 text-primary border-primary/20"
          )}
        >
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (isActive ? "Active Protocol" : "Upgrade Now")}
        </Button>
      </CardContent>
    </Card>
  );
}
