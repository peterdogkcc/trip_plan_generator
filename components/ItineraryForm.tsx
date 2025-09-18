import React, { useState } from 'react';

interface ItineraryFormProps {
  onSubmit: (city: string, startDate: string, endDate: string, preferences: string) => void;
  isLoading: boolean;
  minDate: string;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onSubmit, isLoading, minDate }) => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(minDate);
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !startDate || !endDate) {
      setError('城市和日期為必填欄位。');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('結束日期不能早於開始日期。');
      return;
    }
    setError(null);
    onSubmit(city, startDate, endDate, preferences);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (new Date(newStartDate) > new Date(endDate)) {
        setEndDate(newStartDate);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
            目的地城市
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="例如：東京"
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">
                開始日期
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
                min={minDate}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
                required
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">
                結束日期
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
                required
              />
            </div>
        </div>
      </div>
      <div>
        <label htmlFor="preferences" className="block text-sm font-medium text-slate-700 mb-1">
          旅遊偏好 (選填)
        </label>
        <textarea
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="例如：喜歡博物館、親子友善、想吃當地小吃..."
          rows={3}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
        />
      </div>
      
      {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">{error}</div>}

      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              規劃中...
            </>
          ) : (
            '生成我的專屬行程'
          )}
        </button>
      </div>
    </form>
  );
};

export default ItineraryForm;