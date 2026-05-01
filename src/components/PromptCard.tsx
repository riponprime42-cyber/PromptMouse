
"use client";

import React, { useState } from 'react';
import { Copy, Heart, Trash2, Edit3, Check, X, Maximize } from 'lucide-react';
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
  const { toast } = useToast();

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
    <Card className="glass-panel overflow-hidden transition-all duration-300 hover:border-primary/40 group animate-fade-in-up">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary-foreground border border-primary/20">
              {prompt.parameters.style}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/20">
              {prompt.parameters.mood}
            </span>
            {prompt.parameters.aspectRatio && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 border border-white/10 flex items-center gap-1">
                <Maximize className="h-3 w-3" /> {prompt.parameters.aspectRatio}
              </span>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(prompt.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[120px] bg-background/50 border-primary/30"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <p className="prompt-text text-sm md:text-base text-foreground/90 mb-4 whitespace-pre-wrap">
            {prompt.text}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-[10px] text-muted-foreground">
            {new Date(prompt.timestamp).toLocaleDateString()} at {new Date(prompt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 transition-colors",
                prompt.isFavorite ? "text-accent fill-accent hover:text-accent/80" : "text-muted-foreground hover:text-accent"
              )}
              onClick={() => onToggleFavorite(prompt.id)}
            >
              <Heart className={cn("h-5 w-5", prompt.isFavorite && "fill-current")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 border-primary/30 hover:bg-primary/10 transition-all",
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
        </div>
      </CardContent>
    </Card>
  );
}
