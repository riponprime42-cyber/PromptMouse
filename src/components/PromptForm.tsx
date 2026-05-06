"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Video, Cpu, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
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
  { label: "1:1", icon: <Square className="h-4 w-4" />, desc: "Square (Instagram/Profile)" },
  { label: "16:9", icon: <RectangleHorizontal className="h-4 w-4" />, desc: "Widescreen (YouTube/TV)" },
  { label: "9:16", icon: <RectangleVertical className="h-4 w-4" />, desc: "Stories (TikTok/Reels)" },
  { label: "4:3", icon: <RectangleHorizontal className="h-4 w-4 opacity-80" />, desc: "Classic (Photography/TV)" },
  { label: "3:4", icon: <RectangleVertical className="h-4 w-4 opacity-80" />, desc: "Portrait (Standard Tablet)" },
  { label: "3:2", icon: <RectangleHorizontal className="h-4 w-4 opacity-90" />, desc: "Photo (Standard DSLR)" },
  { label: "2:3", icon: <RectangleVertical className="h-4 w-4 opacity-90" />, desc: "Vertical Photo (Postcard)" },
  { label: "4:5", icon: <RectangleVertical className="h-4 w-4 scale-y-110" />, desc: "IG Portrait (Optimized)" },
  { label: "5:4", icon: <RectangleHorizontal className="h-4 w-4 scale-x-110" />, desc: "Art Print (Standard)" },
  { label: "21:9", icon: <RectangleHorizontal className="h-4 w-4 scale-x-125" />, desc: "Ultrawide (Gaming/Cinema)" },
  { label: "2.39:1", icon: <RectangleHorizontal className="h-4 w-4 scale-x-150 opacity-70" />, desc: "Anamorphic (Cinemascope)" },
  { label: "1.85:1", icon: <RectangleHorizontal className="h-4 w-4 scale-x-110 opacity-70" />, desc: "Theatrical (Widescreen Cinema)" },
  { label: "9:19.5", icon: <RectangleVertical className="h-4 w-4 scale-y-125 opacity-70" />, desc: "Mobile (Modern iPhone/Android)" }
];

const CAMERA_ANGLES = [
  "Cinematic Close-up", "Wide Shot", "Bird's Eye View", "Low Angle", 
  "Eye Level", "Drone Shot", "Dutch Angle", "Macro", "Over the Shoulder"
];

const MODELS = [
  "Muse Fast", "Muse Ultra", "Muse Pro", "Muse Preview"
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
    model: 'Muse Pro',
    cameraAngle: 'Cinematic Close-up',
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
        model: formData.model,
        cameraAngle: formData.cameraAngle,
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
          model: formData.model,
          cameraAngle: formData.cameraAngle,
          aspectRatio: formData.aspectRatio,
          artisticReferences: formData.references ? formData.references.split(',').map(s => s.trim()) : [],
        }
      };

      onGenerated(newEntry);
      setFormData(prev => ({ ...prev, subject: '' }));
      
      toast({
        title: "Synthesis Complete",
        description: `The ${formData.model} has delivered your prompt.`,
      });
    } catch (error: any) {
      toast({
        title: "Model Error",
        description: error.message || "The AI service is experiencing high load. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Target Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Target Medium</Label>
          <Tabs 
            value={formData.medium} 
            onValueChange={(val) => setFormData(prev => ({ ...prev, medium: val as 'image' | 'video' }))}
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

        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Neural Model</Label>
          <Select
            value={formData.model}
            onValueChange={(val) => setFormData(prev => ({ ...prev, model: val }))}
          >
            <SelectTrigger className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 font-bold">
              <div className="flex items-center gap-3">
                <Cpu className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Select Model" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10 rounded-2xl">
              {MODELS.map(m => (
                <SelectItem key={m} value={m} className="rounded-xl focus:bg-primary">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Camera Angle</Label>
          <Select
            value={formData.cameraAngle}
            onValueChange={(val) => setFormData(prev => ({ ...prev, cameraAngle: val }))}
          >
            <SelectTrigger className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-6 font-bold">
              <SelectValue placeholder="Select Angle" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10 rounded-2xl">
              {CAMERA_ANGLES.map(a => (
                <SelectItem key={a} value={a} className="rounded-xl focus:bg-primary">{a}</SelectItem>
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
            <SelectContent className="bg-background border-white/10 rounded-2xl max-h-[400px]">
              {ASPECT_RATIOS.map(r => (
                <SelectItem key={r.label} value={r.label} className="rounded-xl focus:bg-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-6 flex justify-center">{r.icon}</div>
                    <div className="flex flex-col">
                      <span className="font-bold">{r.label}</span>
                      <span className="text-[8px] opacity-40 uppercase tracking-tighter leading-none">{r.desc}</span>
                    </div>
                  </div>
                </SelectItem>
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
        className={cn(
          "w-full h-20 text-xl font-black gap-4 shadow-2xl transition-all rounded-3xl",
          "bg-primary hover:bg-primary/90 shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
        )}
      >
        {isLoading ? (
          <><Loader2 className="h-6 w-6 animate-spin" /> Synthesizing with {formData.model}...</>
        ) : (
          <><Sparkles className="h-6 w-6" /> Forge Master Prompt</>
        )}
      </Button>
    </form>
  );
}
