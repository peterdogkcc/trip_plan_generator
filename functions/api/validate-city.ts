import { GoogleGenAI } from "https://esm.sh/@google/genai@1.20.0";

export const onRequestPost = async (context) => {
  const { request, env } = context;

  if (!env.API_KEY) {
    console.error('API_KEY environment variable not set');
    return new Response(JSON.stringify({ error: 'Server configuration error: API_KEY is missing.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { city } = await request.json();

    if (!city || typeof city !== 'string' || city.trim() === '') {
      // The frontend should handle empty strings, but as a safeguard:
      return new Response(JSON.stringify({ isValid: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });

    const prompt = `
      You are a geographical location validation assistant. I will provide you with a string that is supposed to be one or more travel destinations (cities, regions, countries).
      Your task is to determine if the string represents real, recognizable geographical locations.
      The input is: "${city}"
      Please analyze this string. If it contains at least one valid, recognizable location (e.g., "Paris", "Tokyo, Osaka", "California"), respond with only the word "VALID".
      If the string appears to be gibberish, a random sequence of characters, or clearly not a location (e.g., "asdfghjkl", "123456", "not a city"), respond with only the word "INVALID".
      Do not provide any explanation or any other text in your response. Just "VALID" or "INVALID".
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0,
      },
    });

    const resultText = response.text.trim().toUpperCase();
    const isValid = resultText === 'VALID';
    
    return new Response(JSON.stringify({ isValid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error validating city:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
