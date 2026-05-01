
"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
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
import { generateCreativePrompt } from '@/ai/flows/generate-creative-prompt';
import { PromptEntry } from '@/lib/types';

const STYLES = [
  "Photorealistic", "Digital Art", "Cyberpunk", "Fantasy Art", "Impressionistic", 
  "Anime / Manga", "Minimalist", "Surrealism", "Pop Art", "Concept Art"
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
  const [formData, setFormData] = useState({
    subject: '',
    style: 'Photorealistic',
    mood: 'Epic',
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
          aspectRatio: formData.aspectRatio,
          artisticReferences: formData.references ? formData.references.split(',').map(s => s.trim()) : [],
        }
      };

      onGenerated(newEntry);
      setFormData(prev => ({ ...prev, subject: '' }));
    } catch (error) {
      console.error('Generation failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold text-primary">Main Subject</Label>
        <Input
          id="subject"
          placeholder="e.g., A futuristic space colony orbiting a binary star..."
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="h-12 bg-background/50 border-primary/20 focus:border-primary/60 transition-all text-lg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-widest">Style</Label>
          <Select
            value={formData.style}
            onValueChange={(val) => setFormData(prev => ({ ...prev, style: val }))}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-widest">Mood</Label>
          <Select
            value={formData.mood}
            onValueChange={(val) => setFormData(prev => ({ ...prev, mood: val }))}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue placeholder="Select a mood" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-widest">Aspect Ratio</Label>
          <Select
            value={formData.aspectRatio}
            onValueChange={(val) => setFormData(prev => ({ ...prev, aspectRatio: val }))}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
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
        <Label htmlFor="references" className="text-xs text-muted-foreground uppercase tracking-widest">Artistic References (Optional)</Label>
        <Input
          id="references"
          placeholder="e.g., Salvador Dalí, Syd Mead, Moebius..."
          value={formData.references}
          onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
          className="bg-background/50 border-white/10"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.subject}
        className="w-full h-12 text-base font-bold gap-2 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(140,71,209,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {isLoading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Igniting Muse...</>
        ) : (
          <><Sparkles className="h-5 w-5" /> Generate Muse Prompt</>
        )}
      </Button>
    </form>
  );
}
