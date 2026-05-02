
"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Video, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateCreativePrompt } from '@/ai/flows/generate-creative-prompt';
import { PromptEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const STYLES = [
  "Photorealistic", "Digital Art", "Cyberpunk", "Fantasy Art", "Impressionistic", 
  "Anime / Manga", "Minimalist", "Surrealism", "Pop Art", "Concept Art", "Cinematic"
];

const MOODS = [
  "Epic", "Serene", "Mysterious", "Cinematic", "Ethereal", 
  "Grim", "Vibrant", "Dreamy", "Energetic", "Melancholic"
];

const ASPECT_RATIOS = [
  "1:1", "16:9", "9:16", "4:3", "3:2", "21:9"
];

interface PromptFormProps {
  onGenerated: (entry: PromptEntry) => void;
}

export function PromptForm({ onGenerated }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    style: 'Photorealistic',
    mood: 'Epic',
    medium: 'image' as 'image' | 'video',
    aspectRatio: '16:9',
    references: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) return;

    setIsLoading(true);
    try {
      const result = await generateCreativePrompt({
        subject: formData.subject,
        style: formData.style,
        mood: formData.mood,
        medium: formData.medium,
        aspectRatio: formData.aspectRatio,
        artisticReferences: formData.references ? formData.references.split(',').map(s => s.trim()) : undefined,
      });

      const newEntry: PromptEntry = {
        id: crypto.randomUUID(),
        text: result.prompt,
        timestamp: Date.now(),
        isFavorite: false,
        parameters: {
          subject: formData.subject,
          style: formData.style,
          mood: formData.mood,
          medium: formData.medium,
          aspectRatio: formData.aspectRatio,
          artisticReferences: formData.references ? formData.references.split(',').map(s => s.trim()) : [],
        }
      };

      onGenerated(newEntry);
      setFormData(prev => ({ ...prev, subject: '' }));
      
      toast({
        title: "Muse Responded",
        description: `Successfully crafted a ${formData.medium} prompt.`,
      });
    } catch (error: any) {
      console.error('Generation failed', error);
      toast({
        title: "The Muse is Busy",
        description: "The AI service is temporarily unavailable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Medium Toggle */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Select Target Medium</Label>
        <Tabs 
          value={formData.medium} 
          onValueChange={(val) => setFormData(prev => ({ ...prev, medium: val as 'image' | 'video' }))}
          className="w-full max-w-xs"
        >
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 h-12 rounded-full p-1">
            <TabsTrigger value="image" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Image
            </TabsTrigger>
            <TabsTrigger value="video" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <Video className="h-4 w-4" /> Video
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold text-primary">Describe your vision</Label>
        <Input
          id="subject"
          placeholder="e.g., A sprawling neon metropolis submerged in deep ocean..."
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="h-14 bg-background/50 border-white/10 focus:border-primary/60 transition-all text-lg rounded-2xl"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Artistic Style</Label>
          <Select
            value={formData.style}
            onValueChange={(val) => setFormData(prev => ({ ...prev, style: val }))}
          >
            <SelectTrigger className="h-12 bg-background/50 border-white/10 rounded-xl">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Atmospheric Mood</Label>
          <Select
            value={formData.mood}
            onValueChange={(val) => setFormData(prev => ({ ...prev, mood: val }))}
          >
            <SelectTrigger className="h-12 bg-background/50 border-white/10 rounded-xl">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Canvas Ratio</Label>
          <Select
            value={formData.aspectRatio}
            onValueChange={(val) => setFormData(prev => ({ ...prev, aspectRatio: val }))}
          >
            <SelectTrigger className="h-12 bg-background/50 border-white/10 rounded-xl">
              <SelectValue placeholder="Ratio" />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="references" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Inspiration Sources (Optional)</Label>
        <Input
          id="references"
          placeholder="e.g., Greg Rutkowski, Studio Ghibli, 70mm IMAX..."
          value={formData.references}
          onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
          className="h-12 bg-background/50 border-white/10 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.subject}
        className="w-full h-16 text-lg font-black gap-3 bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(140,71,209,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl"
      >
        {isLoading ? (
          <><Loader2 className="h-6 w-6 animate-spin" /> Distilling Creative Essence...</>
        ) : (
          <><Sparkles className="h-6 w-6" /> Ignite The Muse</>
        )}
      </Button>
    </form>
  );
}
