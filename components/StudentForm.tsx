import React, { useState } from 'react';
import { StudentData } from '../types';
import { parseResume } from '../services/geminiService';

interface StudentFormProps {
  onSubmit: (studentData: StudentData) => void;
  isLoading: boolean;
}

const universities = [
  "American University of Sharjah",
  "Amity University Dubai",
  "Khalifa University",
  "London South Bank University",
  "Middlesex University Dubai",
  "New York University Abu Dhabi",
  "United Arab Emirates University",
  "University of Sharjah",
  "University of Wollongong",
  "Westford University College",
  "Zayed University"
];

const majors = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Marketing",
  "Finance",
  "Graphic Design",
  "Architecture",
  "Civil Engineering",
  "Data Science & AI",
  "Cybersecurity"
];

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<StudentData>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showOtherUniversity, setShowOtherUniversity] = useState(false);
  const [showOtherMajor, setShowOtherMajor] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      setIsParsing(true);
      setError('');
      try {
        const parsedData = await parseResume(file);
        setFormData(prev => ({...prev, ...parsedData}));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during parsing.');
      } finally {
        setIsParsing(false);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'university' && value === 'Other') {
        setShowOtherUniversity(true);
        setFormData(prev => ({ ...prev, university: '' }));
    } else if (name === 'major' && value === 'Other') {
        setShowOtherMajor(true);
        setFormData(prev => ({ ...prev, major: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.university || !formData.major || !formData.graduationYear || !formData.interests) {
      setError('Please fill out all fields before submitting.');
      return;
    }
    setError('');
    onSubmit(formData as StudentData);
  };
  
  const inputStyles = "relative block w-full appearance-none rounded-md border border-gray-300 bg-gray-50/50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition";
  const selectStyles = `${inputStyles} pr-8`;
  const floatingLabelStyles = "absolute left-3 -top-2.5 bg-gray-50/50 px-1 text-xs text-gray-500 transition-all pointer-events-none";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Start with Your Resume
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>}
        
        <div>
          <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload Resume to Autofill (PDF, DOCX)</label>
          <input 
            id="resume-upload" 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.docx,.txt"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />
          {isParsing && <p className="text-blue-600 text-sm mt-2 text-center">AI is analyzing your resume...</p>}
          {resumeFile && !isParsing && <p className="text-xs text-gray-500 mt-1">Selected: {resumeFile.name}</p>}
        </div>

        <div className="h-px bg-gray-200"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className={inputStyles} placeholder=" " />
            <label htmlFor="name" className={floatingLabelStyles}>Full Name</label>
          </div>
          <div className="relative">
            <input type="text" id="graduationYear" name="graduationYear" value={formData.graduationYear || ''} onChange={handleChange} required className={inputStyles} placeholder=" " />
            <label htmlFor="graduationYear" className={floatingLabelStyles}>Graduation Year</label>
          </div>
        </div>

        <div className="relative">
            {!showOtherUniversity ? (
                <>
                <select name="university" id="university" value={formData.university || ''} onChange={handleChange} required className={selectStyles}>
                    <option value="" disabled>Select your university</option>
                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                    <option value="Other" className="font-bold">Other</option>
                </select>
                <label htmlFor="university" className={floatingLabelStyles}>University</label>
                </>
            ) : (
                <input type="text" name="university" placeholder="Please specify your university" value={formData.university || ''} onChange={handleChange} required className={inputStyles} />
            )}
        </div>
        
        <div className="relative">
            {!showOtherMajor ? (
                <>
                <select name="major" id="major" value={formData.major || ''} onChange={handleChange} required className={selectStyles}>
                    <option value="" disabled>Select your major</option>
                    {majors.map(m => <option key={m} value={m}>{m}</option>)}
                    <option value="Other" className="font-bold">Other</option>
                </select>
                <label htmlFor="major" className={floatingLabelStyles}>Major</label>
                </>
            ) : (
                <input type="text" name="major" placeholder="Please specify your major" value={formData.major || ''} onChange={handleChange} required className={inputStyles} />
            )}
        </div>

        <div className="relative">
          <textarea id="interests" name="interests" value={formData.interests || ''} onChange={handleChange} rows={3} required className={inputStyles} placeholder=" "></textarea>
          <label htmlFor="interests" className={floatingLabelStyles}>Interests & Skills</label>
        </div>
        
        <button type="submit" disabled={isLoading || isParsing} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition">
          {isLoading ? 'Finding Internships...' : 'Find My Internships'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;