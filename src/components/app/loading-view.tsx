import { Skeleton } from '@/components/ui/skeleton';
import { ResultCard } from '@/components/app/result-card';
import { Sparkles, FileText, Tags, Lightbulb } from 'lucide-react';

export function LoadingView() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
        <div className="text-center">
            <h2 className="text-3xl font-bold font-headline">Analyzing Your Profile...</h2>
            <p className="text-muted-foreground mt-2">Our AI is working its magic. This should only take a moment.</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard
          title="Optimized Headline"
          icon={<Sparkles className="text-accent" />}
        >
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        </ResultCard>

        <ResultCard
          title="Keyword Suggestions"
          icon={<Tags className="text-accent" />}
        >
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </ResultCard>
      </div>

      <ResultCard
        title="Rewritten About Section"
        icon={<FileText className="text-accent" />}
      >
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </ResultCard>

      <ResultCard
        title="Experience & Skills Tips"
        icon={<Lightbulb className="text-accent" />}
      >
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </ResultCard>
    </div>
  );
}
