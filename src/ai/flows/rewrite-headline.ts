'use server';
/**
 * @fileOverview Rewrites a LinkedIn headline to be keyword-rich and attention-grabbing.
 *
 * - rewriteHeadline - A function that rewrites the headline.
 * - RewriteHeadlineInput - The input type for the rewriteHeadline function.
 * - RewriteHeadlineOutput - The return type for the rewriteHeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteHeadlineInputSchema = z.object({
  currentHeadline: z.string().optional().describe('The current LinkedIn headline (if available).'),
  careerGoals: z.string().describe('The user\'s career goals.'),
  profileText: z.string().describe('The full text of the LinkedIn profile.'),
});
export type RewriteHeadlineInput = z.infer<typeof RewriteHeadlineInputSchema>;

const RewriteHeadlineOutputSchema = z.object({
  rewrittenHeadline: z.string().describe('The rewritten LinkedIn headline.'),
});
export type RewriteHeadlineOutput = z.infer<typeof RewriteHeadlineOutputSchema>;

export async function rewriteHeadline(input: RewriteHeadlineInput): Promise<RewriteHeadlineOutput> {
  return rewriteHeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteHeadlinePrompt',
  input: {schema: RewriteHeadlineInputSchema},
  output: {schema: RewriteHeadlineOutputSchema},
  prompt: `You are a LinkedIn profile optimization expert. Your task is to extract the current headline from the provided profile text and then rewrite it to be more keyword-rich and attention-grabbing, based on the user's stated career goals.

If a headline is present in the text, use that as the basis. If not, create a new one from scratch based on the profile content.

Profile Text:
{{{profileText}}}

Career Goals: {{{careerGoals}}}

First, identify the current headline from the text.
Then, rewrite the headline to align with the career goals, incorporating relevant keywords from the profile.

Rewritten Headline:`,
});

const rewriteHeadlineFlow = ai.defineFlow(
  {
    name: 'rewriteHeadlineFlow',
    inputSchema: RewriteHeadlineInputSchema,
    outputSchema: RewriteHeadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
