import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'CareerSpark',
  description: 'AI-powered LinkedIn profile optimization for students and early-career professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="relative isolate min-h-screen">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="color-blob -top-40 -left-80 w-[40rem] h-[40rem] bg-primary/50"></div>
            <div className="color-blob top-0 right-0 w-[30rem] h-[30rem] bg-accent/50 animation-delay-2000"></div>
            <div className="color-blob bottom-20 right-40 w-[20rem] h-[20rem] bg-secondary/50 animation-delay-4000"></div>
          </div>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}