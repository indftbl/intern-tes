'use server';

/**
 * @fileOverview Rewrites the LinkedIn About section to be more engaging and tailored to the user's desired job role.
 *
 * - rewriteAboutSection - A function that rewrites the About section.
 * - RewriteAboutSectionInput - The input type for the rewriteAboutSection function.
 * - RewriteAboutSectionOutput - The return type for the rewriteAboutSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteAboutSectionInputSchema = z.object({
  aboutSection: z.string().optional().describe('The current About section of the LinkedIn profile.'),
  careerGoal: z.string().describe('The user\'s desired job role or career goal.'),
  relevantSkills: z.string().optional().describe('A comma-separated list of relevant skills to highlight.'),
  profileText: z.string().describe('The full text of the LinkedIn profile, which includes experience, projects, and accomplishments.'),
});
export type RewriteAboutSectionInput = z.infer<typeof RewriteAboutSectionInputSchema>;

const RewriteAboutSectionOutputSchema = z.object({
  rewrittenAboutSection: z.string().describe('The rewritten About section of the LinkedIn profile.'),
});
export type RewriteAboutSectionOutput = z.infer<typeof RewriteAboutSectionOutputSchema>;

export async function rewriteAboutSection(input: RewriteAboutSectionInput): Promise<RewriteAboutSectionOutput> {
  return rewriteAboutSectionFlow(input);
}

const rewriteAboutSectionPrompt = ai.definePrompt({
  name: 'rewriteAboutSectionPrompt',
  input: {schema: RewriteAboutSectionInputSchema},
  output: {schema: RewriteAboutSectionOutputSchema},
  prompt: `You are a LinkedIn profile optimization expert. Your task is to rewrite the About section of a user's LinkedIn profile to be more engaging and tailored to their desired job role.

First, extract the user's existing About section, their work experience, projects, and accomplishments from the full profile text provided.

The user's career goal is: {{careerGoal}}

Full Profile Text:
---
{{profileText}}
---

Based on the user's career goal and the entire profile content, rewrite the About section. It should be engaging, highlight their most relevant skills and experiences, and be aligned with their career aspirations. Weave in summaries of their key experiences, projects, and accomplishments naturally.
`,
});

const rewriteAboutSectionFlow = ai.defineFlow(
  {
    name: 'rewriteAboutSectionFlow',
    inputSchema: RewriteAboutSectionInputSchema,
    outputSchema: RewriteAboutSectionOutputSchema,
  },
  async input => {
    const {output} = await rewriteAboutSectionPrompt(input);
    return output!;
  }
);
