
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
      'The artistic style or genre (e.g., "fantasy art", "cyberpunk", "impressionistic", "cartoon", "drawing style").'
    ),
  mood: z
    .string()
    .describe('The desired mood or atmosphere (e.g., "epic", "serene", "mysterious").'),
  medium: z
    .enum(['image', 'video'])
    .describe('The target medium: either a static image or a moving video.'),
  model: z
    .string()
    .describe('The specific AI model selected for synthesis (e.g., "Muse Pro", "Muse Fast").'),
  cameraAngle: z
    .string()
    .optional()
    .describe('The preferred camera angle or perspective (e.g., "low angle", "bird\'s eye view").'),
  aspectRatio: z
    .string()
    .optional()
    .describe('The intended aspect ratio (e.g., "16:9", "1:1", "9:16").'),
  artisticReferences: z
    .array(z.string())
    .optional()
    .describe('Optional list of artistic references or artists to draw inspiration from.'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional reference image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateCreativePromptInput = z.infer<typeof GenerateCreativePromptInputSchema>;

const GenerateCreativePromptOutputSchema = z.object({
  prompt: z.string().describe('The generated detailed creative prompt for image or video creation.'),
});

export type GenerateCreativePromptOutput = z.infer<typeof GenerateCreativePromptOutputSchema>;

/**
 * Server action to generate creative prompts.
 * Returns a result object to avoid throwing raw errors in production.
 */
export async function generateCreativePrompt(
  input: GenerateCreativePromptInput
): Promise<{ success: boolean; data?: GenerateCreativePromptOutput; error?: string }> {
  try {
    const result = await generateCreativePromptFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Generation Error:', error);
    return { 
      success: false, 
      error: error.message || 'The AI engine is currently busy or the API key is invalid.' 
    };
  }
}

const promptTemplate = ai.definePrompt({
  name: 'generateCreativePromptTemplate',
  input: {schema: GenerateCreativePromptInputSchema},
  output: {schema: GenerateCreativePromptOutputSchema},
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are an expert creative prompt generator for AI models like Midjourney, DALL-E 3, Runway, and Luma. 
Your task is to expand high-level inputs into a detailed, unique, and inspiring prompt tailored for the specified medium and targeted model.

Specifications:
Medium: {{{medium}}}
Target Model: {{{model}}}
Subject: {{{subject}}}
Style: {{{style}}}
Mood: {{{mood}}}
{{#if cameraAngle}}
Camera Angle: {{{cameraAngle}}}
{{/if}}
{{#if aspectRatio}}
Aspect Ratio: {{{aspectRatio}}}
{{/if}}
{{#if artisticReferences}}
Artistic References: {{#each artisticReferences}} - {{{this}}}
{{/each}}
{{/if}}

{{#if imageDataUri}}
Reference Image: {{media url=imageDataUri}}
Instructions for Reference Image:
- Analyze the provided reference image carefully. 
- Incorporate visual elements, colors, textures, and composition from the image into the generated prompt.
{{/if}}

Instructions:
- Tailor the prompt complexity to the "Target Model".
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
    const {output} = await promptTemplate(input);
    if (!output) throw new Error('No output from prompt template');
    return output;
  }
);
