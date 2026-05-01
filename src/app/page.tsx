
import { PromptMuseApp } from '@/components/PromptMuseApp';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background blobs for aesthetic depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none z-[-1]" />
      
      <PromptMuseApp />
    </main>
  );
}
