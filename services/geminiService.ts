import type { Itinerary } from '../types.ts';

export const generateItinerary = async (
  city: string,
  startDate: string,
  endDate: string,
  preferences: string,
  tripPurpose: string,
  pace: string,
  companions: string,
  budget: string,
  arrivalTime: string,
  departureTime: string
): Promise<Itinerary> => {
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
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred', details: response.statusText }));
    throw new Error(errorData.details || errorData.error || 'Failed to generate itinerary.');
  }

  const data = await response.json();
  return data as Itinerary;
};

export const validateCity = async (city: string): Promise<boolean> => {
  if (!city.trim()) {
    return true; // Don't validate empty strings.
  }
  const response = await fetch('/api/validate-city', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred', details: response.statusText }));
    throw new Error(errorData.details || errorData.error || 'Failed to validate city.');
  }

  const data = await response.json();
  return data.isValid;
};
