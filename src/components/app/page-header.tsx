import { Sparkles } from 'lucide-react';

export function PageHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            CareerSpark
          </h1>
        </div>
      </div>
    </header>
  );
}
