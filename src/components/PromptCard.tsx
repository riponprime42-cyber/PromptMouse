
"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Heart, Trash2, Edit3, Check, X, Maximize, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PromptEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PromptCardProps {
  prompt: PromptEntry;
  onUpdate: (id: string, text: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onUpdate, onToggleFavorite, onDelete }: PromptCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(prompt.text);
  const [isCopied, setIsCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [formattedTime, setFormattedTime] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Format dates on the client to avoid hydration mismatch
    const date = new Date(prompt.timestamp);
    setFormattedDate(date.toLocaleDateString());
    setFormattedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [prompt.timestamp]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try selecting the text manually.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    onUpdate(prompt.id, editedText);
    setIsEditing(false);
  };

  return (
    <Card className="glass-card overflow-hidden transition-all duration-500 hover:border-primary/40 group animate-fade-in-up border-white/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
              prompt.parameters.medium === 'video' ? "bg-accent/20 text-accent border border-accent/20" : "bg-primary/20 text-primary-foreground border border-primary/20"
            )}>
              {prompt.parameters.medium === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
              {prompt.parameters.medium}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
              {prompt.parameters.style}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
              {prompt.parameters.mood}
            </span>
            {prompt.parameters.aspectRatio && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/70 border border-white/10 flex items-center gap-1.5">
                <Maximize className="h-3 w-3" /> {prompt.parameters.aspectRatio}
              </span>
            )}
          </div>
          <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity self-end md:self-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(prompt.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[140px] bg-black/30 border-primary/30 rounded-xl focus:border-primary transition-all p-4 text-sm leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setIsEditing(false)}>Discard</Button>
              <Button size="sm" className="rounded-full px-6" onClick={handleSave}>Apply Changes</Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-light whitespace-pre-wrap mb-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.03]">
              {prompt.text}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Saved To Vault</span>
            <span className="text-[10px] text-white/40">
              {formattedDate ? `${formattedDate} • ${formattedTime}` : 'Loading...'}
            </span>
          </div>
          <div className="items-center gap-3 hidden sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full transition-all",
                prompt.isFavorite ? "text-accent fill-accent hover:text-accent/80 hover:bg-accent/10" : "text-muted-foreground hover:text-accent hover:bg-accent/10"
              )}
              onClick={() => onToggleFavorite(prompt.id)}
            >
              <Heart className={cn("h-5 w-5", prompt.isFavorite && "fill-current")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 px-6 rounded-full gap-2 border-primary/30 hover:bg-primary/10 transition-all font-bold",
                isCopied && "bg-primary/20 border-primary"
              )}
              onClick={handleCopy}
            >
              {isCopied ? (
                <><Check className="h-4 w-4" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy Prompt</>
              )}
            </Button>
          </div>
          <div className="flex sm:hidden items-center gap-2">
             <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                prompt.isFavorite ? "text-accent fill-accent" : "text-muted-foreground"
              )}
              onClick={() => onToggleFavorite(prompt.id)}
            >
              <Heart className={cn("h-4 w-4", prompt.isFavorite && "fill-current")} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full border-primary/30",
                isCopied && "bg-primary/20 border-primary"
              )}
              onClick={handleCopy}
            >
              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
