'use server';

/**
 * @fileOverview LinkedIn profile analysis flow.
 *
 * - analyzeLinkedInProfile - Analyzes a LinkedIn profile and identifies areas for improvement.
 * - AnalyzeLinkedInProfileInput - The input type for the analyzeLinkedInProfile function.
 * - AnalyzeLinkedInProfileOutput - The return type for the analyzeLinkedInProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLinkedInProfileInputSchema = z.object({
  profileText: z.string().describe('The full text content of the LinkedIn profile.'),
});
export type AnalyzeLinkedInProfileInput = z.infer<typeof AnalyzeLinkedInProfileInputSchema>;

const AnalyzeLinkedInProfileOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the LinkedIn profile, including areas for improvement, formatted as markdown.'),
});
export type AnalyzeLinkedInProfileOutput = z.infer<typeof AnalyzeLinkedInProfileOutputSchema>;

export async function analyzeLinkedInProfile(input: AnalyzeLinkedInProfileInput): Promise<AnalyzeLinkedInProfileOutput> {
  return analyzeLinkedInProfileFlow(input);
}

const analyzeLinkedInProfilePrompt = ai.definePrompt({
  name: 'analyzeLinkedInProfilePrompt',
  input: {schema: AnalyzeLinkedInProfileInputSchema},
  output: {schema: AnalyzeLinkedInProfileOutputSchema},
  prompt: `You are a LinkedIn profile optimization expert. Analyze the provided LinkedIn profile text and identify areas for improvement. Be specific and provide actionable suggestions for each section of the profile (Experience, Skills, etc.). Format your output as markdown.

LinkedIn Profile Text:
---
{{{profileText}}}
---`,
});

const analyzeLinkedInProfileFlow = ai.defineFlow(
  {
    name: 'analyzeLinkedInProfileFlow',
    inputSchema: AnalyzeLinkedInProfileInputSchema,
    outputSchema: AnalyzeLinkedInProfileOutputSchema,
  },
  async input => {
    const {output} = await analyzeLinkedInProfilePrompt(input);
    return output!;
  }
);
