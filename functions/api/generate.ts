import { GoogleGenAI, Type } from "https://esm.sh/@google/genai@1.20.0";

// The handler for POST requests for Cloudflare Pages Functions
export const onRequestPost = async (context) => {
  // context object contains request, env, params, etc.
  const { request, env } = context;

  // Explicitly check if the API key is configured in the Cloudflare environment
  if (!env.API_KEY) {
    console.error('API_KEY environment variable not set');
    return new Response(JSON.stringify({ error: 'Server configuration error: API_KEY is missing.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const { 
      city,
      startDate,
      endDate,
      preferences,
      tripPurpose,
      pace,
      companions,
      budget,
      arrivalTime,
      departureTime
    } = await request.json();

    if (!city || !startDate || !endDate || !tripPurpose || !pace || !companions || !budget) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });

    const schema = {
      type: Type.OBJECT,
      properties: {
        tripTitle: {
          type: Type.STRING,
          description: "A creative and engaging title for the trip itinerary in Traditional Chinese. For example, '東京一週菁華遊：美食與文化探索之旅'."
        },
        dailyPlans: {
          type: Type.ARRAY,
          description: "An array of objects, where each object represents one day's plan.",
          items: {
            type: Type.OBJECT,
            properties: {
              date: {
                type: Type.STRING,
                description: "The specific date for this day's plan in YYYY-MM-DD format."
              },
              day: {
                type: Type.STRING,
                description: "The day of the week and its sequence in the trip, in Traditional Chinese, e.g., '第一天：星期六'."
              },
              activities: {
                type: Type.ARRAY,
                description: "An array of activities planned for the day.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: {
                      type: Type.STRING,
                      description: "The suggested time range for the activity, e.g., '09:00 - 11:00'."
                    },
                    title: {
                      type: Type.STRING,
                      description: "A concise and descriptive title for the activity in Traditional Chinese, e.g., '參觀淺草寺'."
                    },
                    description: {
                      type: Type.STRING,
                      description: "A detailed description of the activity in Traditional Chinese, including what to do, why it's interesting, and any relevant tips. Should be 2-3 sentences long."
                    }
                  },
                  required: ["time", "title", "description"]
                }
              }
            },
            required: ["date", "day", "activities"]
          }
        }
      },
      required: ["tripTitle", "dailyPlans"]
    };

    const prompt = `
      You are an expert travel planner. Create a personalized travel itinerary based on the following details.
      Generate a detailed, day-by-day plan. Ensure the activities are logical, consider travel time between locations, and align with the user's preferences.
      The entire response, including all text in the JSON output, must be in Traditional Chinese (繁體中文).

      **Trip Details:**
      - Destination(s): ${city}
      - Dates: From ${startDate} to ${endDate}
      - Trip Purpose: ${tripPurpose}
      - Travel Pace: ${pace}
      - Companions: ${companions}
      - Budget: ${budget}
      - First Day Arrival Time: ${arrivalTime || 'Not specified'}
      - Last Day Departure Time: ${departureTime || 'Not specified'}
      - User Preferences: ${preferences || 'None specified. Please suggest popular and well-rounded activities.'}

      Please generate the itinerary that strictly follows the provided JSON schema. The dates in the daily plans must correctly correspond to the trip duration from the start date to the end date.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const itineraryJson = response.text;

    return new Response(itineraryJson, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
