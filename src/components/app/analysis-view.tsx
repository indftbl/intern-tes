import type { AnalysisResult } from '@/lib/types';
import { ResultCard } from '@/components/app/result-card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, Tags, Lightbulb } from 'lucide-react';

interface AnalysisViewProps {
  analysis: AnalysisResult;
}

function DiffViewer({ newText }: { newText: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm text-accent-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI-Optimized Version
        </h4>
        <p className="p-4 bg-accent/10 border border-accent rounded-md text-sm">{newText}</p>
      </div>
    </div>
  );
}


export function AnalysisView({ analysis }: AnalysisViewProps) {
  return (
    <div className="flex flex-col gap-8">
       <div className="text-center">
            <h2 className="text-3xl font-bold font-headline">Your Profile Analysis is Ready!</h2>
            <p className="text-muted-foreground mt-2">Here are the AI-powered recommendations to boost your professional presence.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard
          title="Optimized Headline"
          icon={<Sparkles className="text-primary" />}
        >
          <DiffViewer newText={analysis.rewrittenHeadline} />
        </ResultCard>

        <ResultCard
          title="Keyword Suggestions"
          icon={<Tags className="text-primary" />}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Incorporate these keywords throughout your profile (headline, about, experience) to improve your visibility in recruiter searches.
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.suggestedKeywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-base py-1 px-3">
                {keyword}
              </Badge>
            ))}
          </div>
        </ResultCard>
      </div>
      
      <ResultCard
        title="Rewritten About Section"
        icon={<FileText className="text-primary" />}
      >
        <DiffViewer newText={analysis.rewrittenAboutSection} />
      </ResultCard>

      <ResultCard
        title="Experience & Skills Tips"
        icon={<Lightbulb className="text-primary" />}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: analysis.improvementTips.replace(/\n/g, '<br />') }} />
      </ResultCard>
    </div>
  );
}
