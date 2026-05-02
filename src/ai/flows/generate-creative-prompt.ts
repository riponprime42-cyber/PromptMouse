
'use server';
/**
 * @fileOverview A creative prompt generation AI agent.
 *
 * - generateCreativePrompt - A function that handles the creative prompt generation process.
 * - GenerateCreativePromptInput - The input type for the generateCreativePrompt function.
 * - GenerateCreativePromptOutput - The return type for the generateCreativePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCreativePromptInputSchema = z.object({
  subject: z.string().describe('The main subject or theme for the image/video.'),
  style: z
    .string()
    .describe(
      'The artistic style or genre (e.g., "fantasy art", "cyberpunk", "impressionistic").'
    ),
  mood: z
    .string()
    .describe('The desired mood or atmosphere (e.g., "epic", "serene", "mysterious").'),
  medium: z
    .enum(['image', 'video'])
    .describe('The target medium: either a static image or a moving video.'),
  aspectRatio: z
    .string()
    .optional()
    .describe('The intended aspect ratio (e.g., "16:9", "1:1", "9:16").'),
  artisticReferences: z
    .array(z.string())
    .optional()
    .describe('Optional list of artistic references or artists to draw inspiration from.'),
});
export type GenerateCreativePromptInput = z.infer<typeof GenerateCreativePromptInputSchema>;

const GenerateCreativePromptOutputSchema = z.object({
  prompt: z.string().describe('The generated detailed creative prompt for image or video creation.'),
});
export type GenerateCreativePromptOutput = z.infer<typeof GenerateCreativePromptOutputSchema>;

export async function generateCreativePrompt(
  input: GenerateCreativePromptInput
): Promise<GenerateCreativePromptOutput> {
  return generateCreativePromptFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'generateCreativePromptTemplate',
  input: {schema: GenerateCreativePromptInputSchema},
  output: {schema: GenerateCreativePromptOutputSchema},
  prompt: `You are an expert creative prompt generator for AI models like Midjourney, DALL-E 3, Runway, and Luma. 
Your task is to expand high-level inputs into a detailed, unique, and inspiring prompt tailored for the specified medium.

Specifications:
Medium: {{{medium}}}
Subject: {{{subject}}}
Style: {{{style}}}
Mood: {{{mood}}}
{{#if aspectRatio}}
Aspect Ratio: {{{aspectRatio}}}
{{/if}}
{{#if artisticReferences}}
Artistic References: {{#each artisticReferences}} - {{{this}}}
{{/each}}
{{/if}}

Instructions:
- If Medium is "video", focus on dynamic motion, camera pans, frame rates, and temporal transitions. Describe how the scene evolves over time.
- If Medium is "image", focus on composition, lighting, texture, and intricate details that work in a single frame.
- Be descriptive and imaginative.
- The output must be a single cohesive paragraph ready for use in a generative model.
- Do not include meta-commentary, just the prompt.`,
});

const generateCreativePromptFlow = ai.defineFlow(
  {
    name: 'generateCreativePromptFlow',
    inputSchema: GenerateCreativePromptInputSchema,
    outputSchema: GenerateCreativePromptOutputSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const {output} = await promptTemplate(input);
        if (output) return output;
        throw new Error('No output from prompt template');
      } catch (error: any) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        // Wait before retrying (exponential backoff: 1s, 2s)
        await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
      }
    }
    throw new Error('Generation failed after multiple attempts');
  }
);
