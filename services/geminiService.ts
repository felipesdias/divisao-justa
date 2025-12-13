import { GoogleGenAI, Type } from "@google/genai";
import { Person } from "../types";

// Helper to generate IDs since the AI won't generate them
const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseExpensesWithGemini = async (text: string, customApiKey?: string): Promise<Person[]> => {
  const apiKey = customApiKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key não configurada");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract a list of people, what they paid for (description), and the amount they paid from the following text. 
      Text: "${text}"
      
      Return the data strictly as a JSON array of objects.
      Properties:
      - 'name' (string): Name of the person (use standard capitalization).
      - 'paid' (number): Amount paid. Convert currency to raw number.
      - 'description' (string): Short description of what was purchased (e.g., "Uber", "Drinks"). If not specified, leave empty string.
      
      If the text mentions the same person multiple times, list them as separate entries in the array (do not sum them up yourself).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "Name of the person",
              },
              paid: {
                type: Type.NUMBER,
                description: "Amount paid by the person",
              },
              description: {
                type: Type.STRING,
                description: "What the person paid for",
              }
            },
            required: ["name", "paid"],
          },
        },
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map to our internal Person structure
    return rawData.map((item: { name: string; paid: number; description?: string }) => ({
      id: generateId(),
      name: item.name,
      paid: Number(item.paid),
      description: item.description || '',
      quantity: 1,
      observation: ''
    }));

  } catch (error) {
    console.error("Gemini parsing error:", error);
    throw new Error("Falha ao processar o texto com IA. Verifique sua chave ou se o formato está compreensível.");
  }
};