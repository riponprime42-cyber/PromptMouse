
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary/30 py-20 px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />

      <div className="max-w-4xl mx-auto space-y-12 animate-reveal">
        <header className="space-y-8 text-center md:text-left">
          <Link href="/">
            <Button variant="ghost" className="rounded-full gap-2 text-white/40 hover:text-white mb-8 pl-0">
              <ArrowLeft className="h-4 w-4" /> Back to Studio
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">Privacy Protocol.</h1>
              <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">Effective Date: October 2023</p>
            </div>
          </div>
        </header>

        <div className="studio-console p-10 md:p-16 space-y-10 border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <section className="space-y-4">
            <p className="text-white/60 leading-relaxed font-light">
              Welcome to prompt-mouse-ai.vercel.app. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services.
            </p>
            <p className="text-white/60 leading-relaxed font-light">
              By accessing or using the website, you agree to the terms outlined in this Privacy Policy.
            </p>
          </section>

          <section className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">01.</span> Information We Collect
              </h2>
              <div className="pl-8 space-y-4 text-white/50 text-sm leading-relaxed">
                <p><strong className="text-white">a) Personal Information:</strong> When you use certain features of the website, we may collect your name, email address, user account information, profile image, and any information you voluntarily provide.</p>
                <p><strong className="text-white">b) Usage Data:</strong> We automatically collect technical information, including IP address, browser type, device information, operating system, and pages visited.</p>
                <p><strong className="text-white">c) AI Prompt Content:</strong> Any prompts or content you submit through the platform may be temporarily processed to provide AI-powered features.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">02.</span> How We Use Your Information
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                We use collected information to provide and improve our services, personalize user experience, maintain website security, prevent fraud, analyze performance, and communicate updates.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">03.</span> Cookies and Tracking
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                We may use cookies and similar technologies to remember user preferences, improve functionality, and analyze usage patterns. You can disable cookies through your browser settings.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">04.</span> Third-Party Services
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                Our platform may use third-party tools for hosting, analytics, authentication, and AI processing. These third parties collect information according to their own privacy policies.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">05.</span> Data Security
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                We implement reasonable security measures to protect your information, however, no online platform can guarantee complete security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">06.</span> Data Retention
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                We retain user data only as long as necessary to provide services and comply with legal obligations. You may request deletion of your data at any time.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">07.</span> User Rights
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                You may have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us using the information provided below.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">08.</span> Children's Privacy
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">09.</span> External Links
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of external websites.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">10.</span> Policy Changes
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">11.</span> Contact Us
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, contact us via:<br />
                <span className="text-primary">prompt-mouse-ai.vercel.app</span><br />
                Email: <span className="text-white">riponprime42@gmail.com</span>
              </p>
            </div>

            <div className="space-y-4 pt-10">
              <h2 className="text-xl font-black tracking-tight italic flex items-center gap-3">
                <span className="text-primary">12.</span> Consent
              </h2>
              <p className="pl-8 text-white/50 text-sm leading-relaxed">
                By using prompt-mouse-ai.vercel.app, you consent to this Privacy Policy and agree to its terms.
              </p>
            </div>
          </section>
        </div>

        <footer className="pt-20 border-t border-white/5 text-center space-y-8">
          <div className="flex justify-center">
            <BrandLogo className="w-12 h-12" glow={false} />
          </div>
          <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} PROMPTMUSE STUDIO &bull; BUILT BY CREATORS
          </p>
        </footer>
      </div>
    </div>
  );
}
