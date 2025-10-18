// Assuming a new file like "@/lib/gemini.ts"
import { GoogleGenAI } from "@google/genai";

// Ensure GEMINI_API_KEY is set in your .env
export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });