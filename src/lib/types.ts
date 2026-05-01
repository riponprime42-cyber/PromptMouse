
export interface PromptEntry {
  id: string;
  text: string;
  timestamp: number;
  isFavorite: boolean;
  parameters: {
    subject: string;
    style: string;
    mood: string;
    aspectRatio?: string;
    artisticReferences?: string[];
  };
}
