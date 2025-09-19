import React, { useState } from 'react';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { generateItinerary } from './services/geminiService';
import type { Itinerary } from './types';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateItinerary = async (
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
  ) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const result = await generateItinerary(city, startDate, endDate, preferences, tripPurpose, pace, companions, budget, arrivalTime, departureTime);
      setItinerary(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '發生未知錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleItineraryChange = (updatedItinerary: Itinerary) => {
    setItinerary(updatedItinerary);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="h-64 sm:h-72">
        <img 
          src="https://picsum.photos/1600/900?travel,city" 
          alt="Travel background" 
          className="w-full h-full object-cover"
        />
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            AI 自助旅遊行程產生器
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
          <ItineraryForm onSubmit={handleGenerateItinerary} isLoading={isLoading} minDate={today} />
        </div>

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {itinerary && <ItineraryDisplay itinerary={itinerary} onItineraryChange={handleItineraryChange} />}
          {!isLoading && !error && !itinerary && (
              <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6M9 7h6" />
                  </svg>
                  <h2 className="mt-4 text-2xl font-bold text-slate-700">準備好開始您的冒險了嗎？</h2>
                  <p className="mt-2 text-slate-600">
                      填寫上方表單，讓我們為您規劃下一趟精彩的旅程！
                  </p>
              </div>
          )}
        </div>
      </main>

      <footer className="text-center p-6 mt-8 text-slate-600 text-sm">
        <p>由 Gemini API 強力驅動 | 專為現代旅行者設計</p>
      </footer>
    </div>
  );
};

export default App;