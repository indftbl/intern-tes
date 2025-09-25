'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { PageHeader } from '@/components/app/page-header';
import { WelcomeView } from '@/components/app/welcome-view';
import { LoadingView } from '@/components/app/loading-view';
import { AnalysisView } from '@/components/app/analysis-view';
import { analyzeProfileAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async (formData: FormData) => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeProfileAction(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      setAnalysis(result.analysis);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: `There was a problem analyzing the profile. ${errorMessage}`,
      });
      // Reset to initial state on error
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setAnalysis(null);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative z-10">
        <Card className="bg-primary/10 border-primary/40 mb-8">
            <CardHeader className='flex-col sm:flex-row items-start sm:items-center gap-4'>
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                    </div>
                </div>
                <div className="flex-grow">
                    <CardTitle>Get Enhanced Suggestions</CardTitle>
                    <p className="text-foreground/80">Subscribe now to unlock deeper analysis, industry-specific keywords, and personalized career path guidance.</p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <a href="https://form.typeform.com/to/U0EMWosJ" target="_blank" rel="noopener noreferrer">
                            Subscribe Now
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardHeader>
        </Card>

        {isLoading ? (
          <LoadingView />
        ) : analysis ? (
          <div className="flex flex-col gap-8">
            <div className="flex justify-end">
                <Button onClick={handleReset}>Analyze Another Profile</Button>
            </div>
            <AnalysisView analysis={analysis} />
          </div>
        ) : (
          <WelcomeView onAnalyze={handleAnalysis} />
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        <p>Built with Next.js and Genkit. Powered by AI.</p>
      </footer>
    </div>
  );
}
