// Cloudflare Pages Function types
interface EventContext<Env, P extends string, Data> {
    request: Request;
    env: Env;
    params: Record<P, string | string[]>;
    waitUntil: (promise: Promise<any>) => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    data: Data;
}
type PagesFunction<Env = unknown> = (context: EventContext<Env, any, any>) => Response | Promise<Response>;
interface Env { API_KEY: string; }

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { city } = await context.request.json();

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'City is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const apiKey = context.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured in Cloudflare environment.");
    }
    
    const prompt = `Consider this list of locations: "${city}". Are all items in this list known cities, countries, or major tourist destinations? Answer with only "Yes" or "No".`;
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 5,
            }
        })
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Google AI API Error:", errorBody);
        throw new Error(`Google AI API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    const resultText = responseData.candidates[0].content.parts[0].text.trim().toLowerCase();
    const isValid = resultText.startsWith('yes');

    return new Response(JSON.stringify({ isValid }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("City validation function failed:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
