import React from 'react';
import { Internship } from '../types';
import InternshipCard from './InternshipCard';

interface InternshipListProps {
  internships: Internship[];
}

const InternshipList: React.FC<InternshipListProps> = ({ internships }) => {
  if (internships.length === 0) {
    return (
        <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl mt-12 text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">No Matches Found</h2>
            <p className="text-gray-600">The AI couldn't find a strong match from our current list of opportunities. Try adjusting your interests or check back later!</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Your AI-Curated Internship Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship, index) => (
          <InternshipCard key={index} internship={internship} />
        ))}
      </div>
    </div>
  );
};

export default InternshipList;