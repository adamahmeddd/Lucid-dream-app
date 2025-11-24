import { GoogleGenAI, Type } from "@google/genai";
import { DreamAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize safe client
const ai = new GoogleGenAI({ apiKey });

// 1. Analyze Dream Text
export const analyzeDreamContent = async (dreamText: string): Promise<DreamAnalysis> => {
  if (!apiKey) throw new Error("API Key missing");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze the following dream entry. Provide a title, a brief summary, a psychological or symbolic interpretation, the dominant mood, a sentiment score from 0 (nightmare) to 100 (blissful), relevant tags, and a hex color code that represents the feeling of the dream.
    
    Dream: "${dreamText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          interpretation: { type: Type.STRING },
          mood: { type: Type.STRING },
          sentimentScore: { type: Type.NUMBER },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          colorHex: { type: Type.STRING, description: "A valid hex color code (e.g. #FF5733)" },
        },
        required: ["title", "summary", "interpretation", "mood", "sentimentScore", "tags", "colorHex"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No analysis returned");
  return JSON.parse(text) as DreamAnalysis;
};

// 2. Generate Dream Image
export const generateDreamVisual = async (dreamText: string, mood: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  // Using flash-image for speed and efficiency as per guidelines for general tasks
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Create a dreamlike, artistic, and abstract digital painting representing this dream description: "${dreamText}". The mood is ${mood}. Style: ethereal, surreal, soft lighting, masterpiece.`,
        },
      ],
    },
    config: {
        // Image generation doesn't support responseSchema/MimeType on this model usually, 
        // relying on default behavior returning inlineData.
    }
  });

  // Extract image from response
  // The response structure for images in generateContent for this model usually involves finding the inlineData in parts.
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
      }
  }
  
  throw new Error("Failed to generate image");
};

// 3. Chat with Dream (Oracle)
// We'll return a chat session object to manage state in the component
export const createDreamChat = (dreamContext: string) => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are the Spirit of the Dream. You are a wise, mystical, and gentle companion. 
            The user will discuss a specific dream they had. Your goal is to help them explore deeper meanings, 
            ask thought-provoking questions, and provide comforting insights.
            
            Context of the dream: "${dreamContext}"
            `
        }
    });
};
