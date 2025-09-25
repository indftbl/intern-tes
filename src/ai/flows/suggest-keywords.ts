'use server';

/**
 * @fileOverview Suggests relevant keywords for a LinkedIn profile using GenAI.
 *
 * - suggestKeywords - A function that suggests keywords based on user's career goals.
 * - SuggestKeywordsInput - The input type for the suggestKeywords function.
 * - SuggestKeywordsOutput - The return type for the suggestKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKeywordsInputSchema = z.object({
  careerGoal: z
    .string()
    .describe('The user\'s career goals, such as desired job title or industry.'),
  profileSummary: z
    .string()
    .optional()
    .describe('A brief summary of the user\'s current LinkedIn profile.'),
});
export type SuggestKeywordsInput = z.infer<typeof SuggestKeywordsInputSchema>;

const SuggestKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe(
      'An array of relevant keywords to include in the profile for better visibility.'
    ),
});
export type SuggestKeywordsOutput = z.infer<typeof SuggestKeywordsOutputSchema>;

export async function suggestKeywords(input: SuggestKeywordsInput): Promise<SuggestKeywordsOutput> {
  return suggestKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeywordsPrompt',
  input: {schema: SuggestKeywordsInputSchema},
  output: {schema: SuggestKeywordsOutputSchema},
  prompt: `You are a LinkedIn profile optimization expert.

  Based on the user's career goals and profile summary, suggest 5-10 relevant keywords to include in their profile to improve search visibility.

  Career Goal: {{{careerGoal}}}
  Profile Summary: {{{profileSummary}}}

  Keywords:`,
});

const suggestKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestKeywordsFlow',
    inputSchema: SuggestKeywordsInputSchema,
    outputSchema: SuggestKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
