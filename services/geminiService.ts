
import { GoogleGenAI, Type } from "@google/genai";
import type { Itinerary } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: {
      type: Type.STRING,
      description: "行程的總標題，例如 '東京五日遊'",
    },
    dailyPlans: {
      type: Type.ARRAY,
      description: "每日行程規劃的陣列",
      items: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "當天日期，格式 YYYY-MM-DD",
          },
          day: {
            type: Type.STRING,
            description: "行程的第幾天，例如 '第一天'",
          },
          activities: {
            type: Type.ARRAY,
            description: "當天的活動列表",
            items: {
              type: Type.OBJECT,
              properties: {
                time: {
                  type: Type.STRING,
                  description: "建議時間區間，例如 '早上 9:00 - 12:00'",
                },
                title: {
                  type: Type.STRING,
                  description: "活動或景點名稱",
                },
                description: {
                  type: Type.STRING,
                  description: "活動的簡短描述，包含地點特色或建議",
                },
              },
              required: ["time", "title", "description"],
            },
          },
        },
        required: ["date", "day", "activities"],
      },
    },
  },
  required: ["tripTitle", "dailyPlans"],
};


export const generateItinerary = async (
  city: string,
  startDate: string,
  endDate: string,
  preferences: string
): Promise<Itinerary> => {

  const prompt = `
    請為我規劃一份在「${city}」的旅遊行程，日期從 ${startDate} 到 ${endDate}。
    我的個人偏好是：「${preferences || '無特別偏好，請規劃包含經典景點與當地美食的均衡行程'}」。
    請以一個專業旅遊規劃師的身份，提供一份詳細、流暢且合理的每日行程。
    行程標題應為 '${city}旅遊計畫' 或類似格式。
    每日計畫應包含日期（YYYY-MM-DD 格式）和當天是第幾天。
    每個活動應包含建議時間（例如 '早上 9:00 - 11:00'）、活動標題和一段簡短的描述。
    請以繁體中文回覆，並嚴格遵循指定的 JSON schema 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("API 回應為空，請檢查您的請求。");
    }
    
    // The response is already a JSON string, parse it.
    const itineraryData: Itinerary = JSON.parse(jsonText);
    return itineraryData;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    let errorMessage = "生成行程時發生錯誤。";
    if (error instanceof Error) {
        errorMessage += ` 詳細資訊: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};
