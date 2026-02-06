
import { GoogleGenAI } from "@google/genai";

export const getWordExplanation = async (word: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a friendly English teacher for 6-year-old children. Briefly explain the word "${word}" in very simple English and one Chinese sentence. Use an encouraging tone.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Sorry, I can't explain that right now!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Let's learn this word together!";
  }
};
