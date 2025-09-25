'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, FileText, Briefcase, Upload } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import * as pdfjs from 'pdfjs-dist';

// Required for pdfjs-dist to work
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface WelcomeViewProps {
  onAnalyze: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Profile'
      )}
    </Button>
  );
}

export function WelcomeView({ onAnalyze }: WelcomeViewProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileText, setProfileText] = useState('');
  const { toast } = useToast();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Manually set the profileText in form data since its state is controlled
    formData.set('profileText', profileText);
    onAnalyze(formData);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
      });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n';
      }
      setProfileText(fullText);
      toast({
        title: 'PDF Processed',
        description: 'The text from your PDF has been extracted. You can now analyze your profile.',
      });
    } catch (error) {
      console.error('Error parsing PDF:', error);
      toast({
        variant: 'destructive',
        title: 'PDF Parsing Error',
        description: 'There was a problem reading the PDF file. Please try again or paste the text manually.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-muted/30 p-8 text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl md:text-4xl">
            Optimize Your LinkedIn Profile with AI
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Provide your professional background and career goal, and get AI-powered suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <label className="font-semibold text-lg flex items-center gap-2" htmlFor="pdf-upload-button">Start by uploading your resume</label>
                <Button 
                  id="pdf-upload-button"
                  type="button" 
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload PDF
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="application/pdf"
                />
                 <p className="text-sm text-muted-foreground">(Tip: On LinkedIn, click "More" → "Save to PDF")</p>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold flex items-center gap-2" htmlFor="profileText"><FileText/> Paste your text here</label>
              <Textarea
                id="profileText"
                name="profileText"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Copy and paste your profile text..."
                className="h-48 text-base"
                required
              />
            </div>
            
            <div className="space-y-2 pt-4">
              <label className="font-semibold flex items-center gap-2" htmlFor="careerGoal"><Briefcase/> Your Career Goal</label>
              <Input
                id="careerGoal"
                name="careerGoal"
                type="text"
                placeholder="e.g., 'Full-stack developer at a SaaS company'"
                className="h-12 text-base"
                required
              />
            </div>
            
            <div className="flex justify-center pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
