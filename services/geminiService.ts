import { GoogleGenAI, Type, Part } from "@google/genai";
import { StudentData, Internship } from "../types";

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR4WtPfht2m5e6bj-5MI5hhQMDy3tOEDflQfgxcd2pIFPMeH1WZEgwfOrlgoIm6r5IqAcOEspWqbGen/pub?gid=0&single=true&output=csv';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const parseResume = async (resumeFile: File): Promise<Partial<StudentData>> => {
    const model = "gemini-2.5-flash";
    const resumePart = await fileToGenerativePart(resumeFile);

    const prompt = `You are an expert Applicant Tracking System (ATS). Analyze the provided resume and extract the following information. If a field is not present, return an empty string "".
    - Full Name
    - University Name
    - Major or Field of Study
    - Expected Graduation Year
    - A brief summary of key skills and interests relevant to internships.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [resumePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        university: { type: Type.STRING },
                        major: { type: Type.STRING },
                        graduationYear: { type: Type.STRING },
                        interests: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error parsing resume:", error);
        throw new Error("AI failed to parse resume. Please fill the form manually.");
    }
};

export const findInternships = async (studentData: StudentData): Promise<Internship[]> => {
    // FIX: This comparison was causing a TypeScript error because GOOGLE_SHEET_CSV_URL is a constant and can never be equal to the placeholder string.
    if (!GOOGLE_SHEET_CSV_URL) {
        throw new Error('Google Sheet URL is not configured.');
    }

    const sheetResponse = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!sheetResponse.ok) {
        throw new Error('Failed to fetch internship data from Google Sheet.');
    }
    const internshipCsv = await sheetResponse.text();

    const model = "gemini-2.5-flash";
    const prompt = `
        You are an expert career counselor AI. Your task is to match a student with the most relevant internships from a provided list.

        Student Profile:
        - University: ${studentData.university}
        - Major: ${studentData.major}
        - Graduation Year: ${studentData.graduationYear}
        - Interests & Skills: ${studentData.interests}

        Here is the list of available internships in CSV format:
        ---
        ${internshipCsv}
        ---

        Analyze the student's profile and the list of internships. Select the top 3-5 most relevant internships for the student. For each selected internship, provide:
        1. A "matchReason": A concise, one-sentence explanation of why this role is a great fit for the student.
        2. "applicationTips": A short, actionable tip to help the student's application stand out for this specific role.

        Return ONLY a JSON array of the matched internships, including the original company, role, location, description, and applyLink, plus your generated matchReason and applicationTips.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            company: { type: Type.STRING },
                            role: { type: Type.STRING },
                            location: { type: Type.STRING },
                            description: { type: Type.STRING },
                            matchReason: { type: Type.STRING },
                            applicationTips: { type: Type.STRING },
                            applyLink: { type: Type.STRING },
                        },
                        required: ["company", "role", "location", "description", "matchReason", "applicationTips", "applyLink"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error finding internships:", error);
        throw new Error("AI failed to generate internship matches.");
    }
};