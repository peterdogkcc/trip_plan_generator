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

const jsonSchema = {
  type: "object",
  properties: {
    tripTitle: {
      type: "string",
      description: "行程的總標題，例如 '日本關東關西十日遊'",
    },
    dailyPlans: {
      type: "array",
      description: "每日行程規劃的陣列",
      items: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "當天日期，格式 YYYY-MM-DD",
          },
          day: {
            type: "string",
            description: "行程的第幾天，例如 '第一天'",
          },
          activities: {
            type: "array",
            description: "當天的活動列表",
            items: {
              type: "object",
              properties: {
                time: {
                  type: "string",
                  description: "建議時間區間，例如 '早上 9:00 - 12:00'",
                },
                title: {
                  type: "string",
                  description: "活動或景點名稱，可包含所在城市，例如 '[東京] 參觀淺草寺'",
                },
                description: {
                  type: "string",
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
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
    } = await context.request.json();

    if (!city || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const apiKey = context.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured in Cloudflare environment.");
    }

    const preferencesDetails = [
      tripPurpose && `旅行目的: ${tripPurpose}`,
      pace && `旅行節奏: ${pace}`,
      companions && `同行者: ${companions}`,
      budget && `預算範圍: ${budget}`,
      preferences && `其他偏好: ${preferences}`
    ].filter(Boolean).join('； ');
  
    const flightInfo = [];
    if (arrivalTime) {
      flightInfo.push(`第一天的航班抵達時間是 ${arrivalTime}。請將此時間納入考量，第一天的行程應從抵達後開始，並包含從機場到住宿地點的交通時間建議。`);
    }
    if (departureTime) {
      flightInfo.push(`最後一天的航班離開時間是 ${departureTime}。請將此時間納入考量，最後一天的行程應在班機起飛前至少3-4小時結束，並包含從市區到機場的交通時間建議。`);
    }

    const prompt = `
    請為我規劃一份在多個城市「${city}」的旅遊行程，日期從 ${startDate} 到 ${endDate}。
    這是一趟多城市之旅，請嚴格按照使用者輸入的順序來規劃行程：${city}。
    請根據總旅遊天數，智慧地為每個城市分配停留時間，並在行程中規劃城市間的交通方式與時間。
    
    我的旅行需求如下：
    ${preferencesDetails || '無特別偏好，請規劃包含經典景點與當地美食的均衡行程。'}
    
    ${flightInfo.length > 0 ? `重要航班資訊：\n${flightInfo.join('\n')}` : ''}
    
    請以一個專業旅遊規劃師的身份，提供一份詳細、流暢且合理的每日行程。
    請根據上述的旅行需求（尤其是預算、節奏和同行者）來推薦合適的景點、餐廳和活動。
    行程總標題應能反映這是一趟多城市之旅。
    每日計畫應包含日期（YYYY-MM-DD 格式）和當天是第幾天。
    每個活動應包含建議時間、活動標題（標題請盡量註明所在城市，例如 '[東京] 參觀淺草寺'），以及簡短描述。
    請以繁體中文回覆，並嚴格遵循指定的 JSON schema 格式。
    `;
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{
          functionDeclarations: [{
            name: "format_itinerary",
            description: "Formats the itinerary into the specified JSON structure.",
            parameters: jsonSchema
          }]
        }],
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: ["format_itinerary"]
          }
        }
      })
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Google AI API Error:", errorBody);
        throw new Error(`Google AI API request failed with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    const functionCall = responseData.candidates?.[0]?.content?.parts?.find(part => part.functionCall);
    
    if (!functionCall?.functionCall?.args) {
      console.error("Invalid response structure from API:", JSON.stringify(responseData, null, 2));
      throw new Error("API 未返回有效的行程資料，請檢查提示詞或模型設定。");
    }

    const itineraryData = functionCall.functionCall.args;
    
    return new Response(JSON.stringify(itineraryData), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Itinerary generation function failed:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
