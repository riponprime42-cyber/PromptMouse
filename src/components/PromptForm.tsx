"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Video, Maximize } from 'lucide-react';
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
        title: "Synthesis Complete",
        description: "The Muse has delivered your prompt.",
      });
    } catch (error: any) {
      toast({
        title: "Model Congestion",
        description: "The AI service is experiencing high load. Retrying...",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Target Toggle */}
      <div className="flex flex-col gap-6">
        <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Target Medium</Label>
        <Tabs 
          value={formData.medium} 
          onValueChange={(val) => setFormData(prev => ({ ...prev, medium: val as 'image' | 'video' }))}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/5 h-14 rounded-2xl p-1.5">
            <TabsTrigger value="image" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-3 font-bold">
              <ImageIcon className="h-4 w-4" /> Image
            </TabsTrigger>
            <TabsTrigger value="video" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-3 font-bold">
              <Video className="h-4 w-4" /> Video
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Vision</Label>
        <Input
          id="subject"
          placeholder="Describe your masterpiece..."
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="h-20 bg-white/[0.03] border-white/5 focus:border-primary/50 transition-all text-2xl font-light rounded-3xl px-8 placeholder:text-white/10"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Art Style</Label>
          <Select
            value={formData.style}
            onValueChange={(val) => setFormData(prev => ({ ...prev, style: val }))}
          >
            <SelectTrigger className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-6 font-bold">
              <SelectValue placeholder="Select Style" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10 rounded-2xl">
              {STYLES.map(s => (
                <SelectItem key={s} value={s} className="rounded-xl focus:bg-primary">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Atmosphere</Label>
          <Select
            value={formData.mood}
            onValueChange={(val) => setFormData(prev => ({ ...prev, mood: val }))}
          >
            <SelectTrigger className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-6 font-bold">
              <SelectValue placeholder="Select Mood" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10 rounded-2xl">
              {MOODS.map(m => (
                <SelectItem key={m} value={m} className="rounded-xl focus:bg-primary">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Aspect Ratio</Label>
          <Select
            value={formData.aspectRatio}
            onValueChange={(val) => setFormData(prev => ({ ...prev, aspectRatio: val }))}
          >
            <SelectTrigger className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-6 font-bold">
              <SelectValue placeholder="Select Ratio" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10 rounded-2xl">
              {ASPECT_RATIOS.map(r => (
                <SelectItem key={r} value={r} className="rounded-xl focus:bg-primary">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="references" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Influence Sources</Label>
        <Input
          id="references"
          placeholder="Artists, movies, or camera lenses (comma separated)"
          value={formData.references}
          onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
          className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.subject}
        className="w-full h-20 text-xl font-black gap-4 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-3xl"
      >
        {isLoading ? (
          <><Loader2 className="h-6 w-6 animate-spin" /> Transmitting to Neural Network...</>
        ) : (
          <><Sparkles className="h-6 w-6" /> Forge Master Prompt</>
        )}
      </Button>
    </form>
  );
}