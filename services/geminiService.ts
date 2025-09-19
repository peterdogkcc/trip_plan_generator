export const validateCity = async (city) => {
  if (!city || city.trim().length === 0) {
    return false;
  }
  
  try {
    const response = await fetch('/api/validate-city', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `城市驗證失敗 (HTTP ${response.status})`);
    }

    const result = await response.json();
    return result.isValid;
  } catch (error) {
    console.error("City validation fetch failed:", error);
    throw new Error(error instanceof Error ? error.message : '無法連線至驗證服務，請檢查您的網路連線。');
  }
};


export const generateItinerary = async (
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
) => {

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `行程生成失敗 (HTTP ${response.status})`);
    }

    const itineraryData = await response.json();
    if (!itineraryData || !itineraryData.tripTitle) {
        throw new Error("從伺服器收到的行程資料格式不正確。");
    }
    return itineraryData;

  } catch (error) {
    console.error("Itinerary generation fetch failed:", error);
    throw new Error(error instanceof Error ? error.message : '無法連線至行程規劃服務，請檢查您的網路連線。');
  }
};
