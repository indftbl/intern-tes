import React, { useState } from 'react';
import { StudentData, Internship } from './types';
import { findInternships } from './services/geminiService';
import StudentForm from './components/StudentForm';
import InternshipList from './components/InternshipList';
import Loader from './components/Loader';
import EmailCapture from './components/EmailCapture';

const App: React.FC = () => {
  const [internships, setInternships] = useState<Internship[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const handleFormSubmit = async (studentData: StudentData) => {
    setIsLoading(true);
    setError(null);
    setInternships(null);
    setSearchCompleted(false);

    try {
      const results = await findInternships(studentData);
      setInternships(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error finding internships: ${err.message}. Please try again.`);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setSearchCompleted(true);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 relative z-10">
      <header className="pt-10 pb-4">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-2">
                Internship Navigator AI
            </h1>
            <p className="text-lg text-gray-600">
                Upload your resume. Let our AI find your future.
            </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StudentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        
        {isLoading && <Loader />}

        {error && (
          <div className="mt-8 text-center bg-red-50/90 backdrop-blur-xl border border-red-200 px-4 py-3 rounded-md max-w-2xl mx-auto shadow-xl">
            <p className="font-bold text-red-600">An Error Occurred</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {searchCompleted && !isLoading && (
          <>
            {internships && <InternshipList internships={internships} />}
            <EmailCapture />
          </>
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Internship Navigator. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;