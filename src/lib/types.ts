export type AnalysisResult = {
  rewrittenHeadline: string;
  rewrittenAboutSection: string;
  suggestedKeywords: string[];
  improvementTips: string;
  originalProfileText?: string;
};

export type ProfileData = {
  currentHeadline: string;
  aboutSection: string;
  experienceSummary: string;
  projectSummary: string;
  accomplishmentSummary: string;
  profileSummary: string;
  careerGoal: string;
};
