
'use server';
/**
 * @fileOverview A creative prompt generation AI agent.
 *
 * - generateCreativePrompt - A function that handles the creative prompt generation process.
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

const GenerateCreativePromptOutputSchema = z.object({
  prompt: z.string().describe('The generated detailed creative prompt for image or video creation.'),
});

/**
 * Server action to generate creative prompts.
 * Next.js 15: Only async functions should be exported from "use server" files.
 */
export async function generateCreativePrompt(
  input: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Defensive check for API Key before calling the AI
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Neural Link Error: GEMINI_API_KEY is missing from Vercel. Please go to Project Settings > Environment Variables and add GEMINI_API_KEY.'
    };
  }

  try {
    const result = await generateCreativePromptFlow(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Generation Error:', error);
    
    let errorMessage = error.message || 'The AI engine is currently busy.';
    
    // Catch common permission/key errors and provide helpful Vercel-specific guidance
    if (
      errorMessage.includes('API key') || 
      errorMessage.includes('key not valid') || 
      errorMessage.includes('FAILED_PRECONDITION') ||
      errorMessage.includes('403')
    ) {
      errorMessage = 'Neural Link Error: The API key provided is invalid or not found. Please verify your GEMINI_API_KEY in Vercel settings.';
    }
    
    return { 
      success: false, 
      error: errorMessage
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
