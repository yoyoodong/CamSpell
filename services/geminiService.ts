
import { GoogleGenAI } from "@google/genai";

export const getWordExplanation = async (word: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a creative and friendly English teacher for 6-year-old Chinese children. 
      Briefly explain the word "${word}" in very simple English and one Chinese sentence.
      If possible, mention a fun "visual shape" hint (e.g., 'm' looks like waves). 
      Use an encouraging tone with emojis. Keep it under 40 words total.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Sorry, I can't explain that right now! But I believe in you!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Let's learn this word together! You're doing great! 🌟";
  }
};
