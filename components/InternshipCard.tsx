import React from 'react';
import { Internship } from '../types';

interface InternshipCardProps {
  internship: Internship;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full shadow-2xl">
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900">{internship.role}</h3>
        <p className="text-md font-semibold text-blue-600">{internship.company}</p>
        <p className="text-sm text-gray-500 mb-4">{internship.location}</p>
        <p className="text-gray-700 text-sm mb-4 flex-grow">{internship.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800">✅ Why it's a Match for You:</h4>
          <p className="text-gray-600 text-sm">{internship.matchReason}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800">💡 Application Tips:</h4>
          <p className="text-gray-600 text-sm">{internship.applicationTips}</p>
        </div>
        
        <div className="mt-auto pt-4">
            <a href={internship.applyLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
            Apply Now
            </a>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;