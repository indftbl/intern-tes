'use server';

import { rewriteHeadline } from '@/ai/flows/rewrite-headline';
import { rewriteAboutSection } from '@/ai/flows/rewrite-about-section';
import { suggestKeywords } from '@/ai/flows/suggest-keywords';
import { analyzeLinkedInProfile } from '@/ai/flows/analyze-linkedin-profile';
import type { AnalysisResult } from '@/lib/types';

type FormState = {
  analysis: AnalysisResult | null;
  error: string | null;
};

export async function analyzeProfileAction(
  formData: FormData
): Promise<FormState> {
  const profileText = formData.get('profileText') as string;
  const careerGoal = formData.get('careerGoal') as string;

  if (!careerGoal) {
    return {
      analysis: null,
      error: 'Career goal is required.',
    };
  }
  
  if (!profileText) {
    return {
      analysis: null,
      error: 'Please provide your profile text.',
    };
  }

  try {
    const [
      headlineResult,
      aboutResult,
      keywordsResult,
      tipsResult,
    ] = await Promise.all([
      rewriteHeadline({
        currentHeadline: ``, // This will be extracted by the model from the profile text
        careerGoals: careerGoal,
        profileText: profileText,
      }),
      rewriteAboutSection({
        aboutSection: ``, // This will be extracted by the model from the profile text
        careerGoal: careerGoal,
        profileText: profileText,
        relevantSkills: '', // Skills will be extracted
      }),
      suggestKeywords({
        careerGoal: careerGoal,
        profileSummary: profileText,
      }),
      analyzeLinkedInProfile({
        profileText: profileText,
      }),
    ]);

    return {
      analysis: {
        rewrittenHeadline: headlineResult.rewrittenHeadline,
        rewrittenAboutSection: aboutResult.rewrittenAboutSection,
        suggestedKeywords: keywordsResult.keywords,
        improvementTips: tipsResult.analysis,
        originalProfileText: profileText
      },
      error: null,
    };
  } catch (error) {
    console.error('Error during profile analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      analysis: null,
      error: `Failed to analyze profile: ${errorMessage}`,
    };
  }
}
